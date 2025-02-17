DROP TABLE "ezo_article_view_counts";--> statement-breakpoint
ALTER TABLE "ezo_tests" ALTER COLUMN "text_ua" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "ezo_tests" ALTER COLUMN "text_en" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "ezo_article" ADD COLUMN "view_count" integer DEFAULT 0 NOT NULL;