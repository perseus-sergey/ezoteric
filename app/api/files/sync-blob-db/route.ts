import { getDB } from '@/db/root';
import { tblImages } from '@/db/schema';
import { list } from '@vercel/blob';
import { eq } from 'drizzle-orm';
const db = getDB();

export async function GET() {
  const { blobs } = await list();

  for (const blob of blobs) {
    try {
      const fName = blob.pathname.split('/').pop() || blob.pathname;

      const existingRecord = await db
        .select()
        .from(tblImages)
        .where(eq(tblImages.filename, fName))
        .limit(1);

      if (existingRecord.length === 0) {
        await db.insert(tblImages).values({
          filename: fName,
          createdAt: new Date(blob.uploadedAt), // Час завантаження з Blob
        });

        console.log(`Added to DB: ${blob.pathname}`);
      }
    } catch (error) {
      console.error(`Error processing blob ${blob.url}:`, error);
    }
  }

  console.log('Blob sync completed');
}
