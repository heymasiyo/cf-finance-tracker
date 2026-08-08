import type { MiddlewareHandler } from "hono";

import { connectDB } from "@/db/client";
import type { Context } from "@/lib/types";

export const withDatabase: MiddlewareHandler<Context> = async (c, next) => {
  const db = connectDB(c);
  c.set("db", db);

  await next();
};
