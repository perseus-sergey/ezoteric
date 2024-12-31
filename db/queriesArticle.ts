'use server';
import 'server-only';

import { desc, eq, ilike, sql } from 'drizzle-orm';

import { TArticleLocalized, tblArticle } from './schema';
import { getDB, langSuffix } from './root';
import { ELanguage } from '@/models/language.model';
import { TArticleFormValues } from '@/lib/schemas/articleFormSchema';

const db = getDB();
// const getAdminChunkOfNews = async (
//   quantity: number,
//   start = 0,
//   searchQuery = ''
// ) => {
//   const searchPattern = searchQuery
//     ? sql.raw(`'%${searchQuery}%'`)
//     : sql.raw(`'%%'`);

//   return await db.execute(sql`
//     SELECT
//       U.id,
//       U.title,
//       U.date_upd,
//       T.total_count
//     FROM ${tblArticle} U
//     CROSS JOIN
//       (SELECT COUNT(id) AS total_count
//        FROM ${tblArticle}
//        WHERE title LIKE ${searchPattern}) T
//     WHERE U.title LIKE ${searchPattern}
//     ORDER BY
//       U.date DESC, U.id
//     LIMIT ${start}, ${quantity}
//   `);
// };
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
        title: sql<string>`${tblArticle}."title${langSuffix[lang]}"`,
        description: sql<string>`${tblArticle}."description${langSuffix[lang]}"`,
        text: sql<string>`${tblArticle}."text${langSuffix[lang]}"`,
        keywords: sql<string>`${tblArticle}."keywords${langSuffix[lang]}"`,
        slug: tblArticle.slug,
        updatedAt: tblArticle.updatedAt,
        imageName: tblArticle.imageName,
        view: tblArticle.view,
      })
      .from(tblArticle)
      .where(searchCondition)
      .orderBy(desc(tblArticle.updatedAt))
      .limit(perPage)
      .offset((offset - 1) * perPage);

    return { totalCount, articles };
  } catch (error) {
    console.error(
      'Failed to get articles from database.',
      'Error Name: ',
      (error as Error).name
    );
    return { totalCount: null, articles: null };
  }
};

// export const getArticles = async ({ lang }: { lang: ELanguage }) => {
//   try {
//     return await db
//       .select({
//         id: tblArticle.id,
//         title: sql<string>`${tblArticle}."title${langSuffix[lang]}"`,
//         description: sql<string>`${tblArticle}."description${langSuffix[lang]}"`,
//         text: sql<string>`${tblArticle}."text${langSuffix[lang]}"`,
//         keywords: sql<string>`${tblArticle}."keywords${langSuffix[lang]}"`,
//         slug: tblArticle.slug,
//         updatedAt: tblArticle.updatedAt,
//         imageName: tblArticle.imageName,
//         view: tblArticle.view,
//       })
//       .from(tblArticle)
//       .orderBy(desc(tblArticle.updatedAt))
//   } catch (error) {
//     console.error(
//       'Failed to get articles from database.',
//       'Error Name: ',
//       (error as Error).name
//     );
//     return null;
//     // throw error;
//   }
// };

// export const getArticles = async ({ lang }: { lang: ELanguage }) => {
//   try {
//     return await db
//       .select({
//         id: tblArticle.id,
//         title: sql<string>`${tblArticle}."title${langSuffix[lang]}"`,
//         description: sql<string>`${tblArticle}."description${langSuffix[lang]}"`,
//         text: sql<string>`${tblArticle}."text${langSuffix[lang]}"`,
//         keywords: sql<string>`${tblArticle}."keywords${langSuffix[lang]}"`,
//         slug: tblArticle.slug,
//         updatedAt: tblArticle.updatedAt,
//         imageName: tblArticle.imageName,
//         view: tblArticle.view,
//       })
//       .from(tblArticle)
//       .orderBy(desc(tblArticle.updatedAt))
//       .limit();
//   } catch (error) {
//     console.error(
//       'Failed to get articles from database.',
//       'Error Name: ',
//       (error as Error).name
//     );
//     return null;
//     // throw error;
//   }
// };
// const getArticles = async (lang: ELanguage) => {
//   return await db.query.tblArticle.findMany({
//     columns: {
//       id: true,
//       slug: true,
//       [`title${langSuffix[lang]}`]: true,
//       [`description${langSuffix[lang]}`]: true,
//       [`text${langSuffix[lang]}`]: true,
//     },
//   });
// };

export async function getArticleBySlug({
  slug,
  lang,
}: {
  slug: string;
  lang: ELanguage;
}) {
  try {
    const res = await db
      .select({
        id: tblArticle.id,
        title: sql<string>`${tblArticle}."title${langSuffix[lang]}"`,
        description: sql<string>`${tblArticle}."description${langSuffix[lang]}"`,
        text: sql<string>`${tblArticle}."text${langSuffix[lang]}"`,
        keywords: sql<string>`${tblArticle}."keywords${langSuffix[lang]}"`,
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
export async function getArticleByIdForUpdate(id: number) {
  return {
    id,
    createdAt: new Date(),
    updatedAt: new Date(),
    slug: 'example-article',
    titleUa: 'Приклад статті',
    titleEn: 'Example Article',
    descriptionUa: 'Це опис статті українською.',
    descriptionEn: 'This is the description in English.',
    keywordsUa: 'ключові, слова',
    keywordsEn: 'keywords, words',
    textUa: 'Текст статті українською.',
    textEn: 'Article text in English.',
    imageName: 'example.jpg',
    view: 0,
  };
}
// }
// export async function getArticleByIdForUpdate(id: number) {
//   try {
//     const [res] = await db
//       .select()
//       .from(tblArticle)
//       .where(eq(tblArticle.id, id))
//       .limit(1);

//     return res;
//   } catch (error) {
//     return error as Error;
//   }
// }

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
    .set({ view: sql`${tblArticle.view} + 1` })
    .where(eq(tblArticle.id, id))
    .returning();
};
