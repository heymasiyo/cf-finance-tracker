import type { MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";

import { deleteSessionByToken, getUserIdByToken } from "@/db/queries/auth";
import type { Context, Session } from "@/lib/types";
import { isEmpty, verifyToken } from "@/lib/utils";

export const withProtectedAuth: MiddlewareHandler<Context> = async (
  c,
  next
) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader) {
    throw new HTTPException(401, { message: "Authorization header required" });
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer") {
    throw new HTTPException(401, { message: "Invalid authorization scheme" });
  }
  if (!token) {
    throw new HTTPException(401, { message: "Token required" });
  }

  const db = c.get("db");

  const userSession = await verifyToken(c, token);
  if (isEmpty(userSession)) {
    await deleteSessionByToken(db, token);

    throw new HTTPException(401, {
      message: "Invalid or expired access token"
    });
  }

  const user = await getUserIdByToken(db, token);
  if (isEmpty(user)) {
    throw new HTTPException(401, {
      message: "User not found"
    });
  }

  const session: Session = {
    userId: user.userId,
    token
  };
  c.set("session", session);

  await next();
};
