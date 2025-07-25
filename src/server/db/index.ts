import { getTableName } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { type PgSelect, type PgTable } from "drizzle-orm/pg-core";
import { Pool } from "pg";

import { env } from "~/env";
import {
  deleteValue,
  getValue,
  setPersistentValue,
  setValue,
} from "~/server/cache";

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

export function constructTableDiscriminantId(
  internalId: number,
  table: PgTable,
): string {
  return `${getTableName(table)}_${internalId}`;
}

/**
 * Deconstructs a table discriminant and returns the internal database ID.
 */
export function deconstructTableDiscriminantId(
  tableDiscriminantId: string,
  table: PgTable,
): number {
  let internalIdString = tableDiscriminantId
    .replace(getTableName(table), "")
    .replace("_", "");

  return parseInt(internalIdString);
}

export async function publicToInternalId(
  publicId: string,
  table: PgTable,
): Promise<number | null> {
  const tableDiscriminantId = await getValue(publicId);
  if (!tableDiscriminantId) {
    return null;
  }

  const internalId = deconstructTableDiscriminantId(tableDiscriminantId, table);

  return internalId;
}

export async function cachePublicId(
  publicId: string,
  internalId: number,
  table: PgTable,
): Promise<void> {
  const tableDiscriminantId = constructTableDiscriminantId(internalId, table);
  await Promise.all([
    setPersistentValue(publicId, tableDiscriminantId),
    setPersistentValue(tableDiscriminantId, publicId),
  ]);
}

export async function invalidatePublicId(
  publicId: string,
  internalId: number,
  table: PgTable,
): Promise<void> {
  const tableDiscriminantId = constructTableDiscriminantId(internalId, table);
  await Promise.all([deleteValue(publicId), deleteValue(tableDiscriminantId)]);
}

export async function internalToPublicId(
  internalId: number,
  table: PgTable,
): Promise<string | null> {
  const tableDiscriminantId = constructTableDiscriminantId(internalId, table);
  const publicId = await getValue(tableDiscriminantId);
  return publicId;
}
