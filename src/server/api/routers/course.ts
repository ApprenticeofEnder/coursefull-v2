import { asc } from "drizzle-orm";
import { z } from "zod";

import { getPaginationOffset } from "~/lib/common";
import { createTRPCRouter, procedureFactory } from "~/server/api/trpc";
import { createCourse } from "~/server/db";
import { courses, userCourses, userRole } from "~/server/db/schema";

const { publicProcedure, protectedProcedure } = procedureFactory("semesters");

export const courseRouter = createTRPCRouter({
  getPage: publicProcedure
    .input(
      z.object({
        limit: z.number().gte(10).catch(25),
        page: z.number().gte(1).catch(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(courses)
        .orderBy(asc(courses.shortCode))
        .limit(input.limit)
        .offset(getPaginationOffset(input.page, input.limit));
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(courses).orderBy(asc(courses.shortCode));
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
        goal: z.number().gt(0).lte(100),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const userId = ctx.session.user.id;
        // TODO: add update procedures
      });
    }),

  generateDeliverables: protectedProcedure
    .input(z.object({}))
    .mutation(async ({ ctx, input }) => {
      // This might work best with an async task queue
      // TODO: Look into integrating Bull and some kind of Redis cache
      // Might also be useful for DB caching
    }),

  // TODO: Add delete functionality
});
