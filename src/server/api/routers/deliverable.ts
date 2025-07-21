import { asc } from "drizzle-orm";
import { z } from "zod";

import { getPaginationOffset } from "~/lib/common";
import { createTRPCRouter, procedureFactory } from "~/server/api/trpc";
import {
  deliverables,
  semesters,
  studentDeliverables,
} from "~/server/db/schema";

const { publicProcedure, protectedProcedure } = procedureFactory("semesters");

export const deliverableRouter = createTRPCRouter({
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
        .from(deliverables)
        .orderBy(asc(deliverables.name))
        .limit(input.limit)
        .offset(getPaginationOffset(input.page, input.limit));
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(deliverables)
      .orderBy(asc(deliverables.name));
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        courseId: z.number(), // TODO: Add that cache layer to convert public IDs and internal ones
        public: z.boolean(),
        weight: z.number().gt(0).lte(100),
        mark: z.number().gte(0).lte(100).optional(),
        complete: z.boolean(),
        role: z.string(),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const userId = ctx.session.user.id;
        // TODO: Update marks and goals on update
        // Do we need a dedicated function for that?
        const deliverableInsert = await tx
          .insert(deliverables)
          .values({
            createdBy: userId,
            ...input,
          })
          .returning({ id: semesters.id });
        if (!deliverableInsert[0]?.id) {
          return Promise.reject("Semester insertion failed.");
        }
        const deliverableId = deliverableInsert[0]?.id;
        await tx.insert(studentDeliverables).values({
          userId,
          deliverableId,
          ...input,
        });
        ctx.logger
          .withMetadata({
            userId,
            deliverableId,
          })
          .debug("Deliverable created.");
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        deliverableId: z.number(), // TODO: Add that cache layer to convert public IDs and internal ones
        public: z.boolean(),
        goal: z.number().gt(0).lte(100),
        mark: z.number().gte(0).lte(100).optional(),
        notes: z.string().optional(),
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
