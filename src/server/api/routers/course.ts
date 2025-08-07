import { isCuid } from "@paralleldrive/cuid2";
import { TRPCError } from "@trpc/server";
import { and, asc, eq, ilike } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, procedureFactory } from "~/server/api/trpc";
import { createCourse, withPagination } from "~/server/db";
import {
  courseInvites,
  courses,
  semesters,
  userCourses,
  userRole,
  userSemesters,
} from "~/server/db/schema";

const { publicProcedure, protectedProcedure } = procedureFactory("semesters");

export const courseRouter = createTRPCRouter({
  // Primary way of inviting people to a course is via invite links
  createInviteLink: protectedProcedure
    .input(
      z.object({
        courseId: z.string().refine(isCuid),
        validUntil: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const userId = ctx.session.user.id;

        const course = await tx.query.courses.findFirst({
          where: and(
            eq(courses.id, input.courseId),
            eq(courses.createdBy, userId),
          ),
        });

        if (!course) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message:
              "Sorry, we can't create an invite link for that course. Please contact the creator to request one.",
          });
        }

        await tx.insert(courseInvites).values({
          ...input,
        });

        ctx.logger
          .withMetadata({ userId, courseId: input.courseId })
          .debug("Course invite created.");
      });
    }),

  acceptInviteLink: protectedProcedure
    .input(
      z.object({
        inviteId: z.string().refine(isCuid),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const userId = ctx.session.user.id;
        const invite = await tx.query.courseInvites.findFirst({
          where: eq(courseInvites.id, input.inviteId),
          with: {
            course: {
              with: {
                semester: {
                  with: {
                    userSemesters: {
                      where: eq(userSemesters.userId, userId),
                    },
                  },
                },
              },
            },
          },
        });

        // Check for both existence and expiry.
        if (!invite || invite.validUntil < new Date()) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Sorry, that invite link is invalid.",
          });
        }

        const goal = invite.course.semester.userSemesters[0]?.goal;

        await tx
          .insert(userCourses)
          .values({ ...input, courseId: invite.course.id, userId, goal });

        ctx.logger
          .withMetadata({ userId, courseId: invite.course.id })
          .debug("User accepted course invite.");
      });
    }),

  getMemberList: protectedProcedure
    .input(
      z.object({
        courseId: z.string().refine(isCuid),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userCourse = await ctx.db.query.userCourses.findFirst({
        where: and(
          eq(userCourses.courseId, input.courseId),
          eq(userCourses.userId, ctx.session.user.id),
        ),
      });

      if (!userCourse) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "Sorry, you can't see the members of this course because you're not in it. Ask the creator for an invite link!",
        });
      }

      const members = await ctx.db.query.userCourses.findMany({
        where: eq(userCourses.courseId, input.courseId),
        with: {
          user: {
            columns: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      return members;
    }),

  search: publicProcedure
    .input(
      z.object({
        limit: z.number().gte(10).catch(25),
        page: z.number().gte(1).catch(1),
        semester: z.string().refine(isCuid),
        shortCode: z.string().optional(),
        name: z.string().optional(),
        // TODO: Maybe more in depth parameters?
      }),
    )
    .query(async ({ ctx, input }) => {
      // Need to work out the public field
      const baseQuery = ctx.db
        .select()
        .from(courses)
        .innerJoin(semesters, eq(semesters.id, courses.semesterId))
        .where(
          and(
            input.semester ? eq(courses.semesterId, input.semester) : undefined,
            input.shortCode
              ? ilike(courses.shortCode, `%${input.shortCode}%`)
              : undefined,
            input.name ? ilike(courses.name, `%${input.name}%`) : undefined,
          ),
        )
        .orderBy(asc(semesters.startsAt))
        .$withCache();
      const [allCourses, coursePage] = await Promise.all([
        baseQuery,
        withPagination(baseQuery.$dynamic(), input.page, input.limit),
      ]);
      const pages = Math.ceil(allCourses.length / input.limit);
      const result = {
        courses: coursePage,
        pages,
      };
      return result;
    }),

  getCourse: protectedProcedure
    .input(
      z.object({
        courseId: z.string().refine(isCuid),
      }),
    )
    .query(async ({ ctx, input }) => {
      const course = await ctx.db.query.courses.findFirst({
        where: eq(courses.id, input.courseId),
      });
      if (!course) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return course;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        shortCode: z.string(),
        semesterId: z.string(),
        public: z.boolean(),
        role: z
          .enum(userRole.enumValues)
          .refine(
            (val) => val === "student_owner" || val === "faculty",
            "You need to be a student_owner or faculty to create a course!",
          ),
        goal: z.number().gt(0).lte(100),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const createdBy = ctx.session.user.id;

      await createCourse({
        ...input,
        createdBy,
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        shortCode: z.string(),
        courseId: z.number(),
        public: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const userId = ctx.session.user.id;
        // TODO: add update procedures
      });
    }),

  // TODO: Update enrolment, leave course, etc.

  generateDeliverables: protectedProcedure
    .input(z.object({}))
    .mutation(async ({ ctx, input }) => {
      // This might work best with an async task queue
      // TODO: Look into integrating Bull and some kind of Redis cache
      // Might also be useful for DB caching
    }),

  // TODO: Add delete functionality
});
