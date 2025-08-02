import { boolean, real, text, timestamp } from "drizzle-orm/pg-core";

import { coursefullSchema, deliverableType } from "~/server/db/schema";

export const gradedDeliverables = coursefullSchema
  .view("graded_student_deliverables", {
    deliverableId: text().notNull(),
    courseId: text().notNull(),
    name: text().notNull(),
    weight: real().notNull(),
    mark: real().notNull(),
    userId: text().notNull(),
    completedAt: timestamp().notNull(),
    notes: text(),
    type: deliverableType().notNull(),
    public: boolean().notNull(),
    deadline: timestamp().notNull(),
    startsAt: timestamp().notNull(),
  })
  .existing();

export const courseGrades = coursefullSchema
  .view("student_course_grades", {
    userId: text().notNull(),
    grade: real().notNull(),
    weightCompleted: real().notNull(),
    pointsEarned: real().notNull(),
    course: text().notNull(),
  })
  .existing();
