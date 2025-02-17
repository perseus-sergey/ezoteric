ALTER TABLE "ezo_test_answers" RENAME COLUMN "rank" TO "rating";--> statement-breakpoint
ALTER TABLE "ezo_tests" ADD COLUMN "spotify_id" varchar(255);--> statement-breakpoint
ALTER TABLE "ezo_tests" ADD COLUMN "text_ua" text;--> statement-breakpoint
ALTER TABLE "ezo_tests" ADD COLUMN "text_en" text;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tests_search_en_idx" ON "ezo_tests" USING gin ((
        setweight(to_tsvector('english', "title_en"), 'A') ||
        setweight(to_tsvector('english', "description_en"), 'B') ||
        setweight(to_tsvector('english', "text_en"), 'C')
      ));--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tests_search_ua_idx" ON "ezo_tests" USING gin ((
        setweight(to_tsvector('simple', "title_ua"), 'A') ||
        setweight(to_tsvector('simple', "description_ua"), 'B') ||
         setweight(to_tsvector('simple', "text_ua"), 'C')
      ));