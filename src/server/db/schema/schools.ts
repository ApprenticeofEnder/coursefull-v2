import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import { foreignKey, index, primaryKey } from "drizzle-orm/pg-core";

import { coursefullSchema } from "./common";
import { users } from "./users";

/**
 * TABLES
 */

export const schools = coursefullSchema.table(
  "school",
  (d) => ({
    id: d
      .text()
      .$defaultFn(() => createId())
      .primaryKey(),
    name: d.varchar({ length: 256 }).notNull().unique(),
    alphaTwoCode: d.varchar({ length: 4 }).notNull().default("N/A"),
    country: d.varchar({ length: 256 }).notNull().default("N/A"),
    stateOrProvince: d.varchar({ length: 256 }),
    // This just lets us know whether we can load in semester data automatically.
    hasAutoload: d.boolean().default(false),
    domains: d.json().$type<string[]>().default([]),
    webPages: d.json("web_pages").$type<string[]>().default([]),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("school_name_idx").on(t.name)],
);

export const usersInSchools = coursefullSchema.table(
  "user_in_school",
  (d) => ({
    userId: d
      .text()
      .references(() => users.id)
      .notNull(),
    schoolId: d
      .text()
      .references(() => schools.id)
      .notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    primaryKey({ columns: [t.userId, t.schoolId] }),
    foreignKey({
      columns: [t.userId],
      foreignColumns: [users.id],
      name: "user_in_school_user_fk",
    }),
    foreignKey({
      columns: [t.schoolId],
      foreignColumns: [schools.id],
      name: "user_in_school_school_fk",
    }),
  ],
);

/**
 * VIEWS
 */

/**
 * TYPES
 */

export type School = typeof schools.$inferSelect;
export type NewSchool = typeof schools.$inferInsert;
export type UserInSchool = typeof usersInSchools.$inferSelect;
export type NewUserInSchool = typeof usersInSchools.$inferInsert;
