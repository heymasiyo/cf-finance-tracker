import type { MiddlewareHandler } from "hono";

import type { Context } from "@/lib/types";
import { getRequestInfo } from "@/lib/utils";

export const withRequestInfo: MiddlewareHandler<Context> = async (c, next) => {
  const { clientIp, userAgent } = getRequestInfo(c);
  c.set("clientIp", clientIp);
  c.set("userAgent", userAgent);

  await next();
};
