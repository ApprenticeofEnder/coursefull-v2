import { createClient } from "redis";

import { env } from "~/env";
import { getLogger } from "~/server/logger";

const logger = getLogger();
const redisClient = createClient({ url: env.CACHE_URL });
redisClient.on("error", (err) => {
  logger.withError(err).error("Error in Redis client.");
});

// wtf why is this allowed to have an await here
await redisClient.connect();

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
