import * as v from "valibot";

export const nameSchema = v.pipe(
  v.string("Name must be a string"),
  v.trim(),
  v.nonEmpty("Name is required"),
  v.maxLength(50, "Name must not exceed 50 characters")
);

export const emailSchema = v.pipe(
  v.string("Email address must be a string"),
  v.trim(),
  v.nonEmpty("Email address is required"),
  v.email("Please enter a valid email address")
);

export const passwordSchema = v.pipe(
  v.string("Password must be a string"),
  v.nonEmpty("Password is required"),
  v.minLength(8, "Password must be at least 8 characters long"),
  v.maxLength(100, "Password must not exceed 100 characters"),
  v.regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
  v.regex(/[a-z]/, "Password must contain at least one lowercase letter"),
  v.regex(/[0-9]/, "Password must contain at least one number"),
  v.regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character"
  )
);
