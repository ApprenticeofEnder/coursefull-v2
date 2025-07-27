import { relations } from "drizzle-orm";

import { courses, userCourses } from "./courses";
import { deliverables, studentDeliverables } from "./deliverables";
import { schools, usersInSchools } from "./schools";
import { semesters, userSemesters } from "./semesters";
import { accounts, sessions, users } from "./users";

export const schoolRelations = relations(schools, ({ many }) => ({
  semesters: many(semesters),
  usersInSchools: many(usersInSchools),
}));

export const usersInSchoolsRelations = relations(usersInSchools, ({ one }) => ({
  user: one(users, {
    fields: [usersInSchools.user],
    references: [users.id],
  }),
  school: one(schools, {
    fields: [usersInSchools.school],
    references: [schools.id],
  }),
}));

export const semestersRelations = relations(semesters, ({ one, many }) => ({
  school: one(schools, {
    fields: [semesters.school],
    references: [schools.id],
  }),
  courses: many(courses),
  userSemesters: many(userSemesters),
}));

export const userSemestersRelations = relations(userSemesters, ({ one }) => ({
  user: one(users, {
    fields: [userSemesters.user],
    references: [users.id],
  }),
  semester: one(semesters, {
    fields: [userSemesters.semester],
    references: [semesters.id],
  }),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  semester: one(semesters, {
    fields: [courses.semester],
    references: [semesters.id],
  }),
  deliverables: many(deliverables),
  userCourses: many(userCourses),
}));

export const userCoursesRelations = relations(userCourses, ({ one }) => ({
  user: one(users, {
    fields: [userCourses.user],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [userCourses.course],
    references: [courses.id],
  }),
}));

export const deliverablesRelations = relations(
  deliverables,
  ({ one, many }) => ({
    course: one(courses, {
      fields: [deliverables.course],
      references: [courses.id],
    }),
    studentDeliverables: many(studentDeliverables),
  }),
);

export const studentDeliverablesRelations = relations(
  studentDeliverables,
  ({ one }) => ({
    user: one(users, {
      fields: [studentDeliverables.user],
      references: [users.id],
    }),
    deliverable: one(deliverables, {
      fields: [studentDeliverables.deliverable],
      references: [deliverables.id],
    }),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  usersInSchools: many(usersInSchools),
  userSemesters: many(userSemesters),
  userCourses: many(userCourses),
  studentDeliverables: many(studentDeliverables),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));
