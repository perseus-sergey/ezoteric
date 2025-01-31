import { getDB } from '@/db/root';
import { TBL_ARTICLE_VIEWS_COUNTS, TBL_ARTICLE_VIEWS } from '@/db/schema';
import { sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await getDB().transaction(async (tx) => {
      await tx.execute(
        sql`INSERT INTO ${sql.raw(TBL_ARTICLE_VIEWS_COUNTS)} (article_id, view_count)
              SELECT article_id, COUNT(*) 
              FROM ${sql.raw(TBL_ARTICLE_VIEWS)}
              GROUP BY article_id
              ON CONFLICT (article_id) 
              DO UPDATE SET view_count = EXCLUDED.view_count
            `
      );
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
