import { z } from "zod";

// import { log } from "~/lib/logger";
import { createTRPCRouter, procedureFactory } from "~/server/api/trpc";

const { publicProcedure, protectedProcedure } = procedureFactory("posts");

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input, ctx }) => {
      ctx.logger.warn("Received input.");
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getSecretMessage: protectedProcedure.query(({ ctx }) => {
    ctx.logger.debug("Secret message obtained.");
    return "you can now see this secret message!";
  }),
});
