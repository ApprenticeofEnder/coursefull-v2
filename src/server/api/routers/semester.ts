import { isCuid } from "@paralleldrive/cuid2";
import { asc } from "drizzle-orm";
import { z } from "zod";

import { getPaginationOffset } from "~/lib/common";
import { createTRPCRouter, procedureFactory } from "~/server/api/trpc";
import { createSemester } from "~/server/db";
import { semesters, userRole, userSemesters } from "~/server/db/schema";

const { publicProcedure, protectedProcedure } = procedureFactory("semesters");

export const semesterRouter = createTRPCRouter({
  enroll: protectedProcedure
    .input(
      z.object({
        role: z.enum(userRole.enumValues),
        semester: z.string().refine((val) => isCuid(val)),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const enrolledSemesters = await ctx.db.select().from(userSemesters);
    }),

  search: publicProcedure
    .input(
      z.object({
        limit: z.number().gte(10).catch(25),
        page: z.number().gte(1).catch(1),
        school: z
          .string()
          .optional()
          .refine((val) => !!val && isCuid(val)),
        schoolName: z.string().optional(),
        name: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.select().from(semesters);
    }),

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
        .from(semesters)
        .orderBy(asc(semesters.startsAt))
        .limit(input.limit)
        .offset(getPaginationOffset(input.page, input.limit));
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(semesters)
      .orderBy(asc(semesters.startsAt));
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        school: z.string(),
        public: z.boolean(),
        role: z.enum(userRole.enumValues),
        startsAt: z.date(),
        endsAt: z.date(),
        goal: z.number().gt(0).lte(100),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      await createSemester({
        ...input,
        schoolId: input.school,
        createdBy: userId,
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        school: z.string().refine((val) => !!val && isCuid(val)),
        public: z.boolean(),
        role: z.string(),
        startsAt: z.date(),
        endsAt: z.date(),
        goal: z.number().gt(0).lte(100),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const userId = ctx.session.user.id;
        // TODO: add update procedures
      });
    }),

  // TODO: Add delete functionality
});
