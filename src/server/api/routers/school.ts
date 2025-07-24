import { and, asc, eq, ilike } from "drizzle-orm";
import { z } from "zod";

import { getPaginationOffset } from "~/lib/common";
import { getLogger } from "~/lib/logger";
import { createTRPCRouter, procedureFactory } from "~/server/api/trpc";
import { schools } from "~/server/db/schema";

const { publicProcedure, protectedProcedure } = procedureFactory("schools");

export const schoolRouter = createTRPCRouter({
  search: publicProcedure
    .input(
      z.object({
        limit: z.number().gte(10).lte(100).catch(25),
        page: z.number().gte(1).catch(1),
        name: z.string().optional(),
        alphaTwoCode: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(schools)
        .where(
          and(
            input.name ? ilike(schools.name, `%${input.name}%`) : undefined,
            input.alphaTwoCode
              ? eq(schools.alphaTwoCode, input.alphaTwoCode)
              : undefined,
          ),
        )
        .orderBy(asc(schools.name))
        .limit(input.limit)
        .offset(getPaginationOffset(input.page, input.limit));
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const logger = getLogger();
    const result = await ctx.db
      .select()
      .from(schools)
      .orderBy(asc(schools.name));
    logger.withMetadata({ result }).debug("Schools retrieved.");
    return result;
  }),
});
