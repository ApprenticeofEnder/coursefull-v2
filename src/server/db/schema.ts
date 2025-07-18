import { relations, sql } from "drizzle-orm";
import { index, pgTableCreator, primaryKey } from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `coursefull_${name}`);

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

export const schoolRelations = relations(schools, ({ many }) => ({
  semesters: many(semesters),
}));

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

export const semestersRelations = relations(semesters, ({ one, many }) => ({
  school: one(schools, {
    fields: [semesters.schoolId],
    references: [schools.id],
  }),
  courses: many(courses),
}));

export const courses = createTable(
  "course",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    publicId: d.uuid().defaultRandom(),
    semesterId: d
      .integer()
      .references(() => semesters.id)
      .notNull(),
    name: d.varchar({ length: 256 }),
    shortCode: d.varchar({ length: 32 }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("course_name_idx").on(t.name)],
);

export const coursesRelations = relations(courses, ({ one, many }) => ({
  semester: one(semesters, {
    fields: [courses.semesterId],
    references: [semesters.id],
  }),
  deliverables: many(deliverables),
}));

export const deliverables = createTable(
  "deliverable",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    publicId: d.uuid().defaultRandom(),
    courseId: d
      .integer()
      .references(() => courses.id)
      .notNull(),
    name: d.varchar({ length: 256 }),
    weight: d.real(),
    type: d.varchar({ length: 256 }), // TODO: see if this can't be converted to a postgres enum somehow
    startsAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    deadline: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(), // TODO: figure out how to default this to "deadline + 1 day"
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("deliverable_name_idx").on(t.name),
    index("deliverable_deadline_idx").on(t.deadline),
  ],
);

export const deliverablesRelations = relations(deliverables, ({ one }) => ({
  course: one(courses, {
    fields: [deliverables.courseId],
    references: [courses.id],
  }),
}));

export const users = createTable("user", (d) => ({
  id: d.uuid().defaultRandom().primaryKey(),
  name: d.varchar({ length: 255 }),
  email: d.varchar({ length: 255 }).notNull(),
  emailVerified: d
    .timestamp({
      mode: "date",
      withTimezone: true,
    })
    .default(sql`CURRENT_TIMESTAMP`),
  image: d.varchar({ length: 255 }),
  courseCredits: d.integer(),
  subscribed: d.boolean(),
}));

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  (d) => ({
    userId: d
      .uuid()
      .references(() => users.id)
      .notNull(),
    type: d.varchar({ length: 255 }).$type<AdapterAccount["type"]>().notNull(),
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

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  (d) => ({
    sessionToken: d.varchar({ length: 255 }).notNull().primaryKey(),
    userId: d
      .uuid()
      .references(() => users.id)
      .notNull(),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [index("t_user_id_idx").on(t.userId)],
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  (d) => ({
    identifier: d.varchar({ length: 255 }).notNull(),
    token: d.varchar({ length: 255 }).notNull(),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);
