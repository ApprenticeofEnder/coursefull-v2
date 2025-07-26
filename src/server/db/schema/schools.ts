import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import { foreignKey, index, pgView, primaryKey } from "drizzle-orm/pg-core";

import { createTable } from "./common";
import { users } from "./users";

export const schools = createTable(
  "school",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    publicId: d
      .text("public_id")
      .$defaultFn(() => createId())
      .notNull(),
    name: d.varchar({ length: 256 }).notNull().unique(),
    alphaTwoCode: d
      .varchar("alpha_two_code", { length: 4 })
      .notNull()
      .default("N/A"),
    country: d.varchar({ length: 256 }).notNull().default("N/A"),
    stateOrProvince: d.varchar("state_or_province", { length: 256 }),
    // This just lets us know whether we can load in semester data automatically.
    hasAutoload: d.boolean("has_autoload").default(false),
    domains: d.json().$type<string[]>().default([]),
    webPages: d.json("web_pages").$type<string[]>().default([]),
    createdAt: d
      .timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d
      .timestamp("updated_at", { withTimezone: true })
      .$onUpdate(() => new Date()),
  }),
  (t) => [index("school_name_idx").on(t.name)],
);

export const usersInSchools = createTable(
  "user_in_school",
  (d) => ({
    userId: d
      .text("user_id")
      .references(() => users.id)
      .notNull(),
    schoolId: d
      .integer("school_id")
      .references(() => schools.id)
      .notNull(),
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

export type School = typeof schools.$inferSelect;
export type NewSchool = typeof schools.$inferInsert;
export type UserInSchool = typeof usersInSchools.$inferSelect;
export type NewUserInSchool = typeof usersInSchools.$inferInsert;
