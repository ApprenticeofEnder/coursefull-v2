CREATE TABLE "coursefull"."course_invite" (
	"id" text PRIMARY KEY NOT NULL,
	"course_id" text NOT NULL,
	"valid_until" timestamp NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "coursefull"."course_invite" ADD CONSTRAINT "course_invite_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "coursefull"."course"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."course_invite" ADD CONSTRAINT "course_invite_course_fk" FOREIGN KEY ("course_id") REFERENCES "coursefull"."course"("id") ON DELETE no action ON UPDATE no action;