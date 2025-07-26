import { drizzle } from "drizzle-orm/node-postgres";
import { type PgSelect } from "drizzle-orm/pg-core";
import { Pool } from "pg";

import { env } from "~/env";
import { cachePublicId } from "~/server/db/schema";
import { getLogger } from "~/server/logger";

import * as schema from "./schema";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

// const conn = globalForDb.conn ?? postgres(env.DATABASE_URL);
// if (env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle({ client: pool, schema });

export function withPagination<T extends PgSelect>(
  qb: T,
  page = 1,
  pageSize = 25,
) {
  return qb.limit(pageSize).offset((page - 1) * pageSize);
}

export async function createSchool(data: schema.NewSchool) {
  const logger = getLogger();
  const insertResult = await db
    .insert(schema.schools)
    .values(data)
    .onConflictDoNothing()
    .returning();

  logger
    .withMetadata({ records: insertResult.length })
    .info("School created successfully.");

  const cacheResults = await Promise.allSettled(
    insertResult.map((school) => {
      return cachePublicId(school.publicId, school.id, schema.schools);
    }),
  );
}

export async function createSchools(data: schema.NewSchool[]) {
  const logger = getLogger();
  const insertResult = await db
    .insert(schema.schools)
    .values(data)
    .onConflictDoNothing()
    .returning();

  logger
    .withMetadata({ records: insertResult.length })
    .info("Schools created successfully.");

  const cacheResults = await Promise.allSettled(
    insertResult.map((school) => {
      return cachePublicId(school.publicId, school.id, schema.schools);
    }),
  );
}
