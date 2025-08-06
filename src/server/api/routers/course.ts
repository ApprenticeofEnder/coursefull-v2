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
  userRole,
} from "~/server/db/schema";

const { publicProcedure, protectedProcedure } = procedureFactory("semesters");

export const courseRouter = createTRPCRouter({
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
      });
    }),

  acceptInviteLink: protectedProcedure
    .input(
      z.object({
        inviteId: z.string().refine(isCuid),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const invite = await ctx.db.query.courseInvites.findFirst({
        where: eq(courseInvites.id, input.inviteId),
      });

      // Check for both existence and expiry.
      if (!invite || invite.validUntil < new Date()) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Sorry, that invite link is invalid.",
        });
      }

      // Then add the user to the course
      // We do need to grab the goal from the semester though
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

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        shortCode: z.string(),
        semester: z.string(),
        public: z.boolean(),
        role: z.enum(userRole.enumValues),
        goal: z.number().gt(0).lte(100),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      await createCourse({
        ...input,
        semesterId: input.semester,
        createdBy: userId,
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

  // TODO: Update enrolment, etc.

  generateDeliverables: protectedProcedure
    .input(z.object({}))
    .mutation(async ({ ctx, input }) => {
      // This might work best with an async task queue
      // TODO: Look into integrating Bull and some kind of Redis cache
      // Might also be useful for DB caching
    }),

  // TODO: Add delete functionality
});
