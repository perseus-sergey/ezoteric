import { config } from 'dotenv';
import path from 'path';

// Завантажуємо змінні середовища з файлу .env.local в корені проекту
config({ path: path.resolve(process.cwd(), '.env.local') });

import { db } from '../db/root';
import { sql } from 'drizzle-orm';

if (!process.env.POSTGRES_URL) {
  throw new Error(
    'Could not find POSTGRES_URL in environment variables. Ensure .env.local exists and is in the project root.'
  );
}

async function main() {
  console.log(`[${new Date().toISOString()}] Starting counts update...`);

  try {
    await db.transaction(async (tx) => {
      // Оновлюємо статті
      // Використовуємо .execute() для запитів, що не повертають результати, це може бути ефективніше
      await tx.execute(sql`
        UPDATE ezo_article
        SET "viewCount" = (
          SELECT count(*) 
          FROM ezo_article_views
          WHERE ezo_article_views.article_id = ezo_article.id
        )
      `);

      // Оновлюємо тести
      await tx.execute(sql`
        UPDATE ezo_tests
        SET 
          "viewCount" = (
            SELECT count(*) 
            FROM ezo_test_views
            WHERE ezo_test_views.test_id = ezo_tests.id
          ),
          "completedCount" = (
            SELECT count(*) 
            FROM ezo_test_completed
            WHERE ezo_test_completed.test_id = ezo_tests.id
          )
      `);
    });

    console.log(
      `[${new Date().toISOString()}] Successfully updated all counts.`
    );
    // Успішне завершення
    process.exit(0);
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Error updating counts:`,
      error
    );
    // Завершення з помилкою
    process.exit(1);
  }
}

main();
