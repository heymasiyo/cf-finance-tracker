import type { MiddlewareHandler } from "hono";

import { withBasicAuth } from "@/middleware/basic-auth";
import { withDatabase } from "@/middleware/db";
import { withProtectedAuth } from "@/middleware/protected-auth";
import {
  withBasicRateLimiter,
  withProtectedRateLimiter
} from "@/middleware/rate-limiter";
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

export const protectedMiddleware: MiddlewareHandler[] = [
  withRequestInfo,
  withDatabase,
  withProtectedAuth,
  withProtectedRateLimiter
];
