'use server';

import 'server-only';

import { and, desc, eq, ilike, sql } from 'drizzle-orm';

import {
  articleViewCounts,
  TArticleLocalized,
  tblArticle,
  tblArticleViews,
} from './schema';
import { getDB } from './root';
import { ELanguage } from '@/models/language.model';
import { TArticleFormValues } from '@/lib/schemas/articleFormSchema';
import { cache } from 'react';

const { UA } = ELanguage;

const db = getDB();

export const getArticlesChunk = async ({
  offset,
  perPage,
  searchQuery = '',
  lang,
}: {
  offset: number;
  perPage: number;
  searchQuery?: string;
  lang: ELanguage;
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
        imageName: tblArticle.imageName,
        viewCount: articleViewCounts.viewCount,
      })
      .from(tblArticle)
      .leftJoin(
        articleViewCounts,
        eq(tblArticle.id, articleViewCounts.articleId)
      )
      .where(and(searchCondition, publishedCondition))
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
          imageName: tblArticle.imageName,
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
export const updateArticleView = async (articleId: number) => {
  if (process.env.NODE_ENV !== 'production') return;

  try {
    await db.insert(tblArticleViews).values({ articleId });
  } catch (error) {
    console.error('Помилка при додаванні перегляду статті:', error);
  }
};
