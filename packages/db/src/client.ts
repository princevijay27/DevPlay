import "dotenv/config";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema/index.js";

const connectionString =
  process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/devflow";

export const sql = postgres(connectionString, {
  max: 10,
  prepare: false
});

export const db = drizzle(sql, { schema });
