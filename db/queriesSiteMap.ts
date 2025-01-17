'use server';

import 'server-only';

import { eq } from 'drizzle-orm';

import { tblArticle } from './schema';
import { getDB } from './root';

const db = getDB();

export const getPostsSiteMap = async () => {
  try {
    const articles = await db
      .select({
        slug: tblArticle.slug,
        updatedAt: tblArticle.updatedAt,
      })
      .from(tblArticle)
      .where(eq(tblArticle.published, true));

    return articles;
  } catch (error) {
    console.log('getPostsSiteMap ~ error:', error);
    return [];
  }
};
