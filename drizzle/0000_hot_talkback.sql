CREATE SCHEMA "coursefull";
--> statement-breakpoint
CREATE TYPE "coursefull"."deliverable_type" AS ENUM('assignment', 'lab', 'tutorial', 'quiz', 'test', 'exam');--> statement-breakpoint
CREATE TYPE "coursefull"."user_role" AS ENUM('student', 'student_owner', 'faculty');--> statement-breakpoint
CREATE TABLE "coursefull"."course" (
	"id" text PRIMARY KEY NOT NULL,
	"createdBy" text,
	"public" boolean DEFAULT false,
	"semester" text NOT NULL,
	"name" varchar(256) NOT NULL,
	"short_code" varchar(32) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "coursefull"."user_course" (
	"user" text NOT NULL,
	"course" text NOT NULL,
	"role" "coursefull"."user_role",
	"goal" real,
	"deliverableGoal" real,
	"grade" real,
	CONSTRAINT "user_course_user_course_pk" PRIMARY KEY("user","course")
);
--> statement-breakpoint
CREATE TABLE "coursefull"."deliverable" (
	"id" text PRIMARY KEY NOT NULL,
	"createdBy" text,
	"public" boolean DEFAULT false,
	"course" text NOT NULL,
	"name" varchar(256) NOT NULL,
	"weight" real NOT NULL,
	"type" "coursefull"."deliverable_type" NOT NULL,
	"startsAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deadline" timestamp with time zone DEFAULT CURRENT_TIMESTAMP + INTERVAL '1 DAY' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "coursefull"."student_deliverable" (
	"user" text NOT NULL,
	"deliverable" text NOT NULL,
	"goal" real,
	"mark" real,
	"complete" boolean,
	"notes" text,
	CONSTRAINT "student_deliverable_user_deliverable_pk" PRIMARY KEY("user","deliverable")
);
--> statement-breakpoint
CREATE TABLE "coursefull"."school" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"alphaTwoCode" varchar(4) DEFAULT 'N/A' NOT NULL,
	"country" varchar(256) DEFAULT 'N/A' NOT NULL,
	"stateOrProvince" varchar(256),
	"hasAutoload" boolean DEFAULT false,
	"domains" json DEFAULT '[]'::json,
	"web_pages" json DEFAULT '[]'::json,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone,
	CONSTRAINT "school_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "coursefull"."user_in_school" (
	"user" text NOT NULL,
	"school" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone,
	CONSTRAINT "user_in_school_user_school_pk" PRIMARY KEY("user","school")
);
--> statement-breakpoint
CREATE TABLE "coursefull"."semester" (
	"id" text PRIMARY KEY NOT NULL,
	"createdBy" text,
	"public" boolean DEFAULT false,
	"school" text NOT NULL,
	"name" varchar(256) NOT NULL,
	"startsAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"endsAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP + INTERVAL '1 DAY' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "coursefull"."user_semester" (
	"user" text NOT NULL,
	"semester" text NOT NULL,
	"role" "coursefull"."user_role",
	"goal" real,
	"average" real,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone,
	CONSTRAINT "user_semester_user_semester_pk" PRIMARY KEY("user","semester")
);
--> statement-breakpoint
CREATE TABLE "coursefull"."account" (
	"userId" text NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"providerAccountId" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "coursefull"."session" (
	"sessionToken" varchar(255) PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coursefull"."user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"emailVerified" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
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
ALTER TABLE "coursefull"."course" ADD CONSTRAINT "course_createdBy_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "coursefull"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."course" ADD CONSTRAINT "course_semester_semester_id_fk" FOREIGN KEY ("semester") REFERENCES "coursefull"."semester"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."course" ADD CONSTRAINT "course_semester_fk" FOREIGN KEY ("semester") REFERENCES "coursefull"."semester"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."course" ADD CONSTRAINT "course_created_by_fk" FOREIGN KEY ("createdBy") REFERENCES "coursefull"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."user_course" ADD CONSTRAINT "user_course_user_user_id_fk" FOREIGN KEY ("user") REFERENCES "coursefull"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."user_course" ADD CONSTRAINT "user_course_course_course_id_fk" FOREIGN KEY ("course") REFERENCES "coursefull"."course"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."user_course" ADD CONSTRAINT "user_course_user_fk" FOREIGN KEY ("user") REFERENCES "coursefull"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."user_course" ADD CONSTRAINT "user_course_course_fk" FOREIGN KEY ("course") REFERENCES "coursefull"."course"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."deliverable" ADD CONSTRAINT "deliverable_createdBy_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "coursefull"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."deliverable" ADD CONSTRAINT "deliverable_course_course_id_fk" FOREIGN KEY ("course") REFERENCES "coursefull"."course"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."deliverable" ADD CONSTRAINT "deliverable_course_fk" FOREIGN KEY ("course") REFERENCES "coursefull"."course"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."deliverable" ADD CONSTRAINT "deliverable_created_by_fk" FOREIGN KEY ("createdBy") REFERENCES "coursefull"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."student_deliverable" ADD CONSTRAINT "student_deliverable_user_user_id_fk" FOREIGN KEY ("user") REFERENCES "coursefull"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."student_deliverable" ADD CONSTRAINT "student_deliverable_deliverable_deliverable_id_fk" FOREIGN KEY ("deliverable") REFERENCES "coursefull"."deliverable"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."student_deliverable" ADD CONSTRAINT "student_deliverable_user_fk" FOREIGN KEY ("user") REFERENCES "coursefull"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."student_deliverable" ADD CONSTRAINT "student_deliverable_deliverable_fk" FOREIGN KEY ("deliverable") REFERENCES "coursefull"."deliverable"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."user_in_school" ADD CONSTRAINT "user_in_school_user_user_id_fk" FOREIGN KEY ("user") REFERENCES "coursefull"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."user_in_school" ADD CONSTRAINT "user_in_school_school_school_id_fk" FOREIGN KEY ("school") REFERENCES "coursefull"."school"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."user_in_school" ADD CONSTRAINT "user_in_school_user_fk" FOREIGN KEY ("user") REFERENCES "coursefull"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."user_in_school" ADD CONSTRAINT "user_in_school_school_fk" FOREIGN KEY ("school") REFERENCES "coursefull"."school"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."semester" ADD CONSTRAINT "semester_createdBy_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "coursefull"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."semester" ADD CONSTRAINT "semester_school_school_id_fk" FOREIGN KEY ("school") REFERENCES "coursefull"."school"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."semester" ADD CONSTRAINT "semester_school_fk" FOREIGN KEY ("school") REFERENCES "coursefull"."school"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."semester" ADD CONSTRAINT "semester_created_by_fk" FOREIGN KEY ("createdBy") REFERENCES "coursefull"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."user_semester" ADD CONSTRAINT "user_semester_user_user_id_fk" FOREIGN KEY ("user") REFERENCES "coursefull"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."user_semester" ADD CONSTRAINT "user_semester_semester_semester_id_fk" FOREIGN KEY ("semester") REFERENCES "coursefull"."semester"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."user_semester" ADD CONSTRAINT "user_semester_user_fk" FOREIGN KEY ("user") REFERENCES "coursefull"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."user_semester" ADD CONSTRAINT "user_semester_semester_fk" FOREIGN KEY ("semester") REFERENCES "coursefull"."semester"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "coursefull"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coursefull"."session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "coursefull"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "course_name_idx" ON "coursefull"."course" USING btree ("name");--> statement-breakpoint
CREATE INDEX "deliverable_name_idx" ON "coursefull"."deliverable" USING btree ("name");--> statement-breakpoint
CREATE INDEX "deliverable_deadline_idx" ON "coursefull"."deliverable" USING btree ("deadline");--> statement-breakpoint
CREATE INDEX "deliverable_starts_at_idx" ON "coursefull"."deliverable" USING btree ("startsAt");--> statement-breakpoint
CREATE INDEX "school_name_idx" ON "coursefull"."school" USING btree ("name");--> statement-breakpoint
CREATE INDEX "semester_name_idx" ON "coursefull"."semester" USING btree ("name");--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "coursefull"."account" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "t_user_id_idx" ON "coursefull"."session" USING btree ("userId");