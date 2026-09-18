import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"
import { getDatabaseUrl } from "./connection"

export const pool = new Pool({
  connectionString: getDatabaseUrl(),
  max: 5,
  idleTimeoutMillis: 20_000,
  connectionTimeoutMillis: 10_000,
})

export const db = drizzle(pool, { schema })
