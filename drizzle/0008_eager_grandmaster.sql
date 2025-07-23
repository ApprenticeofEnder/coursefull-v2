ALTER TABLE "coursefull_course" RENAME COLUMN "publicId" TO "public_id";--> statement-breakpoint
ALTER TABLE "coursefull_course" RENAME COLUMN "createdBy" TO "created_by";--> statement-breakpoint
ALTER TABLE "coursefull_course" RENAME COLUMN "semesterId" TO "semester_id";--> statement-breakpoint
ALTER TABLE "coursefull_course" RENAME COLUMN "shortCode" TO "short_code";--> statement-breakpoint
ALTER TABLE "coursefull_course" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "coursefull_course" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "coursefull_user_course" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "coursefull_user_course" RENAME COLUMN "courseId" TO "course_id";--> statement-breakpoint
ALTER TABLE "coursefull_user_course" RENAME COLUMN "deliverableGoal" TO "deliverable_goal";--> statement-breakpoint
ALTER TABLE "coursefull_deliverable" RENAME COLUMN "publicId" TO "public_id";--> statement-breakpoint
ALTER TABLE "coursefull_deliverable" RENAME COLUMN "createdBy" TO "created_by";--> statement-breakpoint
ALTER TABLE "coursefull_deliverable" RENAME COLUMN "courseId" TO "course_id";--> statement-breakpoint
ALTER TABLE "coursefull_deliverable" RENAME COLUMN "startsAt" TO "starts_at";--> statement-breakpoint
ALTER TABLE "coursefull_deliverable" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "coursefull_deliverable" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "coursefull_student_deliverable" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "coursefull_student_deliverable" RENAME COLUMN "deliverableId" TO "deliverable_id";--> statement-breakpoint
ALTER TABLE "coursefull_school" RENAME COLUMN "publicId" TO "public_id";--> statement-breakpoint
ALTER TABLE "coursefull_school" RENAME COLUMN "alphaTwoCode" TO "alpha_two_code";--> statement-breakpoint
ALTER TABLE "coursefull_school" RENAME COLUMN "stateOrProvince" TO "state_or_province";--> statement-breakpoint
ALTER TABLE "coursefull_school" RENAME COLUMN "hasAutoload" TO "has_autoload";--> statement-breakpoint
ALTER TABLE "coursefull_school" RENAME COLUMN "webPages" TO "web_pages";--> statement-breakpoint
ALTER TABLE "coursefull_school" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "coursefull_school" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "coursefull_user_in_school" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "coursefull_user_in_school" RENAME COLUMN "schoolId" TO "school_id";--> statement-breakpoint
ALTER TABLE "coursefull_semester" RENAME COLUMN "publicId" TO "public_id";--> statement-breakpoint
ALTER TABLE "coursefull_semester" RENAME COLUMN "createdBy" TO "created_by";--> statement-breakpoint
ALTER TABLE "coursefull_semester" RENAME COLUMN "schoolId" TO "school_id";--> statement-breakpoint
ALTER TABLE "coursefull_semester" RENAME COLUMN "startsAt" TO "starts_at";--> statement-breakpoint
ALTER TABLE "coursefull_semester" RENAME COLUMN "endsAt" TO "ends_at";--> statement-breakpoint
ALTER TABLE "coursefull_semester" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "coursefull_semester" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "coursefull_user_semester" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "coursefull_user_semester" RENAME COLUMN "semesterId" TO "semester_id";--> statement-breakpoint
ALTER TABLE "coursefull_course" DROP CONSTRAINT "coursefull_course_createdBy_coursefull_user_id_fk";
--> statement-breakpoint
ALTER TABLE "coursefull_course" DROP CONSTRAINT "coursefull_course_semesterId_coursefull_semester_id_fk";
--> statement-breakpoint
ALTER TABLE "coursefull_course" DROP CONSTRAINT "course_semester_fk";
--> statement-breakpoint
ALTER TABLE "coursefull_course" DROP CONSTRAINT "course_created_by_fk";
--> statement-breakpoint
ALTER TABLE "coursefull_user_course" DROP CONSTRAINT "coursefull_user_course_userId_coursefull_user_id_fk";
--> statement-breakpoint
ALTER TABLE "coursefull_user_course" DROP CONSTRAINT "coursefull_user_course_courseId_coursefull_course_id_fk";
--> statement-breakpoint
ALTER TABLE "coursefull_user_course" DROP CONSTRAINT "user_course_user_fk";
--> statement-breakpoint
ALTER TABLE "coursefull_user_course" DROP CONSTRAINT "user_course_course_fk";
--> statement-breakpoint
ALTER TABLE "coursefull_deliverable" DROP CONSTRAINT "coursefull_deliverable_createdBy_coursefull_user_id_fk";
--> statement-breakpoint
ALTER TABLE "coursefull_deliverable" DROP CONSTRAINT "coursefull_deliverable_courseId_coursefull_course_id_fk";
--> statement-breakpoint
ALTER TABLE "coursefull_deliverable" DROP CONSTRAINT "deliverable_course_fk";
--> statement-breakpoint
ALTER TABLE "coursefull_deliverable" DROP CONSTRAINT "deliverable_created_by_fk";
--> statement-breakpoint
ALTER TABLE "coursefull_student_deliverable" DROP CONSTRAINT "coursefull_student_deliverable_userId_coursefull_user_id_fk";
--> statement-breakpoint
ALTER TABLE "coursefull_student_deliverable" DROP CONSTRAINT "coursefull_student_deliverable_deliverableId_coursefull_deliverable_id_fk";
--> statement-breakpoint
ALTER TABLE "coursefull_student_deliverable" DROP CONSTRAINT "student_deliverable_user_fk";
--> statement-breakpoint
ALTER TABLE "coursefull_student_deliverable" DROP CONSTRAINT "student_deliverable_deliverable_fk";
--> statement-breakpoint
ALTER TABLE "coursefull_user_in_school" DROP CONSTRAINT "coursefull_user_in_school_userId_coursefull_user_id_fk";
--> statement-breakpoint
ALTER TABLE "coursefull_user_in_school" DROP CONSTRAINT "coursefull_user_in_school_schoolId_coursefull_school_id_fk";
--> statement-breakpoint
ALTER TABLE "coursefull_user_in_school" DROP CONSTRAINT "user_in_school_user_fk";
--> statement-breakpoint
ALTER TABLE "coursefull_user_in_school" DROP CONSTRAINT "user_in_school_school_fk";
--> statement-breakpoint
ALTER TABLE "coursefull_semester" DROP CONSTRAINT "coursefull_semester_createdBy_coursefull_user_id_fk";
--> statement-breakpoint
ALTER TABLE "coursefull_semester" DROP CONSTRAINT "coursefull_semester_schoolId_coursefull_school_id_fk";
--> statement-breakpoint
ALTER TABLE "coursefull_semester" DROP CONSTRAINT "semester_school_fk";
--> statement-breakpoint
ALTER TABLE "coursefull_semester" DROP CONSTRAINT "semester_created_by_fk";
--> statement-breakpoint
ALTER TABLE "coursefull_user_semester" DROP CONSTRAINT "coursefull_user_semester_userId_coursefull_user_id_fk";
--> statement-breakpoint
ALTER TABLE "coursefull_user_semester" DROP CONSTRAINT "coursefull_user_semester_semesterId_coursefull_semester_id_fk";
--> statement-breakpoint
ALTER TABLE "coursefull_user_semester" DROP CONSTRAINT "user_semester_user_fk";
--> statement-breakpoint
ALTER TABLE "coursefull_user_semester" DROP CONSTRAINT "user_semester_semester_fk";
--> statement-breakpoint
ALTER TABLE "coursefull_user_course" DROP CONSTRAINT "coursefull_user_course_userId_courseId_pk";--> statement-breakpoint
ALTER TABLE "coursefull_student_deliverable" DROP CONSTRAINT "coursefull_student_deliverable_userId_deliverableId_pk";--> statement-breakpoint
ALTER TABLE "coursefull_user_in_school" DROP CONSTRAINT "coursefull_user_in_school_userId_schoolId_pk";--> statement-breakpoint
ALTER TABLE "coursefull_user_semester" DROP CONSTRAINT "coursefull_user_semester_userId_semesterId_pk";--> statement-breakpoint
ALTER TABLE "coursefull_user_course" ADD CONSTRAINT "coursefull_user_course_user_id_course_id_pk" PRIMARY KEY("user_id","course_id");--> statement-breakpoint
ALTER TABLE "coursefull_student_deliverable" ADD CONSTRAINT "coursefull_student_deliverable_user_id_deliverable_id_pk" PRIMARY KEY("user_id","deliverable_id");--> statement-breakpoint
ALTER TABLE "coursefull_user_in_school" ADD CONSTRAINT "coursefull_user_in_school_user_id_school_id_pk" PRIMARY KEY("user_id","school_id");--> statement-breakpoint
ALTER TABLE "coursefull_user_semester" ADD CONSTRAINT "coursefull_user_semester_user_id_semester_id_pk" PRIMARY KEY("user_id","semester_id");--> statement-breakpoint
ALTER TABLE "coursefull_course" ADD CONSTRAINT "coursefull_course_created_by_coursefull_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."coursefull_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull_course" ADD CONSTRAINT "coursefull_course_semester_id_coursefull_semester_id_fk" FOREIGN KEY ("semester_id") REFERENCES "public"."coursefull_semester"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull_course" ADD CONSTRAINT "course_semester_fk" FOREIGN KEY ("semester_id") REFERENCES "public"."coursefull_semester"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull_course" ADD CONSTRAINT "course_created_by_fk" FOREIGN KEY ("created_by") REFERENCES "public"."coursefull_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull_user_course" ADD CONSTRAINT "coursefull_user_course_user_id_coursefull_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."coursefull_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull_user_course" ADD CONSTRAINT "coursefull_user_course_course_id_coursefull_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."coursefull_course"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull_user_course" ADD CONSTRAINT "user_course_user_fk" FOREIGN KEY ("user_id") REFERENCES "public"."coursefull_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull_user_course" ADD CONSTRAINT "user_course_course_fk" FOREIGN KEY ("course_id") REFERENCES "public"."coursefull_course"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull_deliverable" ADD CONSTRAINT "coursefull_deliverable_created_by_coursefull_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."coursefull_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull_deliverable" ADD CONSTRAINT "coursefull_deliverable_course_id_coursefull_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."coursefull_course"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull_deliverable" ADD CONSTRAINT "deliverable_course_fk" FOREIGN KEY ("course_id") REFERENCES "public"."coursefull_course"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull_deliverable" ADD CONSTRAINT "deliverable_created_by_fk" FOREIGN KEY ("created_by") REFERENCES "public"."coursefull_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull_student_deliverable" ADD CONSTRAINT "coursefull_student_deliverable_user_id_coursefull_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."coursefull_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull_student_deliverable" ADD CONSTRAINT "coursefull_student_deliverable_deliverable_id_coursefull_deliverable_id_fk" FOREIGN KEY ("deliverable_id") REFERENCES "public"."coursefull_deliverable"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull_student_deliverable" ADD CONSTRAINT "student_deliverable_user_fk" FOREIGN KEY ("user_id") REFERENCES "public"."coursefull_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull_student_deliverable" ADD CONSTRAINT "student_deliverable_deliverable_fk" FOREIGN KEY ("deliverable_id") REFERENCES "public"."coursefull_deliverable"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull_user_in_school" ADD CONSTRAINT "coursefull_user_in_school_user_id_coursefull_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."coursefull_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull_user_in_school" ADD CONSTRAINT "coursefull_user_in_school_school_id_coursefull_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."coursefull_school"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull_user_in_school" ADD CONSTRAINT "user_in_school_user_fk" FOREIGN KEY ("user_id") REFERENCES "public"."coursefull_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull_user_in_school" ADD CONSTRAINT "user_in_school_school_fk" FOREIGN KEY ("school_id") REFERENCES "public"."coursefull_school"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull_semester" ADD CONSTRAINT "coursefull_semester_created_by_coursefull_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."coursefull_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull_semester" ADD CONSTRAINT "coursefull_semester_school_id_coursefull_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."coursefull_school"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull_semester" ADD CONSTRAINT "semester_school_fk" FOREIGN KEY ("school_id") REFERENCES "public"."coursefull_school"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull_semester" ADD CONSTRAINT "semester_created_by_fk" FOREIGN KEY ("created_by") REFERENCES "public"."coursefull_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull_user_semester" ADD CONSTRAINT "coursefull_user_semester_user_id_coursefull_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."coursefull_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull_user_semester" ADD CONSTRAINT "coursefull_user_semester_semester_id_coursefull_semester_id_fk" FOREIGN KEY ("semester_id") REFERENCES "public"."coursefull_semester"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull_user_semester" ADD CONSTRAINT "user_semester_user_fk" FOREIGN KEY ("user_id") REFERENCES "public"."coursefull_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull_user_semester" ADD CONSTRAINT "user_semester_semester_fk" FOREIGN KEY ("semester_id") REFERENCES "public"."coursefull_semester"("id") ON DELETE no action ON UPDATE no action;