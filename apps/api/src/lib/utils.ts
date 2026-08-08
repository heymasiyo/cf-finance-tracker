import type { Context as HonoContext } from "hono";

import type { Context } from "@/lib/types";

export function getRequestInfo(c: HonoContext<Context>) {
  const clientIp =
    c.req.header("cf-connecting-ip") ||
    c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ||
    c.req.header("x-real-ip") ||
    "unknown";

  const userAgent = c.req.header("user-agent") ?? "unknown";

  return {
    clientIp,
    userAgent
  };
}
