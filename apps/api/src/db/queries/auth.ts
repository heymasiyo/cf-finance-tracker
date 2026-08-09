import { eq } from "drizzle-orm";

import type { Database } from "@/db/client";
import { user } from "@/db/schema";

const datetime = new Date();

export async function isEmailExists(db: Database, email: string) {
  const existingUser = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  return existingUser.length > 0;
}

export type CreateUserParams = {
  name: string;
  email: string;
  emailVerified: boolean;
  password: string;
  image?: string;
};
export async function createUser(db: Database, params: CreateUserParams) {
  const [result] = await db
    .insert(user)
    .values({
      name: params.name,
      email: params.email,
      emailVerified: params.emailVerified,
      password: params.password,
      image: params.image ?? "",
      createdAt: datetime,
      updatedAt: datetime
    })
    .returning();

  return result;
}
