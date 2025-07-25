import { asc } from "drizzle-orm";
import { z } from "zod";

import { getPaginationOffset } from "~/lib/common";
import { createTRPCRouter, procedureFactory } from "~/server/api/trpc";
import { courses, userCourses } from "~/server/db/schema";

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
        semesterId: z.number(), // TODO: Add that cache layer to convert public IDs and internal ones
        public: z.boolean(),
        role: z.string(),
        goal: z.number().gt(0).lte(100),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const userId = ctx.session.user.id;
        const courseInsert = await tx
          .insert(courses)
          .values({
            createdBy: userId,
            ...input,
          })
          .returning({ id: courses.id });
        if (!courseInsert[0]?.id) {
          return Promise.reject("Semester insertion failed.");
        }
        const courseId = courseInsert[0]?.id;
        await tx.insert(userCourses).values({
          goal: input.goal,
          role: input.role,
          userId,
          courseId,
        });
        ctx.logger
          .withMetadata({
            userId,
            courseId,
          })
          .debug("Course created.");
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
