CREATE TABLE IF NOT EXISTS "ezo_test_completed" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ezo_test_completed_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"view_timestamp" timestamp DEFAULT now() NOT NULL,
	"test_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ezo_tests" ADD COLUMN "completed_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ezo_test_completed" ADD CONSTRAINT "ezo_test_completed_test_id_ezo_tests_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."ezo_tests"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "test_id_completed_idx" ON "ezo_test_completed" USING btree ("test_id");