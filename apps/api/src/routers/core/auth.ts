import { signUpEmailSchema, signInEmailSchema } from "@repo/schemas";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { sign } from "hono/jwt";

import {
  isEmailExists,
  createUser,
  getUserByEmail,
  createSession
} from "@/db/queries/auth";
import { Context } from "@/lib/types";
import { encrypt, isEmpty, decrypt } from "@/lib/utils";
import { basicMiddleware } from "@/middleware";
import { sValidator } from "@/middleware/standard-validator";

const app = new Hono<Context>();

app.use("/sign-up/email", ...basicMiddleware);
app.post("/sign-up/email", sValidator("json", signUpEmailSchema), async (c) => {
  const db = c.get("db");
  const body = c.req.valid("json");

  const emailExists = await isEmailExists(db, body.email);
  if (emailExists) {
    throw new HTTPException(400, {
      message: "Email is already in use"
    });
  }

  const password = await encrypt(body.password, c.env.SECRET_KEY);
  await createUser(db, {
    name: body.name,
    email: body.email,
    emailVerified: false,
    password
  });

  return c.json(
    {
      message: "Account created successfully"
    },
    201
  );
});

app.use("/sign-in/email", ...basicMiddleware);
app.post("/sign-in/email", sValidator("json", signInEmailSchema), async (c) => {
  const db = c.get("db");
  const body = c.req.valid("json");

  const user = await getUserByEmail(db, body.email);
  if (isEmpty(user)) {
    throw new HTTPException(400, {
      message: "Invalid email or password"
    });
  }

  const decryptPassword = await decrypt(user.password, c.env.SECRET_KEY);
  if (body.password !== decryptPassword) {
    throw new HTTPException(400, {
      message: "Invalid email or password"
    });
  }

  const timestampToken = Math.floor(Date.now() / 1000);
  const tokenAt = timestampToken + 30 * 24 * 60 * 60;
  const tokenExpiresAt = new Date(tokenAt * 1000);

  const token = await sign(
    {
      exp: tokenAt,
      nbf: timestampToken,
      iat: timestampToken,
      iss: c.env.API_URL,
      aud: user.id.toString()
    },
    c.env.SECRET_KEY
  );

  await createSession(db, {
    userId: user.id,
    token,
    expiresAt: tokenExpiresAt,
    ipAddress: c.get("clientIp"),
    userAgent: c.get("userAgent")
  });

  return c.json(
    {
      message: "Sign in successfull",
      data: {
        token,
        tokenExpiresAt,
        tokenType: "Bearer"
      }
    },
    200
  );
});

export const authRouter = app;
