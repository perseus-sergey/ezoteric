'use server';

import 'server-only';

import { and, eq, ilike, or, sql } from 'drizzle-orm';

import { tblArticle, tblArticleViews, tblTag } from './schema';
import { getDB } from './root';
import { ELanguage } from '@/models/language.model';
import { cache } from 'react';
import { TArticleFormValues } from '@/models/editArticle.model';
import { TArticleLocalized } from '@/models/article.model';

const { UA } = ELanguage;

const db = getDB();

export const getArticlesChunk = async ({
  offset,
  perPage,
  searchQuery = '',
  lang,
  isAdmin,
}: {
  offset: number;
  perPage: number;
  searchQuery?: string;
  lang: ELanguage;
  isAdmin: boolean;
}): Promise<{
  articles: TArticleLocalized[] | null;
  totalCount: number | null;
}> => {
  // Search condition
  const searchCondition = searchQuery
    ? ilike(tblArticle.titleEn, `%${searchQuery}%`)
    : undefined;

  const publishedCondition = eq(tblArticle.published, true);

  try {
    // Calculate total count of PUBLISHED articles
    const totalCountQuery = await db
      .select({
        total_count: sql<number>`COUNT(${tblArticle.id})`.mapWith(Number),
      })
      .from(tblArticle)
      .where(and(searchCondition, publishedCondition));

    const totalCount = totalCountQuery[0]?.total_count || 0;

    // Fetch articles with pagination
    const articles = await db.query.tblArticle.findMany({
      limit: perPage,
      offset,
      where: (article, { and }) =>
        and(searchCondition, isAdmin ? undefined : publishedCondition),
      columns: {
        id: true,
        updatedAt: true,
        createdAt: true,
        slug: true,
        imageSrc: true,
        published: true,
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
        viewCount: {
          columns: {
            viewCount: true,
          },
        },
      },
    });

    return { totalCount, articles };
  } catch (error) {
    console.error(
      'Failed to get articles from database.',
      'Error: ',
      error,
      (error as Error).message
    );
    return { totalCount: null, articles: null };
  }
};

// export type TArticles = Awaited<ReturnType<typeof getArticlesChunk>>['articles'];

// export const getArticlesChunk = async ({
//   offset,
//   perPage,
//   searchQuery = '',
//   lang,
//   isAdmin,
// }: {
//   offset: number;
//   perPage: number;
//   searchQuery?: string;
//   lang: ELanguage;
//   isAdmin: boolean;
// }): Promise<{
//   totalCount: number | null;
//   articles: TArticleLocalized[] | null;
// }> => {
//   // Search condition
//   const searchCondition = searchQuery
//     ? ilike(tblArticle.titleEn, `%${searchQuery}%`)
//     : undefined;

//   // Published condition
//   const publishedCondition = eq(tblArticle.published, true);

//   try {
//     // Calculate total count of PUBLISHED articles
//     const totalCountQuery = await db
//       .select({
//         total_count: sql<number>`COUNT(${tblArticle.id})`.mapWith(Number),
//       })
//       .from(tblArticle)
//       .where(and(searchCondition, publishedCondition));

//     const totalCount = totalCountQuery[0]?.total_count || 0;

//     // Fetch articles with pagination
//     const articles = await db
//       .select({
//         id: tblArticle.id,
//         title: tblArticle[lang === UA ? 'titleUa' : 'titleEn'],
//         description:
//           tblArticle[lang === UA ? 'descriptionUa' : 'descriptionEn'],
//         text: tblArticle[lang === UA ? 'textUa' : 'textEn'],
//         keywords: tblArticle[lang === UA ? 'keywordsUa' : 'keywordsEn'],
//         slug: tblArticle.slug,
//         createdAt: tblArticle.createdAt,
//         updatedAt: tblArticle.updatedAt,
//         imageSrc: tblArticle.imageSrc,
//         published: tblArticle.published,
//         viewCount: articleViewCounts.viewCount,
//       })
//       .from(tblArticle)
//       .leftJoin(
//         articleViewCounts,
//         eq(tblArticle.id, articleViewCounts.articleId)
//       )
//       .where(and(searchCondition, isAdmin ? undefined : publishedCondition))
//       .orderBy(desc(tblArticle.updatedAt))
//       .limit(perPage)
//       .offset(offset);

//     return { totalCount, articles };
//   } catch (error) {
//     console.error(
//       'Failed to get articles from database.',
//       'Error: ',
//       error,
//       (error as Error).message
//     );
//     return { totalCount: null, articles: null };
//   }
// };

