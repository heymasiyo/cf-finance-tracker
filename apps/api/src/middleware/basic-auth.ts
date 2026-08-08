import type { MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";

import type { Context } from "@/lib/types";

export const withBasicAuth: MiddlewareHandler<Context> = async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader) {
    throw new HTTPException(401, { message: "Authorization header required" });
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Basic") {
    throw new HTTPException(401, { message: "Invalid authorization scheme" });
  }
  if (!token) {
    throw new HTTPException(401, { message: "Token required" });
  }

  const basicEncode = btoa(
    `${c.env.BASIC_AUTH_USERNAME}:${c.env.BASIC_AUTH_PASSWORD}`
  );
  if (token !== basicEncode) {
    throw new HTTPException(401, { message: "Invalid token" });
  }

  await next();
};
