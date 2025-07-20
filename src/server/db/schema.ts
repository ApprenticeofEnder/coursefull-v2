import { create } from "domain";
import { relations, sql } from "drizzle-orm";
import { index, pgTableCreator, primaryKey } from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

import { log } from "~/lib/logger";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

export const createTable = pgTableCreator((name) => `coursefull_${name}`);

// TODO: Split this up into multiple files before it gets HUGE

/**
 * TABLES
 */

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
  (t) => [primaryKey({ columns: [t.userId, t.schoolId] })],
);

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

export const userCourses = createTable(
  "user_course",
  (d) => ({
    userId: d
      .uuid()
      .references(() => users.id)
      .notNull(),
    courseId: d
      .integer()
      .references(() => courses.id)
      .notNull(),
    role: d.varchar({ length: 32 }),
    // For different roles, goals (grades) might have different meanings
    // For a prof or TA, the goal might be for the whole class/semester
    // For a student, the goal might be personal
    goal: d.real(),
    deliverableGoal: d.real(),
    grade: d.real(),
  }),
  (t) => [primaryKey({ columns: [t.userId, t.courseId] })],
);

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

export const studentDeliverable = createTable(
  "student_deliverable",
  (d) => ({
    userId: d
      .uuid()
      .references(() => users.id)
      .notNull(),
    deliverableId: d
      .integer()
      .references(() => deliverables.id)
      .notNull(),
    goal: d.real(),
    mark: d.real(),
    notes: d.text(),
  }),
  (t) => [primaryKey({ columns: [t.userId, t.deliverableId] })],
);

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

export const verificationTokens = createTable(
  "verification_token",
  (d) => ({
    identifier: d.varchar({ length: 255 }).notNull(),
    token: d.varchar({ length: 255 }).notNull(),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);

/**
 * RELATIONS
 */

export const schoolRelations = relations(schools, ({ many }) => ({
  semesters: many(semesters),
  users: many(usersInSchools),
}));

export const usersInSchoolsRelations = relations(usersInSchools, ({ one }) => ({
  user: one(users, {
    fields: [usersInSchools.userId],
    references: [users.id],
  }),
  school: one(schools, {
    fields: [usersInSchools.schoolId],
    references: [schools.id],
  }),
}));

export const semestersRelations = relations(semesters, ({ one, many }) => ({
  school: one(schools, {
    fields: [semesters.schoolId],
    references: [schools.id],
  }),
  courses: many(courses),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  semester: one(semesters, {
    fields: [courses.semesterId],
    references: [semesters.id],
  }),
  deliverables: many(deliverables),
}));

export const deliverablesRelations = relations(deliverables, ({ one }) => ({
  course: one(courses, {
    fields: [deliverables.courseId],
    references: [courses.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));
