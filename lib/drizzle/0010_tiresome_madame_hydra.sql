DROP INDEX IF EXISTS "articles_search_ua_idx";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "articles_search_ua_idx" ON "ezo_article" USING gin ((
        setweight(to_tsvector('simple', "title_ua"), 'A') ||
        setweight(to_tsvector('simple', "text_ua"), 'B')
      ));