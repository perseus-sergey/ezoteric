DO $$ BEGIN
 CREATE TYPE "public"."user_role" AS ENUM('user', 'admin', 'editor');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "ezo_article" ALTER COLUMN "view" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "ezo_user" ADD COLUMN "role" "user_role" DEFAULT 'user' NOT NULL;