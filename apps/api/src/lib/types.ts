import type { Database } from "@/db/client";

export type Context = {
  Variables: {
    db: Database;
    clientIp?: string;
    userAgent?: string;
  };
  Bindings: {
    DB: D1Database;
  };
};
