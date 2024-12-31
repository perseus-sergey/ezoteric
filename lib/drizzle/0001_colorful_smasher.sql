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
	"view" integer,
	CONSTRAINT "ezo_article_slug_unique" UNIQUE("slug"),
	CONSTRAINT "ezo_article_title_ua_unique" UNIQUE("title_ua"),
	CONSTRAINT "ezo_article_title_en_unique" UNIQUE("title_en")
);
--> statement-breakpoint
ALTER TABLE "Chat" RENAME TO "ezo_chat";--> statement-breakpoint
ALTER TABLE "Reservation" RENAME TO "ezo_reservation";--> statement-breakpoint
ALTER TABLE "User" RENAME TO "ezo_user";--> statement-breakpoint
ALTER TABLE "ezo_chat" DROP CONSTRAINT "Chat_userId_User_id_fk";
--> statement-breakpoint
ALTER TABLE "ezo_reservation" DROP CONSTRAINT "Reservation_userId_User_id_fk";
--> statement-breakpoint
ALTER TABLE "ezo_user" ADD COLUMN "name" varchar(128);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ezo_chat" ADD CONSTRAINT "ezo_chat_userId_ezo_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."ezo_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ezo_reservation" ADD CONSTRAINT "ezo_reservation_userId_ezo_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."ezo_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "ezo_user" ADD CONSTRAINT "ezo_user_email_unique" UNIQUE("email");