CREATE TABLE "coursefull"."academic_email" (
	"user_id" text NOT NULL,
	"role" "coursefull"."user_role" NOT NULL,
	"email" varchar(255) NOT NULL,
	"verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "academic_email_user_id_email_pk" PRIMARY KEY("user_id","email")
);
--> statement-breakpoint
ALTER TABLE "coursefull"."academic_email" ADD CONSTRAINT "academic_email_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "coursefull"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "academic_email_user_id_idx" ON "coursefull"."academic_email" USING btree ("user_id");