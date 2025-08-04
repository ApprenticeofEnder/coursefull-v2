import { isCuid } from "@paralleldrive/cuid2";
import { TRPCError } from "@trpc/server";
import { and, asc, eq, ilike } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, procedureFactory } from "~/server/api/trpc";
import { withPagination } from "~/server/db";
import { schools, usersInSchools } from "~/server/db/schema";
import { getLogger } from "~/server/logger";

const { publicProcedure, protectedProcedure } = procedureFactory("schools");

export const schoolRouter = createTRPCRouter({
  enroll: protectedProcedure
    .input(
      z.object({
        school: z.string().refine((val) => isCuid(val)),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // This checks if the user is already enrolled in a school
      // The join is to make sure the school exists
      const enrolledSchools = await ctx.db
        .select()
        .from(usersInSchools)
        .where(
          and(
            eq(usersInSchools.schoolId, input.school),
            eq(usersInSchools.userId, userId),
          ),
        );

      if (enrolledSchools.length) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are already enrolled in that school!",
        });
      }
      await ctx.db.insert(usersInSchools).values({
        userId,
        schoolId: input.school,
      });
    }),

  unenroll: protectedProcedure
    .input(
      z.object({
        school: z.string().refine((val) => isCuid(val)),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const isEnrolledCondition = and(
        eq(usersInSchools.userId, userId),
        eq(usersInSchools.schoolId, input.school),
      );
      const enrolledSchools = await ctx.db
        .select()
        .from(usersInSchools)
        .where(isEnrolledCondition);

      if (!enrolledSchools.length) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not enrolled in that school!",
        });
      }

      await ctx.db.delete(usersInSchools).where(isEnrolledCondition);
    }),

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
        .orderBy(asc(schools.name))
        .$withCache();
      const [allSchools, schoolPage] = await Promise.all([
        baseQuery,
        withPagination(baseQuery.$dynamic(), input.page, input.limit),
      ]);
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
      .orderBy(asc(schools.name))
      .$withCache();
    logger.withMetadata({ schools: result.length }).debug("Schools retrieved.");
    return result;
  }),
});
