import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import { foreignKey, index, primaryKey } from "drizzle-orm/pg-core";

import { coursefullSchema, deliverableType } from "./common";
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
 * TYPES
 */

export type Deliverable = typeof deliverables.$inferSelect;
export type NewDeliverable = typeof deliverables.$inferInsert;
export type StudentDeliverable = typeof studentDeliverables.$inferSelect;
export type NewStudentDeliverable = typeof studentDeliverables.$inferInsert;
