import { getDB } from '@/db/root';
import { TBL_ARTICLE_VIEWS_COUNTS, TBL_ARTICLE_VIEWS } from '@/db/schema';
import { sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await getDB().transaction(async (tx) => {
      await tx.execute(
        sql`UPDATE ${sql.raw(TBL_ARTICLE_VIEWS_COUNTS)} AS VC
            SET view_count = (
              SELECT COUNT(*) 
              FROM ${sql.raw(TBL_ARTICLE_VIEWS)}
              WHERE article_id = VC.article_id
            )`
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
