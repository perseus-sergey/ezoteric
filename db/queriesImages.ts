'use server';

import 'server-only';

import { desc, eq } from 'drizzle-orm';

import { tblImages } from './schema';
import { getDB } from './root';
import { BLOB_UPLOAD_PAGE_SIZE } from '@/models/image.model';

const db = getDB();

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
