import { and, asc, eq, ilike } from "drizzle-orm";
import { z } from "zod";

import { getPaginationOffset } from "~/lib/common";
import { getLogger } from "~/lib/logger";
import { createTRPCRouter, procedureFactory } from "~/server/api/trpc";
import { withPagination } from "~/server/db";
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
      // TODO: Work out pagination, see if there's a way of retrieving the number of remaining pages

      const baseQuery = ctx.db
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
        .orderBy(asc(schools.name));
      const allSchools = await baseQuery;
      const paginatedQuery = withPagination(
        baseQuery.$dynamic(),
        input.page,
        input.limit,
      );
      const schoolPage = await paginatedQuery;
      const pages = Math.ceil(allSchools.length / input.limit);
      const result = {
        schools: schoolPage,
        pages,
      };
      return result;
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
