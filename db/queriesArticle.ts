'use server';

import 'server-only';

import { and, desc, eq, ilike, or, sql } from 'drizzle-orm';

import {
  articleViewCounts,
  TArticleLocalized,
  tblArticle,
  tblArticleViews,
} from './schema';
import { getDB } from './root';
import { ELanguage } from '@/models/language.model';
import { cache } from 'react';
import { TArticleFormValues } from '@/models/editArticle.model';

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
  totalCount: number | null;
  articles: TArticleLocalized[] | null;
}> => {
  // Search condition
  const searchCondition = searchQuery
    ? ilike(tblArticle.titleEn, `%${searchQuery}%`)
    : undefined;

  // Published condition
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
    const articles = await db
      .select({
        id: tblArticle.id,
        title: tblArticle[lang === UA ? 'titleUa' : 'titleEn'],
        description:
          tblArticle[lang === UA ? 'descriptionUa' : 'descriptionEn'],
        text: tblArticle[lang === UA ? 'textUa' : 'textEn'],
        keywords: tblArticle[lang === UA ? 'keywordsUa' : 'keywordsEn'],
        slug: tblArticle.slug,
        createdAt: tblArticle.createdAt,
        updatedAt: tblArticle.updatedAt,
        imageSrc: tblArticle.imageSrc,
        published: tblArticle.published,
        viewCount: articleViewCounts.viewCount,
      })
      .from(tblArticle)
      .leftJoin(
        articleViewCounts,
        eq(tblArticle.id, articleViewCounts.articleId)
      )
      .where(and(searchCondition, isAdmin ? undefined : publishedCondition))
      .orderBy(desc(tblArticle.updatedAt))
      .limit(perPage)
      .offset(offset);

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

export const getArticleBySlug = cache(
  async ({
    slug,
    lang,
  }: {
    slug: string;
    lang: ELanguage;
  }): Promise<TArticleLocalized | null> => {
    try {
      const res = await db
        .select({
          id: tblArticle.id,
          title: tblArticle[lang === UA ? 'titleUa' : 'titleEn'],
          description:
            tblArticle[lang === UA ? 'descriptionUa' : 'descriptionEn'],
          text: tblArticle[lang === UA ? 'textUa' : 'textEn'],
          keywords: tblArticle[lang === UA ? 'keywordsUa' : 'keywordsEn'],
          slug: tblArticle.slug,
          createdAt: tblArticle.createdAt,
          updatedAt: tblArticle.updatedAt,
          imageSrc: tblArticle.imageSrc,
          published: tblArticle.published,
          viewCount: articleViewCounts.viewCount,
        })
        .from(tblArticle)
        .leftJoin(
          articleViewCounts,
          eq(tblArticle.id, articleViewCounts.articleId)
        )
        .where(eq(tblArticle.slug, slug))
        .limit(1);

      return res[0];
    } catch (error) {
      console.error(
        'Failed to get 1 article from database',
        'Error Name: ',
        (error as Error).name
      );
      return null;
    }
  }
);

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
    const [res] = await db
      .select()
      .from(tblArticle)
      .where(eq(tblArticle.id, id))
      .limit(1);

    return res;
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
