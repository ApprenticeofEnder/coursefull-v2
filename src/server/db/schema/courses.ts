import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import { foreignKey, index, primaryKey } from "drizzle-orm/pg-core";

import { coursefullSchema, userRole } from "./common";
import { semesters } from "./semesters";
import { users } from "./users";

export const courses = coursefullSchema.table(
  "course",
  (d) => ({
    id: d
      .text()
      .$defaultFn(() => createId())
      .primaryKey(),
    createdBy: d.text().references(() => users.id),
    public: d.boolean().default(false),
    semester: d
      .text()
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
      columns: [t.semester],
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

export const userCourses = coursefullSchema.table(
  "user_course",
  (d) => ({
    user: d
      .text()
      .references(() => users.id)
      .notNull(),
    course: d
      .text()
      .references(() => courses.id)
      .notNull(),
    role: userRole(),
    // For different roles, goals (grades) might have different meanings
    // For a prof or TA, the goal might be for the whole class/semester
    // For a student, the goal might be personal
    goal: d.real(),
    deliverableGoal: d.real(),
    grade: d.real(),
  }),
  (t) => [
    primaryKey({ columns: [t.user, t.course] }),
    foreignKey({
      columns: [t.user],
      foreignColumns: [users.id],
      name: "user_course_user_fk",
    }),
    foreignKey({
      columns: [t.course],
      foreignColumns: [courses.id],
      name: "user_course_course_fk",
    }),
  ],
);

export type Course = typeof courses.$inferSelect;
export type NewCourse = typeof courses.$inferInsert;
export type UserCourse = typeof userCourses.$inferSelect;
export type NewUserCourse = typeof userCourses.$inferInsert;
