CREATE TABLE IF NOT EXISTS "ezo_article_view_counts" (
	"article_id" integer PRIMARY KEY NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ezo_article_view_counts" ADD CONSTRAINT "ezo_article_view_counts_article_id_ezo_article_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."ezo_article"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
