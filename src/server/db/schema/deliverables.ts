import { createId } from "@paralleldrive/cuid2";
import { and, eq, isNotNull, sql, sum } from "drizzle-orm";
import { foreignKey, index, primaryKey } from "drizzle-orm/pg-core";

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
    course: d
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
      columns: [t.course],
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
    user: d
      .text()
      .references(() => users.id)
      .notNull(),
    deliverable: d
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
    primaryKey({ columns: [t.user, t.deliverable] }),
    foreignKey({
      columns: [t.user],
      foreignColumns: [users.id],
      name: "student_deliverable_user_fk",
    }),
    foreignKey({
      columns: [t.deliverable],
      foreignColumns: [deliverables.id],
      name: "student_deliverable_deliverable_fk",
    }),
  ],
);

/**
 * VIEWS
 */

export const gradedDeliverables = coursefullSchema
  .view("graded_student_deliverables")
  .as((qb) => {
    return qb
      .select({
        deliverable: deliverables.id,
        name: deliverables.name,
        weight: deliverables.weight,
        mark: studentDeliverables.mark,
        user: studentDeliverables.user,
        completedAt: studentDeliverables.completedAt,
        notes: studentDeliverables.notes,
        type: deliverables.type,
        public: deliverables.public,
      })
      .from(studentDeliverables)
      .innerJoin(
        deliverables,
        eq(deliverables.id, studentDeliverables.deliverable),
      )
      .where(
        and(
          eq(studentDeliverables.complete, true),
          isNotNull(studentDeliverables.mark),
        ),
      );
  });

export const courseGrades = coursefullSchema
  .view("student_course_grades")
  .as((qb) => {
    return qb
      .select({
        user: gradedDeliverables.user,
        grade: weightedAverage(
          gradedDeliverables.mark,
          gradedDeliverables.weight,
        ),
        weightCompleted: sum(gradedDeliverables.weight),
        pointsEarned: weightedSum(
          gradedDeliverables.mark,
          gradedDeliverables.weight,
        ),
        course: courses.id,
      })
      .from(gradedDeliverables)
      .innerJoin(courses, eq(deliverables.course, courses.id))
      .groupBy(gradedDeliverables.user, courses.id);
  });

/**
 * TYPES
 */

export type Deliverable = typeof deliverables.$inferSelect;
export type NewDeliverable = typeof deliverables.$inferInsert;
export type StudentDeliverable = typeof studentDeliverables.$inferSelect;
export type NewStudentDeliverable = typeof studentDeliverables.$inferInsert;
