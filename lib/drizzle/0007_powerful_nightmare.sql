CREATE INDEX IF NOT EXISTS "articles_search_en_idx" ON "ezo_article" USING gin ((
        setweight(to_tsvector('english', "title_en"), 'A') ||
        setweight(to_tsvector('english', "text_en"), 'B')
      ));--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "articles_search_ua_idx" ON "ezo_article" USING gin ((
        setweight(to_tsvector('russian', "title_ua"), 'A') ||
        setweight(to_tsvector('russian', "text_ua"), 'B')
      ));