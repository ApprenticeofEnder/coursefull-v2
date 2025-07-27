import { type AdapterAccountType } from "@auth/core/adapters";
import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import { index, primaryKey } from "drizzle-orm/pg-core";

import { coursefullSchema } from "./common";

export const users = coursefullSchema.table("user", (d) => ({
  id: d
    .text()
    .$defaultFn(() => createId())
    .primaryKey(),
  name: d.varchar({ length: 255 }).notNull(),
  email: d.varchar({ length: 255 }).notNull().unique(),
  emailVerified: d
    .timestamp({
      mode: "date",
      withTimezone: true,
    })
    .default(sql`CURRENT_TIMESTAMP`),
  image: d.varchar({ length: 255 }),
  courseCredits: d.integer("course_credits"),
  subscribed: d.boolean(),
  createdAt: d
    .timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d
    .timestamp("updated_at", { withTimezone: true })
    .$onUpdate(() => new Date()),
}));

export const accounts = coursefullSchema.table(
  "account",
  (d) => ({
    userId: d
      .text()
      .references(() => users.id)
      .notNull(),
    type: d.varchar({ length: 255 }).$type<AdapterAccountType>().notNull(),
    provider: d.varchar({ length: 255 }).notNull(),
    providerAccountId: d.varchar({ length: 255 }).notNull(),
    refresh_token: d.text(),
    access_token: d.text(),
    expires_at: d.integer(),
    token_type: d.varchar({ length: 255 }),
    scope: d.varchar({ length: 255 }),
    id_token: d.text(),
    session_state: d.varchar({ length: 255 }),
  }),
  (t) => [
    primaryKey({ columns: [t.provider, t.providerAccountId] }),
    index("account_user_id_idx").on(t.userId),
  ],
);

export const sessions = coursefullSchema.table(
  "session",
  (d) => ({
    sessionToken: d.varchar({ length: 255 }).notNull().primaryKey(),
    userId: d
      .text()
      .references(() => users.id)
      .notNull(),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [index("t_user_id_idx").on(t.userId)],
);

export const verificationTokens = coursefullSchema.table(
  "verification_token",
  (d) => ({
    identifier: d.varchar({ length: 255 }).notNull(),
    token: d.varchar({ length: 255 }).notNull(),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
