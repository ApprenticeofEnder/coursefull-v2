import { Redis } from "ioredis";

import { env } from "~/env";
import { getLogger } from "~/server/logger";

const logger = getLogger();
const redisClient = new Redis(env.CACHE_URL);

logger.info("Redis cache connected.");

redisClient.on("error", (err) => {
  logger.withError(err).error("Error in Redis client.");
});

export const cache = redisClient;

export async function setValue(key: string, value: string): Promise<void> {
  await redisClient.set(key, value);
}

export async function setPersistentValue(
  key: string,
  value: string,
): Promise<void> {
  await redisClient.set(key, value);
  await redisClient.persist(key);
}

export async function getValue(key: string): Promise<string | null> {
  return await redisClient.get(key);
}

export async function deleteValue(key: string): Promise<void> {
  await redisClient.del(key);
}

export async function redisHealthcheck(): Promise<boolean> {
  try {
    await setValue("health", "ok");
    const reply = await getValue("health");
    return reply === "ok";
  } catch (error) {
    logger.withError(error).error("Redis health check failed.");
    return false;
  }
}
