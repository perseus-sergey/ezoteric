'use server';

import 'server-only';

import { and, eq, exists, or, sql } from 'drizzle-orm';

import {
  TArticle,
  tblArticle,
  tblArticleTag,
  tblArticleViews,
  tblTag,
  TTag,
} from './schema';
import { getDB } from './root';
import { ELanguage } from '@/models/language.model';
import { cache } from 'react';
import { TArticleFormValues } from '@/models/editArticle.model';
import { TArticleLocalized } from '@/models/article.model';
import { getTagsFromDb } from './queriesTag';
import { revalidateTag } from 'next/cache';
import { ESegment } from '@/models/url.model';

const { UA } = ELanguage;

const db = getDB();

export const getArticlesChunk = cache(
  async (
    offset: number,
    perPage: number,
    lang: ELanguage,
    isAdmin: boolean,
    searchQuery?: string,
    tagSlug?: string
  ): Promise<{
    articles: TArticleLocalized[] | null;
    totalCount: number | null;
    tagName: string | null;
  }> => {
    // Search condition
    const searchCondition = searchQuery
      ? sql`(
      setweight(to_tsvector(${lang === UA ? 'simple' : 'english'}, ${tblArticle[lang === UA ? 'titleUa' : 'titleEn']}), 'A') ||
      setweight(to_tsvector(${lang === UA ? 'simple' : 'english'}, ${tblArticle[lang === UA ? 'textUa' : 'textEn']}), 'B')
    ) @@ plainto_tsquery('english', ${searchQuery})`
      : undefined;

    const publishedCondition = eq(tblArticle.published, true);

    try {
      const [totalCountQuery, articles, tagName] = await Promise.all([
        // Calculate total count of PUBLISHED articles
        db
          .select({
            total_count: sql<number>`COUNT(${tblArticle.id})`.mapWith(Number),
          })
          .from(tblArticle)
          .where(
            and(
              searchCondition,
              publishedCondition,
              tagSlug
                ? exists(
                    db
                      .select()
                      .from(tblArticleTag)
                      .innerJoin(tblTag, eq(tblArticleTag.tagId, tblTag.id))
                      .where(
                        and(
                          eq(tblArticleTag.articleId, tblArticle.id),
                          eq(tblTag.slug, tagSlug)
                        )
                      )
                  )
                : undefined
            )
          ),

        // Fetch articles with pagination
        db.query.tblArticle.findMany({
          limit: perPage,
          offset,
          where: (article, { and }) =>
            and(
              searchCondition,
              isAdmin ? undefined : publishedCondition,
              tagSlug
                ? exists(
                    db
                      .select()
                      .from(tblArticleTag)
                      .innerJoin(tblTag, eq(tblArticleTag.tagId, tblTag.id))
                      .where(
                        and(
                          eq(tblArticleTag.articleId, article.id),
                          eq(tblTag.slug, tagSlug)
                        )
                      )
                  )
                : undefined
            ),
          orderBy: (articles, { desc }) => [desc(articles.updatedAt)],

          columns: {
            id: true,
            updatedAt: true,
            createdAt: true,
            slug: true,
            imageSrc: true,
            published: true,
            viewCount: true,
          },
          extras: {
            title:
              sql<string>`${tblArticle[lang === UA ? 'titleUa' : 'titleEn']}`.as(
                'title'
              ),
            description:
              sql<string>`${tblArticle[lang === UA ? 'descriptionUa' : 'descriptionEn']}`.as(
                'description'
              ),
          },
          with: {
            articleTags: {
              with: {
                tag: {
                  columns: {
                    id: true,
                    slug: true,
                  },
                  extras: {
                    name: sql<string>`${tblTag[lang === UA ? 'nameUa' : 'nameEn']}`.as(
                      'name'
                    ),
                  },
                },
              },
            },
          },
        }),

        // Запит на отримання тегу
        tagSlug
          ? db
              .select({
                name: tblTag[lang === UA ? 'nameUa' : 'nameEn'],
              })
              .from(tblTag)
              .where(eq(tblTag.slug, tagSlug))
              .limit(1)
          : Promise.resolve(null),
      ]);

      return {
        totalCount: totalCountQuery[0]?.total_count || 0,
        articles,
        tagName: tagName?.[0]?.name || null,
      };
    } catch (error) {
      console.error(
        'Failed to get articles from database.',
        'Error: ',
        (error as Error).message
      );
      return { totalCount: null, articles: null, tagName: null };
    }
  }
);

