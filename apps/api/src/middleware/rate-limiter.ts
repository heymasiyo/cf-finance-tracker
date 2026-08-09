import type { MiddlewareHandler } from "hono";
import { rateLimiter } from "hono-rate-limiter";

import type { Context } from "@/lib/types";

const basicLimiter = rateLimiter<Context>({
  binding: (c) => c.env.BASIC_RATE_LIMITER,
  keyGenerator: (c) => {
    return c.get("clientIp") as string;
  },
  message: "Too many requests. Please try again later",
  statusCode: 429
});
export const withBasicRateLimiter: MiddlewareHandler<Context> = async (
  c,
  next
) => {
  return basicLimiter(c, next);
};

const protectedLimiter = rateLimiter<Context>({
  binding: (c) => c.env.PROTECTED_RATE_LIMITER,
  keyGenerator: (c) => {
    return c.get("session").userId.toString() ?? (c.get("clientIp") as string);
  },
  message: "Too many requests. Please try again later",
  statusCode: 429
});
export const withProtectedRateLimiter: MiddlewareHandler<Context> = async (
  c,
  next
) => {
  return protectedLimiter(c, next);
};
