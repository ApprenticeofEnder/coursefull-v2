CREATE SCHEMA "coursefull";
--> statement-breakpoint
CREATE TYPE "coursefull"."deliverable_type" AS ENUM('assignment', 'lab', 'tutorial', 'quiz', 'test', 'exam');--> statement-breakpoint
CREATE TYPE "coursefull"."user_role" AS ENUM('student', 'student_owner', 'faculty');--> statement-breakpoint
CREATE TABLE "coursefull"."course" (
	"id" text PRIMARY KEY NOT NULL,
	"created_by" text,
	"public" boolean DEFAULT false,
	"semester_id" text NOT NULL,
	"name" varchar(256) NOT NULL,
	"short_code" varchar(32) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "coursefull"."user_course" (
	"user_id" text NOT NULL,
	"course_id" text NOT NULL,
	"role" "coursefull"."user_role",
	"goal" real,
	"deliverable_goal" real,
	"grade" real,
	CONSTRAINT "user_course_user_id_course_id_pk" PRIMARY KEY("user_id","course_id")
);
--> statement-breakpoint
CREATE TABLE "coursefull"."deliverable" (
	"id" text PRIMARY KEY NOT NULL,
	"created_by" text,
	"public" boolean DEFAULT false,
	"course_id" text NOT NULL,
	"name" varchar(256) NOT NULL,
	"weight" real NOT NULL,
	"type" "coursefull"."deliverable_type" NOT NULL,
	"starts_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deadline" timestamp with time zone DEFAULT CURRENT_TIMESTAMP + INTERVAL '1 DAY' NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "coursefull"."student_deliverable" (
	"user_id" text NOT NULL,
	"deliverable_id" text NOT NULL,
	"goal" real,
	"mark" real,
	"complete" boolean,
	"completed_at" timestamp with time zone,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "student_deliverable_user_id_deliverable_id_pk" PRIMARY KEY("user_id","deliverable_id")
);
--> statement-breakpoint
CREATE TABLE "coursefull"."school" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"alpha_two_code" varchar(4) DEFAULT 'N/A' NOT NULL,
	"country" varchar(256) DEFAULT 'N/A' NOT NULL,
	"state_or_province" varchar(256),
	"has_autoload" boolean DEFAULT false,
	"domains" json DEFAULT '[]'::json,
	"web_pages" json DEFAULT '[]'::json,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "school_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "coursefull"."user_in_school" (
	"user_id" text NOT NULL,
	"school_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "user_in_school_user_id_school_id_pk" PRIMARY KEY("user_id","school_id")
);
--> statement-breakpoint
CREATE TABLE "coursefull"."semester" (
	"id" text PRIMARY KEY NOT NULL,
	"created_by" text,
	"public" boolean DEFAULT false,
	"school_id" text NOT NULL,
	"name" varchar(256) NOT NULL,
	"starts_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"ends_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP + INTERVAL '1 DAY' NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "coursefull"."user_semester" (
	"user_id" text NOT NULL,
	"semester_id" text NOT NULL,
	"role" "coursefull"."user_role",
	"goal" real,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "user_semester_user_id_semester_id_pk" PRIMARY KEY("user_id","semester_id")
);
--> statement-breakpoint
CREATE TABLE "coursefull"."account" (
	"user_id" text NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "coursefull"."session" (
	"session_token" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coursefull"."user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255),
	"course_credits" integer,
	"subscribed" boolean,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "coursefull"."verification_token" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
ALTER TABLE "coursefull"."course" ADD CONSTRAINT "course_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "coursefull"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."course" ADD CONSTRAINT "course_semester_id_semester_id_fk" FOREIGN KEY ("semester_id") REFERENCES "coursefull"."semester"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."course" ADD CONSTRAINT "course_semester_fk" FOREIGN KEY ("semester_id") REFERENCES "coursefull"."semester"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."course" ADD CONSTRAINT "course_created_by_fk" FOREIGN KEY ("created_by") REFERENCES "coursefull"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."user_course" ADD CONSTRAINT "user_course_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "coursefull"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."user_course" ADD CONSTRAINT "user_course_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "coursefull"."course"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."user_course" ADD CONSTRAINT "user_course_user_fk" FOREIGN KEY ("user_id") REFERENCES "coursefull"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."user_course" ADD CONSTRAINT "user_course_course_fk" FOREIGN KEY ("course_id") REFERENCES "coursefull"."course"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."deliverable" ADD CONSTRAINT "deliverable_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "coursefull"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."deliverable" ADD CONSTRAINT "deliverable_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "coursefull"."course"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."deliverable" ADD CONSTRAINT "deliverable_course_fk" FOREIGN KEY ("course_id") REFERENCES "coursefull"."course"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."deliverable" ADD CONSTRAINT "deliverable_created_by_fk" FOREIGN KEY ("created_by") REFERENCES "coursefull"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."student_deliverable" ADD CONSTRAINT "student_deliverable_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "coursefull"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."student_deliverable" ADD CONSTRAINT "student_deliverable_deliverable_id_deliverable_id_fk" FOREIGN KEY ("deliverable_id") REFERENCES "coursefull"."deliverable"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."student_deliverable" ADD CONSTRAINT "student_deliverable_user_fk" FOREIGN KEY ("user_id") REFERENCES "coursefull"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."student_deliverable" ADD CONSTRAINT "student_deliverable_deliverable_fk" FOREIGN KEY ("deliverable_id") REFERENCES "coursefull"."deliverable"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."user_in_school" ADD CONSTRAINT "user_in_school_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "coursefull"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."user_in_school" ADD CONSTRAINT "user_in_school_school_id_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "coursefull"."school"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."user_in_school" ADD CONSTRAINT "user_in_school_user_fk" FOREIGN KEY ("user_id") REFERENCES "coursefull"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."user_in_school" ADD CONSTRAINT "user_in_school_school_fk" FOREIGN KEY ("school_id") REFERENCES "coursefull"."school"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."semester" ADD CONSTRAINT "semester_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "coursefull"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."semester" ADD CONSTRAINT "semester_school_id_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "coursefull"."school"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."semester" ADD CONSTRAINT "semester_school_fk" FOREIGN KEY ("school_id") REFERENCES "coursefull"."school"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."semester" ADD CONSTRAINT "semester_created_by_fk" FOREIGN KEY ("created_by") REFERENCES "coursefull"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."user_semester" ADD CONSTRAINT "user_semester_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "coursefull"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."user_semester" ADD CONSTRAINT "user_semester_semester_id_semester_id_fk" FOREIGN KEY ("semester_id") REFERENCES "coursefull"."semester"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."user_semester" ADD CONSTRAINT "user_semester_user_fk" FOREIGN KEY ("user_id") REFERENCES "coursefull"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."user_semester" ADD CONSTRAINT "user_semester_semester_fk" FOREIGN KEY ("semester_id") REFERENCES "coursefull"."semester"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "coursefull"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "coursefull"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "course_name_idx" ON "coursefull"."course" USING btree ("name");--> statement-breakpoint
CREATE INDEX "deliverable_name_idx" ON "coursefull"."deliverable" USING btree ("name");--> statement-breakpoint
CREATE INDEX "deliverable_deadline_idx" ON "coursefull"."deliverable" USING btree ("deadline");--> statement-breakpoint
CREATE INDEX "deliverable_starts_at_idx" ON "coursefull"."deliverable" USING btree ("starts_at");--> statement-breakpoint
CREATE INDEX "school_name_idx" ON "coursefull"."school" USING btree ("name");--> statement-breakpoint
CREATE INDEX "semester_name_idx" ON "coursefull"."semester" USING btree ("name");--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "coursefull"."account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "t_user_id_idx" ON "coursefull"."session" USING btree ("user_id");