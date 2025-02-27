'use server';

import 'server-only';

import { and, desc, eq, or, sql } from 'drizzle-orm';

import { tblArticle, tblImages, tblTests } from './schema';
import { getDB } from './root';
import { BLOB_UPLOAD_PAGE_SIZE } from '@/models/image.model';
import { ESegment } from '@/models/url.model';
import { DEFAULT_LANG } from '@/models/language.model';

const db = getDB();

export const getArticleByImage = async (imageName: string) => {
  const articleFilters = [];
  const testFilters = [];

  // filters.push(eq(tblArticle.published, true));

  articleFilters.push(
    or(
      sql`${tblArticle.imageSrc} LIKE ${`%${imageName}%`}`,
      sql`${tblArticle.textEn} LIKE ${`%${imageName}%`}`
    )
  );

  testFilters.push(
    or(
      sql`${tblTests.imageSrc} LIKE ${`%${imageName}%`}`,
      sql`${tblTests.textEn} LIKE ${`%${imageName}%`}`
    )
  );

  try {
    // Спочатку шукаємо в тестах
    const testRes = await db
      .select({
        title: tblTests.titleEn,
        slug: tblTests.slug,
      })
      .from(tblTests)
      .where(and(...testFilters))
      .limit(1);

    if (testRes[0]) {
      return {
        pathName: `/${DEFAULT_LANG}/${ESegment.TESTS}/${testRes[0].slug}`,
        title: testRes[0].title,
      };
    }

    // Якщо в тестах не знайшли, шукаємо в статтях
    const articleRes = await db
      .select({
        title: tblArticle.titleEn,
        slug: tblArticle.slug,
      })
      .from(tblArticle)
      .where(and(...articleFilters))
      .limit(1);

    if (articleRes[0])
      return {
        pathName: `/${DEFAULT_LANG}/${ESegment.BLOG}/${articleRes[0].slug}`,
        title: articleRes[0].title,
      };

    return null; // Не знайдено статті або тест з даним зображенням
  } catch (error) {
    throw new Error(
      `Get Article/Test By Image Source failed: ${(error as Error).message}`
    );
  }
};

export const insertImageInfoToDB = async (filename: string) => {
  await db.insert(tblImages).values({
    filename: filename,
  });
};

export const deleteImageInfoFromDB = async (fileNameToDelete: string) =>
  await db.delete(tblImages).where(eq(tblImages.filename, fileNameToDelete));

export const getImageInfoFromDB = async (
  page = 1,
  pageSize = BLOB_UPLOAD_PAGE_SIZE
) => {
  // Отримуємо на один запис більше, щоб визначити hasMore
  const items = await db
    .select({ filename: tblImages.filename })
    .from(tblImages)
    .orderBy(desc(tblImages.createdAt))
    .limit(pageSize + 1)
    .offset((page - 1) * pageSize);

  const hasMore = items.length > pageSize;
  // Видаляємо додатковий елемент, якщо він є
  const images = items.slice(0, pageSize);

  return {
    images,
    hasMore,
  };
};
