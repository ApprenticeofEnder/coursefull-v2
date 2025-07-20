CREATE TABLE "coursefull_user_course" (
	"userId" uuid NOT NULL,
	"courseId" integer NOT NULL,
	"role" varchar(32),
	"goal" real,
	"deliverableGoal" real,
	"grade" real,
	CONSTRAINT "coursefull_user_course_userId_courseId_pk" PRIMARY KEY("userId","courseId")
);
--> statement-breakpoint
CREATE TABLE "coursefull_student_deliverable" (
	"userId" uuid NOT NULL,
	"deliverableId" integer NOT NULL,
	"goal" real,
	"mark" real,
	"complete" boolean,
	"notes" text,
	CONSTRAINT "coursefull_student_deliverable_userId_deliverableId_pk" PRIMARY KEY("userId","deliverableId")
);
--> statement-breakpoint
CREATE TABLE "coursefull_user_in_school" (
	"userId" uuid NOT NULL,
	"schoolId" integer NOT NULL,
	CONSTRAINT "coursefull_user_in_school_userId_schoolId_pk" PRIMARY KEY("userId","schoolId")
);
--> statement-breakpoint
CREATE TABLE "coursefull_user_semester" (
	"userId" uuid NOT NULL,
	"semesterId" integer NOT NULL,
	"role" varchar(32),
	"goal" real,
	"average" real,
	CONSTRAINT "coursefull_user_semester_userId_semesterId_pk" PRIMARY KEY("userId","semesterId")
);
--> statement-breakpoint
ALTER TABLE "coursefull_deliverable" ALTER COLUMN "deadline" SET DEFAULT CURRENT_TIMESTAMP + INTERVAL '1 DAY';--> statement-breakpoint
ALTER TABLE "coursefull_user_course" ADD CONSTRAINT "coursefull_user_course_userId_coursefull_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."coursefull_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull_user_course" ADD CONSTRAINT "coursefull_user_course_courseId_coursefull_course_id_fk" FOREIGN KEY ("courseId") REFERENCES "public"."coursefull_course"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull_student_deliverable" ADD CONSTRAINT "coursefull_student_deliverable_userId_coursefull_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."coursefull_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull_student_deliverable" ADD CONSTRAINT "coursefull_student_deliverable_deliverableId_coursefull_deliverable_id_fk" FOREIGN KEY ("deliverableId") REFERENCES "public"."coursefull_deliverable"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull_user_in_school" ADD CONSTRAINT "coursefull_user_in_school_userId_coursefull_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."coursefull_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull_user_in_school" ADD CONSTRAINT "coursefull_user_in_school_schoolId_coursefull_school_id_fk" FOREIGN KEY ("schoolId") REFERENCES "public"."coursefull_school"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull_user_semester" ADD CONSTRAINT "coursefull_user_semester_userId_coursefull_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."coursefull_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull_user_semester" ADD CONSTRAINT "coursefull_user_semester_semesterId_coursefull_semester_id_fk" FOREIGN KEY ("semesterId") REFERENCES "public"."coursefull_semester"("id") ON DELETE no action ON UPDATE no action;