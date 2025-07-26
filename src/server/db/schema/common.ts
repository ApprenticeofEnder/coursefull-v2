import { getTableName } from "drizzle-orm";
import { type PgTable, pgSchema } from "drizzle-orm/pg-core";
import { pgTableCreator } from "drizzle-orm/pg-core";

import { deleteValue, getValue, setPersistentValue } from "~/server/cache";

export const createTable = pgTableCreator((name) => `coursefull_${name}`);

// TODO: Create that custom schema thingy

export const coursefullSchema = pgSchema("coursefull");

export const deliverableType = coursefullSchema.enum("deliverable_type", [
  "assignment",
  "lab",
  "tutorial",
  "quiz",
  "test",
  "exam",
]);

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
