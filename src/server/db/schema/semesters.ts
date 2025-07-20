import { sql } from "drizzle-orm";
import { index, primaryKey } from "drizzle-orm/pg-core";

import { createTable } from "./common";
import { schools } from "./schools";
import { users } from "./users";

export const semesters = createTable(
  "semester",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    publicId: d.uuid().defaultRandom(),
    schoolId: d
      .integer()
      .references(() => schools.id)
      .notNull(),
    name: d.varchar({ length: 256 }),
    startsAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    endsAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("semester_name_idx").on(t.name)],
);

export const userSemesters = createTable(
  "user_semester",
  (d) => ({
    userId: d
      .uuid()
      .references(() => users.id)
      .notNull(),
    semesterId: d
      .integer()
      .references(() => semesters.id)
      .notNull(),
    role: d.varchar({ length: 32 }),
    // For different roles, goals might have different meanings
    // For a prof or TA, the goal might be for the whole class/semester
    // For a student, the goal might be personal
    goal: d.real(),
    average: d.real(),
  }),
  (t) => [primaryKey({ columns: [t.userId, t.semesterId] })],
);
