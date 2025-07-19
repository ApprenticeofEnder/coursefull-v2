import { z } from "zod";

import { log } from "~/lib/logger";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

log.withContext({ module: "post-router" });

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      log.debug("Received input.");
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getSecretMessage: protectedProcedure.query(() => {
    log.debug("Secret message obtained.");
    return "you can now see this secret message!";
  }),
});
