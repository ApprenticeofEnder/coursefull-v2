import { pgSchema } from "drizzle-orm/pg-core";
import { pgTableCreator } from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `coursefull_${name}`);

export const coursefullSchema = pgSchema("coursefull");

export const deliverableType = coursefullSchema.enum("deliverable_type", [
  "assignment",
  "lab",
  "tutorial",
  "quiz",
  "test",
  "exam",
]);

// This is to give a usable type to the enum
export type DeliverableType = (typeof deliverableType.enumValues)[number];

export const userRole = coursefullSchema.enum("user_role", [
  "student",
  "student_owner",
  "faculty",
]);

export type UserRole = (typeof userRole.enumValues)[number];
