import { sql } from "drizzle-orm";
import { foreignKey, index, primaryKey } from "drizzle-orm/pg-core";

import { createTable } from "./common";
import { users } from "./users";

export const schools = createTable(
  "school",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    publicId: d.uuid().defaultRandom(),
    name: d.varchar({ length: 256 }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("school_name_idx").on(t.name)],
);

export const usersInSchools = createTable(
  "user_in_school",
  (d) => ({
    userId: d
      .uuid()
      .references(() => users.id)
      .notNull(),
    schoolId: d
      .integer()
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
