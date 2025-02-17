CREATE TABLE IF NOT EXISTS "ezo_test_answers" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ezo_test_answers_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"question_id" integer NOT NULL,
	"text_ua" varchar(255) NOT NULL,
	"text_en" varchar(255) NOT NULL,
	"rank" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ezo_test_categories" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ezo_test_categories_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name_ua" varchar(255) NOT NULL,
	"name_en" varchar(255) NOT NULL,
	"description_ua" varchar(640) NOT NULL,
	"description_en" varchar(640) NOT NULL,
	"slug" varchar(255) NOT NULL,
	CONSTRAINT "ezo_test_categories_name_ua_unique" UNIQUE("name_ua"),
	CONSTRAINT "ezo_test_categories_name_en_unique" UNIQUE("name_en"),
	CONSTRAINT "ezo_test_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ezo_test_conclusions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ezo_test_conclusions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"test_id" integer NOT NULL,
	"min_rank" integer NOT NULL,
	"max_rank" integer NOT NULL,
	"description_ua" text NOT NULL,
	"description_en" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ezo_test_questions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ezo_test_questions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"test_id" integer NOT NULL,
	"title_ua" varchar(255) NOT NULL,
	"title_en" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ezo_test_views" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ezo_test_views_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"view_timestamp" timestamp DEFAULT now() NOT NULL,
	"test_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ezo_tests" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ezo_tests_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"slug" varchar(255) NOT NULL,
	"h1_en" varchar(255) NOT NULL,
	"h1_ua" varchar(255) NOT NULL,
	"title_ua" varchar(255) NOT NULL,
	"title_en" varchar(255) NOT NULL,
	"description_ua" text NOT NULL,
	"description_en" text NOT NULL,
	"keywords_ua" varchar(255) NOT NULL,
	"keywords_en" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"image_src" varchar(255),
	"published" boolean DEFAULT true NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"category_id" integer NOT NULL,
	CONSTRAINT "ezo_tests_slug_unique" UNIQUE("slug"),
	CONSTRAINT "ezo_tests_h1_en_unique" UNIQUE("h1_en"),
	CONSTRAINT "ezo_tests_h1_ua_unique" UNIQUE("h1_ua"),
	CONSTRAINT "ezo_tests_title_ua_unique" UNIQUE("title_ua"),
	CONSTRAINT "ezo_tests_title_en_unique" UNIQUE("title_en")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ezo_test_answers" ADD CONSTRAINT "ezo_test_answers_question_id_ezo_test_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."ezo_test_questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ezo_test_conclusions" ADD CONSTRAINT "ezo_test_conclusions_test_id_ezo_tests_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."ezo_tests"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ezo_test_questions" ADD CONSTRAINT "ezo_test_questions_test_id_ezo_tests_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."ezo_tests"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ezo_test_views" ADD CONSTRAINT "ezo_test_views_test_id_ezo_tests_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."ezo_tests"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ezo_tests" ADD CONSTRAINT "ezo_tests_category_id_ezo_test_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."ezo_test_categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "test_id_idx" ON "ezo_test_views" USING btree ("test_id");