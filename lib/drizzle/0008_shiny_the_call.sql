DROP INDEX IF EXISTS "articles_search_ua_idx";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "articles_search_ua_idx" ON "ezo_article" USING gin ((
        setweight(to_tsvector('russian', "title_ua"), 'A') ||
        setweight(to_tsvector('russian', "text_ua"), 'B')
      ));