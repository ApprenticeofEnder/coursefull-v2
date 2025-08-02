import { and, eq, inArray } from "drizzle-orm";
import { upstashCache } from "drizzle-orm/cache/upstash";
import { drizzle } from "drizzle-orm/node-postgres";
import { type PgSelect } from "drizzle-orm/pg-core";
import { Pool } from "pg";

import { env } from "~/env";
import { getLogger } from "~/server/logger";

import * as schema from "./schema";
import * as views from "./views";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle({
  client: pool,
  schema,
  casing: "snake_case",
  cache: upstashCache({
    url: env.CACHE_URL,
    token: "",
  }),
});

/**
 * HELPERS
 */

export function withPagination<T extends PgSelect>(
  qb: T,
  page = 1,
  pageSize = 25,
) {
  return qb.limit(pageSize).offset((page - 1) * pageSize);
}

/**
 * QUERIES
 */

export async function createSemester(
  data: schema.NewSemester & {
    role?: schema.UserRole;
    goal: number;
  },
) {
  const logger = getLogger();
  await db.transaction(async (tx) => {
    const insertResult = await tx
      .insert(schema.semesters)
      .values(data)
      .onConflictDoNothing()
      .returning();

    if (!insertResult[0]) {
      return Promise.reject("Unable to create new semester.");
    }

    const semester = insertResult[0];
    if (!!data.createdBy) {
      // If we have an actual creator for the semester, let's associate them

      await tx.insert(schema.userSemesters).values({
        userId: data.createdBy,
        semesterId: semester.id,
        role: data.role,
        goal: data.goal,
      });
    }
    logger
      .withMetadata({ semester: semester.id })
      .trace("Semester created successfully.");
  });
}

export async function createCourse(
  data: schema.NewCourse & {
    role?: schema.UserRole;
    goal: number;
  },
) {
  const logger = getLogger();
  await db.transaction(async (tx) => {
    const insertResult = await tx
      .insert(schema.courses)
      .values(data)
      .onConflictDoNothing()
      .returning();

    if (!insertResult[0]) {
      return Promise.reject("Unable to create new course.");
    }

    const course = insertResult[0];

    if (!!data.createdBy) {
      // If we have a creator, associate it
      await tx.insert(schema.userCourses).values({
        userId: data.createdBy,
        courseId: course.id,
        role: data.role,
        goal: data.goal,
      });
    }
    logger
      .withMetadata({ course: course.id })
      .trace("Course created successfully.");
  });
}

export async function createDeliverable(
  data: schema.NewDeliverable & {
    role?: schema.UserRole;
    goal: number;
    mark?: number;
    notes?: string;
    complete?: boolean;
  },
) {
  const logger = getLogger();
  await db.transaction(async (tx) => {
    const insertResult = await tx
      .insert(schema.deliverables)
      .values(data)
      .onConflictDoNothing()
      .returning();

    if (!insertResult[0]) {
      return Promise.reject("Unable to create new deliverable.");
    }

    const deliverable = insertResult[0];

    if (
      !!data.createdBy &&
      (data.role === "student" || data.role === "student_owner") // Is the student role redundant since students can't create assignments
    ) {
      // If we have a creator that is a student, add it to their deliverables
      await tx.insert(schema.studentDeliverables).values({
        ...data,
        userId: data.createdBy,
        deliverableId: deliverable.id,
        complete: data.complete ?? false,
      });
    }
    logger
      .withMetadata({ deliverable: deliverable.id })
      .trace("Deliverable created successfully.");
  });
  // Last but not least, we'll update the course marks if the deliverable has a creator.
  if (data.createdBy) {
    await updateCourseGrades([data.createdBy], data.courseId);
  }
}

export async function updateCourseGrades(users: string[], course: string) {
  const grades = db.$with("grades").as(
    db
      .select()
      .from(views.studentGradeData)
      .where(
        and(
          inArray(views.studentGradeData.userId, users),
          eq(views.studentGradeData.course, course),
        ),
      ),
  );
  const deliverableGoal = schema.calculateTarget(
    schema.userCourses.goal,
    100,
    grades.pointsEarned,
    grades.weightCompleted,
  );
  await db
    .update(schema.userCourses)
    .set({
      grade: grades.grade,
      deliverableGoal,
    })
    .from(grades)
    .where(
      and(
        eq(schema.userCourses.userId, grades.userId),
        eq(schema.userCourses.courseId, grades.course),
      ),
    );
}
