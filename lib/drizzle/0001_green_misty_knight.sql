CREATE TABLE IF NOT EXISTS "ezo_article_views" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ezo_article_views_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"article_id" integer NOT NULL,
	"view_timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ezo_article_views" ADD CONSTRAINT "ezo_article_views_article_id_ezo_article_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."ezo_article"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "article_id_idx" ON "ezo_article_views" USING btree ("article_id");--> statement-breakpoint
ALTER TABLE "ezo_article" DROP COLUMN IF EXISTS "view";