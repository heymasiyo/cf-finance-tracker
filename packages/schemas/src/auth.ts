import * as v from "valibot";

import { nameSchema, emailSchema, passwordSchema } from "./common";

export const signUpEmailSchema = v.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema
});

export const signInEmailSchema = v.object({
  email: emailSchema,
  password: passwordSchema
});
