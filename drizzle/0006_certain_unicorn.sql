ALTER TABLE "coursefull_school" ADD COLUMN "alphaTwoCode" varchar(4) DEFAULT 'N/A' NOT NULL;--> statement-breakpoint
ALTER TABLE "coursefull_school" ADD COLUMN "country" varchar(256) DEFAULT 'N/A' NOT NULL;--> statement-breakpoint
ALTER TABLE "coursefull_school" ADD COLUMN "stateOrProvince" varchar(256);--> statement-breakpoint
ALTER TABLE "coursefull_school" ADD COLUMN "hasAutoload" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "coursefull_school" ADD COLUMN "domains" json DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "coursefull_school" ADD COLUMN "webPages" json DEFAULT '[]'::json;