import { db } from '@/db/root';
import {
  tblArticle,
  tblArticleViews,
  tblTestCompleted,
  tblTests,
  tblTestViews,
} from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await db.transaction(async (tx) => {
      // Update articles
      await tx
        .update(tblArticle)
        .set({
          viewCount: sql`(
            select count(*) 
            from ${tblArticleViews} 
            where ${tblArticleViews.articleId} = ${tblArticle.id}
          )`,
        })
        .where(eq(tblArticle.id, tblArticle.id));

      // Update tests
      // eslint-disable-next-line drizzle/enforce-update-with-where
      await tx.update(tblTests).set({
        viewCount: sql`(
            select count(*) 
            from ${tblTestViews} 
            where ${tblTestViews.testId} = ${tblTests.id}
          )`,
        completedCount: sql`(
            select count(*) 
            from ${tblTestCompleted} 
            where ${tblTestCompleted.testId} = ${tblTests.id}
          )`,
      });
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
