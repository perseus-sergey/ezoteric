import { getDB } from '@/db/root';
import { articleViewCounts } from '@/db/schema';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await getDB().refreshMaterializedView(articleViewCounts);

    return new Response('SUCCESS!', {
      status: 200,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return new Response('ERROR!', {
      status: 500,
    });
  }
}
