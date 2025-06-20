import { db } from '@/db/root'; // Змінено з '@/db/root'
import {
  tblArticle,
  tblArticleViews,
  tblTestCompleted,
  tblTests,
  tblTestViews,
} from '@/db/schema'; // Змінено з '@/db/schema'
import { sql } from 'drizzle-orm';
// Додаємо dotenv для завантаження змінних з .env.local
import { config } from 'dotenv';
import path from 'path';

// Завантажуємо змінні середовища з файлу .env.local в корені проекту
config({ path: path.resolve(process.cwd(), '.env.local') });

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
        UPDATE ${tblArticle}
        SET "viewCount" = (
          SELECT count(*) 
          FROM ${tblArticleViews} 
          WHERE ${tblArticleViews.articleId} = ${tblArticle.id}
        )
      `);

      // Оновлюємо тести
      await tx.execute(sql`
        UPDATE ${tblTests}
        SET 
          "viewCount" = (
            SELECT count(*) 
            FROM ${tblTestViews} 
            WHERE ${tblTestViews.testId} = ${tblTests.id}
          ),
          "completedCount" = (
            SELECT count(*) 
            FROM ${tblTestCompleted} 
            WHERE ${tblTestCompleted.testId} = ${tblTests.id}
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
