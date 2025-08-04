import { isCuid } from "@paralleldrive/cuid2";
import { TRPCError } from "@trpc/server";
import { and, asc, eq, ilike } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, procedureFactory } from "~/server/api/trpc";
import { createSemester, withPagination } from "~/server/db";
import {
  schools,
  semesters,
  userRole,
  userSemesters,
} from "~/server/db/schema";

const { publicProcedure, protectedProcedure } = procedureFactory("semesters");

export const semesterRouter = createTRPCRouter({
  enroll: protectedProcedure
    .input(
      z.object({
        role: z.enum(userRole.enumValues),
        semester: z.string().refine((val) => isCuid(val)),
        goal: z.number().refine((val) => val > 0 && val <= 100),
        // TODO: Is the goal necessary to be non-null for faculty?
        // TODO: Add some form of verification (maybe school email?)
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // TODO: Reject on attempts to join as faculty without a verified academic email?

      if (input.role == "faculty") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "Sorry, we can't enroll you as faculty at the moment. Please contact us at support@coursefull.app from your academic email, and we'll take it from there.",
        });
      }

      const enrolledSemesters = await ctx.db
        .select()
        .from(userSemesters)
        .where(
          and(
            eq(userSemesters.semesterId, input.semester),
            eq(userSemesters.userId, userId),
            eq(userSemesters.role, input.role),
          ),
        );

      if (enrolledSemesters.length) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `You are already enrolled in that semester as a(n) ${input.role}!`,
        });
      }

      if (input.role == "student_owner") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "Sorry, student owners of semesters can't enroll in semesters, only create them.",
        });
      }
      await ctx.db.insert(userSemesters).values({
        ...input,
        userId,
        semesterId: input.semester,
      });
    }),

  unenroll: protectedProcedure
    .input(
      z.object({
        semester: z.string().refine((val) => isCuid(val)),
        role: z.enum(userRole.enumValues),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const isEnrolledCondition = and(
        eq(userSemesters.semesterId, input.semester),
        eq(userSemesters.userId, userId),
        eq(userSemesters.role, input.role),
      );

      const enrolledSemesters = await ctx.db
        .select()
        .from(userSemesters)
        .where(isEnrolledCondition);

      if (!enrolledSemesters.length) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `You are not enrolled in that semester as a(n) ${input.role}!`,
        });
      }

      await ctx.db.delete(userSemesters).where(isEnrolledCondition);
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
      const baseQuery = ctx.db
        .select()
        .from(semesters)
        .innerJoin(schools, eq(schools.id, semesters.schoolId))
        .where(
          and(
            input.school ? eq(semesters.schoolId, input.school) : undefined,
            input.schoolName
              ? ilike(schools.name, `%${input.schoolName}%`)
              : undefined,
            input.name ? ilike(semesters.name, `%${input.name}%`) : undefined,
          ),
        )
        .orderBy(asc(semesters.startsAt))
        .$withCache();
      const [allSemesters, semesterPage] = await Promise.all([
        baseQuery,
        withPagination(baseQuery.$dynamic(), input.page, input.limit),
      ]);
      const pages = Math.ceil(allSemesters.length / input.limit);
      const result = {
        semesters: semesterPage,
        pages,
      };
      return result;
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(semesters)
      .orderBy(asc(semesters.startsAt))
      .$withCache();
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
        semester: z.string().refine((val) => isCuid(val)),
        public: z.boolean(),
        // role: z.enum(userRole.enumValues), TODO: Figure out whether roles will play a role here
        startsAt: z.date(),
        endsAt: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const userId = ctx.session.user.id;

        const semester = await ctx.db.query.semesters.findFirst({
          where: and(
            eq(semesters.id, input.semester),
            eq(semesters.createdBy, userId),
          ),
        });

        if (!semester) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: `Sorry, we couldn't update that semester. Please ask the creator to make any changes.`,
          });
        }

        await ctx.db
          .update(semesters)
          .set({
            ...input,
          })
          .where(eq(semesters.id, semester.id));
      });
    }),

  updateEnrolment: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        semester: z.string().refine((val) => isCuid(val)),
        public: z.boolean(),
        role: z.enum(userRole.enumValues),
        goal: z.number().gt(0).lte(100),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const userId = ctx.session.user.id;

        const enrolmentToUpdate = await ctx.db.query.userSemesters.findFirst({
          where: and(
            eq(userSemesters.semesterId, input.semester),
            eq(userSemesters.userId, userId),
            eq(userSemesters.role, input.role),
          ),
        });

        if (!enrolmentToUpdate) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: `Sorry, we couldn't update your enrolment in that semester. Please contact the creator to request changes.`,
          });
        }

        await ctx.db
          .update(userSemesters)
          .set({
            ...input,
          })
          .where(
            and(
              eq(userSemesters.userId, enrolmentToUpdate.userId),
              eq(userSemesters.semesterId, enrolmentToUpdate.semesterId),
            ),
          );
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        semester: z.string().refine((val) => isCuid(val)),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return;
    }),

  // TODO: Add delete functionality
});
