'use server';
import 'server-only';

import { desc, eq, ilike, sql } from 'drizzle-orm';

import { TArticleLocalized, tblArticle } from './schema';
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
  // Умова пошуку
  const searchCondition = searchQuery
    ? ilike(tblArticle.titleEn, `%${searchQuery}%`)
    : undefined;

  try {
    // Обчислення загальної кількості статей
    const totalCountQuery = await db
      .select({
        total_count: sql<number>`COUNT(${tblArticle.id})`.mapWith(Number),
      })
      .from(tblArticle)
      .where(searchCondition);

    const totalCount = totalCountQuery[0]?.total_count || 0;

    // Вибірка статей з пагінацією
    const articles = await db
      .select({
        id: tblArticle.id,
        title: tblArticle[lang === UA ? 'titleUa' : 'titleEn'],
        description:
          tblArticle[lang === UA ? 'descriptionUa' : 'descriptionEn'],
        text: tblArticle[lang === UA ? 'textUa' : 'textEn'],
        keywords: tblArticle[lang === UA ? 'keywordsUa' : 'keywordsEn'],
        slug: tblArticle.slug,
        updatedAt: tblArticle.updatedAt,
        imageName: tblArticle.imageName,
        view: tblArticle.view,
      })
      .from(tblArticle)
      .where(searchCondition)
      .orderBy(desc(tblArticle.updatedAt))
      .limit(perPage)
      .offset(offset);

    return { totalCount, articles };
  } catch (error) {
    console.error(
      'Failed to get articles from database.',
      'Error: ',
      (error as Error).message
    );
    return { totalCount: null, articles: null };
  }
};

export const getArticleBySlug = cache(
  async ({ slug, lang }: { slug: string; lang: ELanguage }) => {
    try {
      const res = await db
        .select({
          id: tblArticle.id,
          title: tblArticle[lang === UA ? 'titleUa' : 'titleEn'],
          description:
            tblArticle[lang === UA ? 'descriptionUa' : 'descriptionEn'],
          text: tblArticle[lang === UA ? 'textUa' : 'textEn'],
          keywords: tblArticle[lang === UA ? 'keywordsUa' : 'keywordsEn'],
          updatedAt: tblArticle.updatedAt,
          imageName: tblArticle.imageName,
          view: tblArticle.view,
        })
        .from(tblArticle)
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
      // throw error;
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

export const updateArticleView = async (id: number) => {
  return await db
    .update(tblArticle)
    .set({ view: sql`${tblArticle.view || 0} + 1` })
    .where(eq(tblArticle.id, id))
    .returning();
};
