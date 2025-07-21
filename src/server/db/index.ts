import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { env } from "~/env";

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
