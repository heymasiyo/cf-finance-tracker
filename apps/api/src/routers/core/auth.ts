import { signUpEmailSchema } from "@repo/schemas";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

import { isEmailExists, createUser } from "@/db/queries/auth";
import { Context } from "@/lib/types";
import { encrypt, isEmpty } from "@/lib/utils";
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
  const user = await createUser(db, {
    name: body.name,
    email: body.email,
    emailVerified: false,
    password
  });
  if (isEmpty(user)) {
    throw new HTTPException(400, {
      message: "Failed to create account. Please check your data and try again"
    });
  }

  return c.json(
    {
      message: "Account created successfully"
    },
    201
  );
});

export const authRouter = app;