export const getArticleBySlug = cache(
  async (slug: string, lang: ELanguage): Promise<TArticleLocalized | null> => {
    try {
      const article = await db.query.tblArticle.findFirst({
        where: (article, { eq }) => eq(article.slug, slug),
        columns: {
          id: true,
          updatedAt: true,
          createdAt: true,
          slug: true,
          imageSrc: true,
          published: true,
          spotifyId: true,
          viewCount: true,
        },
        extras: {
          title:
            sql<string>`${tblArticle[lang === UA ? 'titleUa' : 'titleEn']}`.as(
              'title'
            ),
          description:
            sql<string>`${tblArticle[lang === UA ? 'descriptionUa' : 'descriptionEn']}`.as(
              'description'
            ),
          keywords:
            sql<string>`${tblArticle[lang === UA ? 'keywordsUa' : 'keywordsEn']}`.as(
              'keywords'
            ),
          text: sql<string>`${tblArticle[lang === UA ? 'textUa' : 'textEn']}`.as(
            'text'
          ),
        },
        with: {
          articleTags: {
            with: {
              tag: {
                columns: {
                  id: true,
                  slug: true,
                },
                extras: {
                  name: sql<string>`${tblTag[lang === UA ? 'nameUa' : 'nameEn']}`.as(
                    'name'
                  ),
                },
              },
            },
          },
        },
      });

      return article || null;
    } catch (error) {
      console.error(
        'Failed to get article from database',
        'Error Name: ',
        (error as Error).name
      );
      return null;
    }
  }
);

export const getArticleByImage = async (imageName: string) => {
  const filters = [];

  filters.push(eq(tblArticle.published, true));
  filters.push(
    or(
      sql`${tblArticle.imageSrc} LIKE ${`%${imageName}%`}`,
      sql`${tblArticle.textEn} LIKE ${`%${imageName}%`}`
    )
  );

  try {
    const res = await db
      .select({
        title: tblArticle.titleEn,
        slug: tblArticle.slug,
      })
      .from(tblArticle)
      .where(and(...filters))
      .limit(1);

    return res[0];
  } catch (error) {
    throw new Error(
      `Get Article By Image Source failed: ${(error as Error).message}`
    );
  }
};

export type TArticleWithTagsUpdated = TArticle & {
  articleTags: { tag: TTag }[];
};

export async function getArticleByIdForUpdate(
  id: number
): Promise<{ article: TArticleWithTagsUpdated; tags: TTag[] }> {
  try {
    const tags = await getTagsFromDb();

    const article = await db.query.tblArticle.findFirst({
      where: (articles, { eq }) => eq(articles.id, id),
      with: {
        articleTags: {
          with: { tag: true },
        },
      },
    });

    if (!article) {
      throw new Error(`Article with id: ${id} not found.`);
    }

    return { article, tags };
  } catch (error) {
    throw new Error(`Get Article By ID failed: ${(error as Error).message}`);
  }
}

export const insertNewArticle = async (newArticle: TArticleFormValues) => {
  const { tags, ...article } = newArticle;
  try {
    const res = await db.transaction(async (tx) => {
      const [insertedArticle] = await tx
        .insert(tblArticle)
        .values(article)
        .returning({ id: tblArticle.id, updatedAt: tblArticle.updatedAt });

      if (tags?.length) {
        await tx.insert(tblArticleTag).values(
          tags.map((tagId) => ({
            articleId: insertedArticle.id,
            tagId,
          }))
        );
      }

      return insertedArticle;
    });

    revalidateTag(ESegment.BLOG);

    return res;
  } catch (error) {
    throw new Error(`Insert New Article failed: ${(error as Error).message}`);
  }
};

export const updateArticle = async (
  updatedArticle: TArticleFormValues,
  articleId: number
) => {
  const { tags, ...article } = updatedArticle;
  try {
    const res = await db.transaction(async (tx) => {
      // Update article
      const [resTx] = await tx
        .update(tblArticle)
        .set(article)
        .where(eq(tblArticle.id, articleId))
        .returning({ updatedAt: tblArticle.updatedAt });

      // Delete existing tags
      await tx
        .delete(tblArticleTag)
        .where(eq(tblArticleTag.articleId, articleId));

      // Insert new tags
      if (tags?.length) {
        await tx.insert(tblArticleTag).values(
          tags.map((tagId) => ({
            articleId,
            tagId,
          }))
        );
      }

      return resTx;
    });
    return res;
  } catch (error) {
    throw new Error(`Update Article failed: ${(error as Error).message}`);
  }
};

export const updateArticleView = async (
  articleId: number,
  isAdmin: boolean
) => {
  if (process.env.NODE_ENV !== 'production' || isAdmin) return;

  try {
    await db.insert(tblArticleViews).values({ articleId });
  } catch (error) {
    console.error('Помилка при додаванні перегляду статті:', error);
  }
};
