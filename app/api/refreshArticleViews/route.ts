import { getDB } from '@/db/root';
import {
  tblArticle,
  tblArticleViews,
  tblTests,
  tblTestViews,
} from '@/db/schema';
import { sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

const db = getDB();

export async function GET() {
  try {
    await db.transaction(async (tx) => {
      await tx
        .update(tblArticle)
        .set({
          viewCount: sql`(
            select count(*) 
            from ${tblArticleViews} 
            where ${tblArticleViews.articleId} = ${tblArticle.id}
          )`,
        })
        .where(sql`${tblArticle.id} = ${tblArticle.id}`);
    });

    await db.transaction(async (tx) => {
      await tx
        .update(tblTests)
        .set({
          viewCount: sql`(
            select count(*) 
            from ${tblTestViews} 
            where ${tblTestViews.testId} = ${tblTests.id}
          )`,
        })
        .where(sql`${tblArticle.id} = ${tblArticle.id}`);
    });

    return new Response('SUCCESS!', {
      status: 200,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // console.log('🚀 ~ GET ~ error:', error);
    return new Response('ERROR!', {
      status: 500,
    });
  }
}
