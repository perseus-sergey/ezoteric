DO $$ BEGIN
 CREATE TYPE "public"."user_role" AS ENUM('user', 'admin', 'editor');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ezo_chat" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp NOT NULL,
	"messages" json NOT NULL,
	"email" varchar(64) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ezo_reservation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp NOT NULL,
	"details" json NOT NULL,
	"hasCompletedPayment" boolean DEFAULT false NOT NULL,
	"email" varchar(64) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ezo_article" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ezo_article_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"createdAt" timestamp NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title_ua" varchar(255) NOT NULL,
	"title_en" varchar(255) NOT NULL,
	"description_ua" varchar(640) NOT NULL,
	"description_en" varchar(640) NOT NULL,
	"keywords_ua" varchar(255) NOT NULL,
	"keywords_en" varchar(255) NOT NULL,
	"text_ua" text NOT NULL,
	"text_en" text NOT NULL,
	"image_name" varchar(255),
	"view" integer DEFAULT 0,
	"published" boolean DEFAULT true NOT NULL,
	CONSTRAINT "ezo_article_slug_unique" UNIQUE("slug"),
	CONSTRAINT "ezo_article_title_ua_unique" UNIQUE("title_ua"),
	CONSTRAINT "ezo_article_title_en_unique" UNIQUE("title_en")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ezo_user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(64) NOT NULL,
	"name" varchar(128),
	"password" varchar(64),
	"role" "user_role" DEFAULT 'user' NOT NULL,
	CONSTRAINT "ezo_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ezo_chat" ADD CONSTRAINT "ezo_chat_email_ezo_user_email_fk" FOREIGN KEY ("email") REFERENCES "public"."ezo_user"("email") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ezo_reservation" ADD CONSTRAINT "ezo_reservation_email_ezo_user_email_fk" FOREIGN KEY ("email") REFERENCES "public"."ezo_user"("email") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
