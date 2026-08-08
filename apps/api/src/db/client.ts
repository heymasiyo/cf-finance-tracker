import { drizzle } from "drizzle-orm/d1";
import type { Context as HonoContext } from "hono";
import type { Context } from "@/lib/types";
import * as schema from "@/db/schema";

export function connectDB(c: HonoContext<Context>) {
  const pool = c.env.DB;
  const db = drizzle(pool, {
    schema,
    casing: "snake_case"
  });

  return db;
}

export type Database = ReturnType<typeof connectDB>;
