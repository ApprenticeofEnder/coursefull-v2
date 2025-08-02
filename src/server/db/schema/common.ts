import { type SQL, sql } from "drizzle-orm";
import { PgColumn, pgSchema } from "drizzle-orm/pg-core";
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

export function weightedSum(
  valueColumn: PgColumn | SQL | SQL.Aliased,
  weightColumn: PgColumn | SQL | SQL.Aliased,
  fieldName?: string,
): SQL<number> {
  return sql<number>`sum(${valueColumn} * ${weightColumn})${fieldName ? " AS " + fieldName : ""}`;
}

export function weightedAverage(
  valueColumn: PgColumn | SQL | SQL.Aliased,
  weightColumn: PgColumn | SQL | SQL.Aliased,
  fieldName?: string,
): SQL<number> {
  return sql<number>`${weightedSum(valueColumn, weightColumn)} / sum(${weightColumn})${fieldName ? " AS " + fieldName : ""}`;
}

/**
 * This is specifically to calculate a new target for courses and semesters.
 */
export function calculateTarget(
  goalColumn: PgColumn | SQL | SQL.Aliased,
  totalWeight: number,
  pointsEarnedColumn: PgColumn | SQL | SQL.Aliased,
  weightCompletedColumn: PgColumn | SQL | SQL.Aliased,
  fieldName?: string,
) {
  return sql<number>`(${goalColumn} * ${totalWeight} - ${pointsEarnedColumn}) / (${totalWeight} - ${weightCompletedColumn})${fieldName ? " AS " + fieldName : ""}`;
}
