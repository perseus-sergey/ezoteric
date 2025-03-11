CREATE TABLE IF NOT EXISTS "ezo_schedule" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meetDate" timestamp NOT NULL,
	"reservedAt" timestamp,
	"question" varchar(255),
	"hasCompletedPayment" boolean DEFAULT false,
	"email" varchar(64)
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ezo_schedule" ADD CONSTRAINT "ezo_schedule_email_ezo_user_email_fk" FOREIGN KEY ("email") REFERENCES "public"."ezo_user"("email") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
