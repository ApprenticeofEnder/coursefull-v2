import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import { foreignKey, index, primaryKey } from "drizzle-orm/pg-core";

import { coursefullSchema, userRole } from "./common";
import { schools } from "./schools";
import { users } from "./users";

export const semesters = coursefullSchema.table(
  "semester",
  (d) => ({
    id: d
      .text()
      .$defaultFn(() => createId())
      .primaryKey(),
    createdBy: d.text().references(() => users.id),
    public: d.boolean().default(false),
    schoolId: d
      .text()
      .references(() => schools.id)
      .notNull(),
    name: d.varchar({ length: 256 }).notNull(),
    startsAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    endsAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP + INTERVAL '1 DAY'`)
      .notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("semester_name_idx").on(t.name),
    foreignKey({
      columns: [t.schoolId],
      foreignColumns: [schools.id],
      name: "semester_school_fk",
    }),
    foreignKey({
      columns: [t.createdBy],
      foreignColumns: [users.id],
      name: "semester_created_by_fk",
    }),
  ],
);

export const userSemesters = coursefullSchema.table(
  "user_semester",
  (d) => ({
    userId: d
      .text()
      .references(() => users.id)
      .notNull(),
    semesterId: d
      .text()
      .references(() => semesters.id)
      .notNull(),
    role: userRole(),
    // For different roles, goals might have different meanings
    // For a prof or TA, the goal might be for the whole class/semester
    // For a student, the goal might be personal
    goal: d.real(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    primaryKey({ columns: [t.userId, t.semesterId] }),
    foreignKey({
      columns: [t.userId],
      foreignColumns: [users.id],
      name: "user_semester_user_fk",
    }),
    foreignKey({
      columns: [t.semesterId],
      foreignColumns: [semesters.id],
      name: "user_semester_semester_fk",
    }),
  ],
);

export type Semester = typeof semesters.$inferSelect;
export type NewSemester = typeof semesters.$inferInsert;
export type UserSemester = typeof userSemesters.$inferSelect;
export type NewUserSemester = typeof userSemesters.$inferInsert;
