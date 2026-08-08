import type { MiddlewareHandler } from "hono";

import { withBasicAuth } from "@/middleware/basic-auth";
import { withDatabase } from "@/middleware/db";
import { withBasicRateLimiter } from "@/middleware/rate-limiter";
import { withRequestInfo } from "@/middleware/request-info";

export const publicMiddleware: MiddlewareHandler[] = [
  withRequestInfo,
  withDatabase
];

export const basicMiddleware: MiddlewareHandler[] = [
  withRequestInfo,
  withDatabase,
  withBasicAuth,
  withBasicRateLimiter
];
