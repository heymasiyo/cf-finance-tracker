import type { MiddlewareHandler } from "hono";

import { withDatabase } from "@/middleware/db";
import { withRequestInfo } from "@/middleware/request-info";

export const publicMiddleware: MiddlewareHandler[] = [
  withRequestInfo,
  withDatabase
];
