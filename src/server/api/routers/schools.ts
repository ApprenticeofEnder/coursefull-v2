import { asc } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, procedureFactory } from "~/server/api/trpc";
import { schools } from "~/server/db/schema";

const { publicProcedure, protectedProcedure } = procedureFactory("schools");

export const schoolRouter = createTRPCRouter({
  getPage: publicProcedure
    .input(
      z.object({
        limit: z.number().catch(25),
        page: z.number().catch(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(schools)
        .orderBy(asc(schools.name))
        .limit(input.limit)
        .offset((input.page - 1) * input.limit);
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(schools).orderBy(asc(schools.name));
  }),
});
