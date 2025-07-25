import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import { foreignKey, index, primaryKey } from "drizzle-orm/pg-core";

import { createTable } from "./common";
import { courses } from "./courses";
import { users } from "./users";

export const deliverables = createTable(
  "deliverable",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    publicId: d.text("public_id").$defaultFn(() => createId()),
    createdBy: d.text("created_by").references(() => users.id),
    public: d.boolean().default(false),
    courseId: d
      .integer("course_id")
      .references(() => courses.id)
      .notNull(),
    name: d.varchar({ length: 256 }),
    weight: d.real(),
    type: d.varchar({ length: 256 }), // TODO: see if this can't be converted to a postgres enum somehow
    startsAt: d
      .timestamp("starts_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    deadline: d
      .timestamp("deadline", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP + INTERVAL '1 DAY'`)
      .notNull(),
    createdAt: d
      .timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d
      .timestamp("updated_at", { withTimezone: true })
      .$onUpdate(() => new Date()),
  }),
  (t) => [
    index("deliverable_name_idx").on(t.name),
    index("deliverable_deadline_idx").on(t.deadline),
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

export const studentDeliverables = createTable(
  "student_deliverable",
  (d) => ({
    userId: d
      .text("user_id")
      .references(() => users.id)
      .notNull(),
    deliverableId: d
      .integer("deliverable_id")
      .references(() => deliverables.id)
      .notNull(),
    goal: d.real(),
    mark: d.real(),
    complete: d.boolean(),
    notes: d.text(),
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

export type Deliverable = typeof deliverables.$inferSelect;
export type NewDeliverable = typeof deliverables.$inferInsert;
export type StudentDeliverable = typeof studentDeliverables.$inferSelect;
export type NewStudentDeliverable = typeof studentDeliverables.$inferInsert;
