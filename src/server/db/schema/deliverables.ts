import { createId } from "@paralleldrive/cuid2";
import { and, eq, isNotNull, sql, sum } from "drizzle-orm";
import {
  boolean,
  foreignKey,
  index,
  primaryKey,
  real,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import {
  coursefullSchema,
  deliverableType,
  weightedAverage,
  weightedSum,
} from "./common";
import { courses } from "./courses";
import { users } from "./users";

/**
 * TABLES
 */

export const deliverables = coursefullSchema.table(
  "deliverable",
  (d) => ({
    id: d
      .text()
      .$defaultFn(() => createId())
      .primaryKey(),
    createdBy: d.text().references(() => users.id),
    public: d.boolean().default(false),
    courseId: d
      .text()
      .references(() => courses.id)
      .notNull(),
    name: d.varchar({ length: 256 }).notNull(),
    weight: d.real().notNull(),
    type: deliverableType().notNull(),
    startsAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    deadline: d
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
    index("deliverable_name_idx").on(t.name),
    index("deliverable_deadline_idx").on(t.deadline),
    index("deliverable_starts_at_idx").on(t.startsAt),
    foreignKey({
      columns: [t.courseId],
      foreignColumns: [courses.id],
      name: "deliverable_course_fk",
    }),
    foreignKey({
      columns: [t.createdBy],
      foreignColumns: [users.id],
      name: "deliverable_created_by_fk",
    }),
  ],
);

export const studentDeliverables = coursefullSchema.table(
  "student_deliverable",
  (d) => ({
    userId: d
      .text()
      .references(() => users.id)
      .notNull(),
    deliverableId: d
      .text()
      .references(() => deliverables.id)
      .notNull(),
    goal: d.real(),
    mark: d.real(),
    complete: d.boolean(),
    completedAt: d.timestamp({ withTimezone: true }),
    notes: d.text(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    primaryKey({ columns: [t.userId, t.deliverableId] }),
    foreignKey({
      columns: [t.userId],
      foreignColumns: [users.id],
      name: "student_deliverable_user_fk",
    }),
    foreignKey({
      columns: [t.deliverableId],
      foreignColumns: [deliverables.id],
      name: "student_deliverable_deliverable_fk",
    }),
  ],
);

/**
 * VIEWS
 */

// const gradedDeliverablesSpec = sql`SELECT
//   ${deliverables.id} as deliverable,
//   ${deliverables.courseId} as course,
//   ${deliverables.name} as name,
//   ${deliverables.weight} as weight,
//   ${studentDeliverables.mark} as mark,
//   ${studentDeliverables.userId} as user_id,
//   ${studentDeliverables.completedAt} as completed_at,
//   ${studentDeliverables.notes} as notes,
//   ${deliverables.type} as type,
//   ${deliverables.public} as public
// FROM ${studentDeliverables}
// INNER JOIN ${deliverables} ON ${eq(deliverables.id, studentDeliverables.deliverableId)}
// WHERE ${eq(studentDeliverables.complete, true)} AND ${isNotNull(studentDeliverables.mark)}`;
//
// export const gradedDeliverables = coursefullSchema
//   .view("graded_student_deliverables", {
//     deliverable: text().notNull(),
//     course: text().notNull(),
//     name: text().notNull(),
//     weight: real().notNull(),
//     mark: real().notNull(),
//     userId: text().notNull(),
//     completedAt: timestamp().notNull(),
//     notes: text().notNull(),
//     type: deliverableType().notNull(),
//     public: boolean().notNull(),
//   })
//   .as(gradedDeliverablesSpec);
//
// const courseGradesSpec = sql`SELECT
//   ${gradedDeliverables.userId} as userId,
//   ${weightedAverage(gradedDeliverables.mark, gradedDeliverables.weight)} as grade,
//   ${sum(gradedDeliverables.weight)} as weightCompleted,
//   ${weightedSum(gradedDeliverables.mark, gradedDeliverables.weight)} as pointsEarned,
//   ${gradedDeliverables.course} as course
// FROM ${gradedDeliverables}
// INNER JOIN ${courses} on ${eq(gradedDeliverables.course, courses.id)}
// GROUP BY ${gradedDeliverables.userId}, ${gradedDeliverables.course}`;
//
// export const courseGrades = coursefullSchema
//   .view("student_course_grades", {
//     userId: text().notNull(),
//     grade: real().notNull(),
//     weightCompleted: real().notNull(),
//     pointsEarned: real().notNull(),
//     course: text().notNull(),
//   })
//   .as(courseGradesSpec);

/**
 * TYPES
 */

export type Deliverable = typeof deliverables.$inferSelect;
export type NewDeliverable = typeof deliverables.$inferInsert;
export type StudentDeliverable = typeof studentDeliverables.$inferSelect;
export type NewStudentDeliverable = typeof studentDeliverables.$inferInsert;
