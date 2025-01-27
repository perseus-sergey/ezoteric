CREATE TABLE IF NOT EXISTS "ezo_article_tags" (
	"article_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	CONSTRAINT "ezo_article_tags_article_id_tag_id_pk" PRIMARY KEY("article_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ezo_tags" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ezo_tags_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name_ua" varchar(255) NOT NULL,
	"name_en" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	CONSTRAINT "ezo_tags_name_ua_unique" UNIQUE("name_ua"),
	CONSTRAINT "ezo_tags_name_en_unique" UNIQUE("name_en"),
	CONSTRAINT "ezo_tags_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ezo_article_tags" ADD CONSTRAINT "ezo_article_tags_article_id_ezo_article_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."ezo_article"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ezo_article_tags" ADD CONSTRAINT "ezo_article_tags_tag_id_ezo_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."ezo_tags"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
