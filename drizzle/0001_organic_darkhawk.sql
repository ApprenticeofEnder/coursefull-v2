CREATE SCHEMA "coursefull";
--> statement-breakpoint
CREATE TYPE "coursefull"."deliverable_type" AS ENUM('assignment', 'lab', 'tutorial', 'quiz', 'test', 'exam');--> statement-breakpoint
ALTER TABLE "coursefull_course" ALTER COLUMN "public_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "coursefull_deliverable" ALTER COLUMN "public_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "coursefull_school" ALTER COLUMN "public_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "coursefull_semester" ALTER COLUMN "public_id" SET NOT NULL;