export const getArticleBySlug = cache(
  async ({
    slug,
    lang,
  }: {
    slug: string;
    lang: ELanguage;
  }): Promise<TArticleLocalized | null> => {
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
          viewCount: {
            columns: {
              viewCount: true,
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

// export const getArticleBySlug = cache(
//   async ({
//     slug,
//     lang,
//   }: {
//     slug: string;
//     lang: ELanguage;
//   }): Promise<TArticleLocalized | null> => {
//     try {
//       // Перший запит - отримуємо статтю
//       const article = await db
//         .select({
//           id: tblArticle.id,
//           title: tblArticle[lang === UA ? 'titleUa' : 'titleEn'],
//           description:
//             tblArticle[lang === UA ? 'descriptionUa' : 'descriptionEn'],
//           text: tblArticle[lang === UA ? 'textUa' : 'textEn'],
//           keywords: tblArticle[lang === UA ? 'keywordsUa' : 'keywordsEn'],
//           slug: tblArticle.slug,
//           createdAt: tblArticle.createdAt,
//           updatedAt: tblArticle.updatedAt,
//           imageSrc: tblArticle.imageSrc,
//           published: tblArticle.published,
//           spotifyId: tblArticle.spotifyId,
//           viewCount: articleViewCounts.viewCount,
//         })
//         .from(tblArticle)
//         .leftJoin(
//           articleViewCounts,
//           eq(tblArticle.id, articleViewCounts.articleId)
//         )
//         .where(eq(tblArticle.slug, slug))
//         .limit(1);

//       if (!article[0]) return null;

//       // Другий запит - отримуємо теги для статті
//       const tags = await db
//         .select({
//           id: tblTag.id,
//           name: tblTag[lang === UA ? 'nameUa' : 'nameEn'],
//           slug: tblTag.slug,
//         })
//         .from(tblTag)
//         .innerJoin(tblArticleTag, eq(tblTag.id, tblArticleTag.tagId))
//         .where(eq(tblArticleTag.articleId, article[0].id));

//       // Повертаємо об'єднаний результат
//       return {
//         ...article[0],
//         tags,
//       };
//     } catch (error) {
//       console.error(
//         'Failed to get article from database',
//         'Error Name: ',
//         (error as Error).name
//       );
//       return null;
//     }
//   }
// );

// export const getArticleBySlug = cache(
//   async ({
//     slug,
//     lang,
//   }: {
//     slug: string;
//     lang: ELanguage;
//   }): Promise<TArticleLocalized | null> => {
//     try {
//       const res = await db
//         .select({
//           id: tblArticle.id,
//           title: tblArticle[lang === UA ? 'titleUa' : 'titleEn'],
//           description:
//             tblArticle[lang === UA ? 'descriptionUa' : 'descriptionEn'],
//           text: tblArticle[lang === UA ? 'textUa' : 'textEn'],
//           keywords: tblArticle[lang === UA ? 'keywordsUa' : 'keywordsEn'],
//           slug: tblArticle.slug,
//           createdAt: tblArticle.createdAt,
//           updatedAt: tblArticle.updatedAt,
//           imageSrc: tblArticle.imageSrc,
//           published: tblArticle.published,
//           spotifyId: tblArticle.spotifyId,
//           viewCount: articleViewCounts.viewCount,
//         })
//         .from(tblArticle)
//         .leftJoin(
//           articleViewCounts,
//           eq(tblArticle.id, articleViewCounts.articleId)
//         )
//         .where(eq(tblArticle.slug, slug))
//         .limit(1);

//       return res[0];
//     } catch (error) {
//       console.error(
//         'Failed to get 1 article from database',
//         'Error Name: ',
//         (error as Error).name
//       );
//       return null;
//     }
//   }
// );

export const getArticleByImage = async (imageSrc: string) => {
  const filters = [];

  filters.push(eq(tblArticle.published, true));
  filters.push(
    or(
      eq(tblArticle.imageSrc, imageSrc),
      sql`${tblArticle.textEn} LIKE ${`%${imageSrc}%`}`
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
    return error as Error;
  }
};

export async function getArticleByIdForUpdate(id: number) {
  try {
    const res = await db.query.tblArticle.findFirst({
      where: (articles, { eq }) => eq(articles.id, id),
    });

    return res || new Error(`Could not find article with id: ${id}`);
  } catch (error) {
    return error as Error;
  }
}

export const insertNewArticle = async (createdArticle: TArticleFormValues) => {
  try {
    const [res] = await db
      .insert(tblArticle)
      .values({
        ...createdArticle,
        createdAt: new Date(),
      })
      .returning({ updatedAt: tblArticle.updatedAt });
    return res;
  } catch (error) {
    return error as Error;
  }
};

export const updateArticle = async (
  updatedArticle: TArticleFormValues,
  articleId: number
) => {
  try {
    const [res] = await db
      .update(tblArticle)
      .set(updatedArticle)
      .where(eq(tblArticle.id, articleId))
      .returning({ updatedAt: tblArticle.updatedAt });
    return res;
  } catch (error) {
    return error as Error;
  }
};

// export const updateArticleView = async (id: number) => {
//   return await db
//     .update(tblArticle)
//     .set({ view: sql`${tblArticle.view || 0} + 1` })
//     .where(eq(tblArticle.id, id))
//     .returning();
// };
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
