ALTER TABLE "ezo_tests" DROP CONSTRAINT "ezo_tests_h1_en_unique";--> statement-breakpoint
ALTER TABLE "ezo_tests" DROP CONSTRAINT "ezo_tests_h1_ua_unique";--> statement-breakpoint
ALTER TABLE "ezo_article" ADD COLUMN "h1_en" varchar(255);--> statement-breakpoint
ALTER TABLE "ezo_article" ADD COLUMN "h1_ua" varchar(255);