import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import { foreignKey, index, primaryKey } from "drizzle-orm/pg-core";

import { createTable } from "./common";
import { semesters } from "./semesters";
import { users } from "./users";

export const courses = createTable(
  "course",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    publicId: d.text("public_id").$defaultFn(() => createId()),
    createdBy: d.text("created_by").references(() => users.id),
    public: d.boolean().default(false),
    semesterId: d
      .integer("semester_id")
      .references(() => semesters.id)
      .notNull(),
    name: d.varchar({ length: 256 }).notNull(),
    shortCode: d.varchar("short_code", { length: 32 }).notNull(),
    createdAt: d
      .timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d
      .timestamp("updated_at", { withTimezone: true })
      .$onUpdate(() => new Date()),
  }),
  (t) => [
    index("course_name_idx").on(t.name),
    foreignKey({
      columns: [t.semesterId],
      foreignColumns: [semesters.id],
      name: "course_semester_fk",
    }),
    foreignKey({
      columns: [t.createdBy],
      foreignColumns: [users.id],
      name: "course_created_by_fk",
    }),
  ],
);

export const userCourses = createTable(
  "user_course",
  (d) => ({
    userId: d
      .text("user_id")
      .references(() => users.id)
      .notNull(),
    courseId: d
      .integer("course_id")
      .references(() => courses.id)
      .notNull(),
    role: d.varchar({ length: 32 }),
    // For different roles, goals (grades) might have different meanings
    // For a prof or TA, the goal might be for the whole class/semester
    // For a student, the goal might be personal
    goal: d.real(),
    deliverableGoal: d.real("deliverable_goal"),
    grade: d.real(),
  }),
  (t) => [
    primaryKey({ columns: [t.userId, t.courseId] }),
    foreignKey({
      columns: [t.userId],
      foreignColumns: [users.id],
      name: "user_course_user_fk",
    }),
    foreignKey({
      columns: [t.courseId],
      foreignColumns: [courses.id],
      name: "user_course_course_fk",
    }),
  ],
);

export type Course = typeof courses.$inferSelect;
export type NewCourse = typeof courses.$inferInsert;
export type UserCourse = typeof userCourses.$inferSelect;
export type NewUserCourse = typeof userCourses.$inferInsert;
