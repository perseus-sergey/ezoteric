DROP INDEX IF EXISTS "articles_search_en_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "articles_search_ua_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "tests_search_en_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "tests_search_ua_idx";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "articles_search_en_idx" ON "ezo_article" USING gin ((
        setweight(to_tsvector('english', "title_en"), 'A') ||
        setweight(to_tsvector('english', "description_en"), 'B') || // Додаємо опис
        setweight(to_tsvector('english', substring("text_en", 1, 1000)), 'C') // Індексуємо лише перший 1КБ тексту
      ));--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "articles_search_ua_idx" ON "ezo_article" USING gin ((
        setweight(to_tsvector('simple', "title_ua"), 'A') ||
        setweight(to_tsvector('simple', "description_ua"), 'B') ||
        setweight(to_tsvector('simple', substring("text_ua", 1, 1000)), 'C')
      ));--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tests_search_en_idx" ON "ezo_tests" USING gin ((
        setweight(to_tsvector('english', "title_en"), 'A') ||
        setweight(to_tsvector('english', "description_en"), 'B') ||
        setweight(to_tsvector('english', substring("text_en", 1, 1000)), 'C')
      ));--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tests_search_ua_idx" ON "ezo_tests" USING gin ((
        setweight(to_tsvector('simple', "title_ua"), 'A') ||
        setweight(to_tsvector('simple', "description_ua"), 'B') ||
        setweight(to_tsvector('simple', substring("text_ua", 1, 1000)), 'C')
      ));