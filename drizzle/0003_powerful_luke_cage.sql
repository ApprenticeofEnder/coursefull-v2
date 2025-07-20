ALTER TABLE "coursefull_semester" ALTER COLUMN "endsAt" SET DEFAULT CURRENT_TIMESTAMP + INTERVAL '1 DAY';--> statement-breakpoint
ALTER TABLE "coursefull_course" ADD COLUMN "createdBy" uuid;--> statement-breakpoint
ALTER TABLE "coursefull_course" ADD COLUMN "public" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "coursefull_deliverable" ADD COLUMN "createdBy" uuid;--> statement-breakpoint
ALTER TABLE "coursefull_deliverable" ADD COLUMN "public" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "coursefull_semester" ADD COLUMN "createdBy" uuid;--> statement-breakpoint
ALTER TABLE "coursefull_semester" ADD COLUMN "public" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "coursefull_course" ADD CONSTRAINT "coursefull_course_createdBy_coursefull_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."coursefull_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull_course" ADD CONSTRAINT "course_created_by_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."coursefull_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull_deliverable" ADD CONSTRAINT "coursefull_deliverable_createdBy_coursefull_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."coursefull_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull_deliverable" ADD CONSTRAINT "deliverable_created_by_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."coursefull_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull_semester" ADD CONSTRAINT "coursefull_semester_createdBy_coursefull_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."coursefull_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull_semester" ADD CONSTRAINT "semester_created_by_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."coursefull_user"("id") ON DELETE no action ON UPDATE no action;