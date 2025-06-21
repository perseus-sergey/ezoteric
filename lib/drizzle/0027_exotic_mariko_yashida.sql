DROP INDEX IF EXISTS "articles_search_en_idx";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "articles_search_en_idx" ON "ezo_article" USING gin ((
        setweight(to_tsvector('english', "title_en"), 'A') ||
        setweight(to_tsvector('english', "description_en"), 'B') ||
        setweight(to_tsvector('english', substring("text_en", 1, 1000)), 'C')
      ));