import { sValidator as sv } from "@hono/standard-validator";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import type { ValidationTargets } from "hono";
import { HTTPException } from "hono/http-exception";

import { formatValidationError } from "@/lib/utils";

export const sValidator = <
  Schema extends StandardSchemaV1,
  Target extends keyof ValidationTargets
>(
  target: Target,
  schema: Schema
) =>
  sv(target, schema, (result, _) => {
    if (!result.success) {
      throw new HTTPException(400, {
        message: formatValidationError(result.error)
      });
    }
  });
