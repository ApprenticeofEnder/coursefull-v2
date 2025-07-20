import { z } from "zod";

import { log } from "~/lib/logger";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { users } from "~/server/db/schema";

// TODO: Figure out what to even put in here
export const userRouter = createTRPCRouter({});
