import { eq } from "drizzle-orm";

import type { Database } from "@/db/client";
import { user, session } from "@/db/schema";

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

export async function getUserByEmail(db: Database, email: string) {
  const [result] = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      password: user.password
    })
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  return result;
}

export type CreateSessionParams = {
  userId: number;
  token: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
};
export async function createSession(db: Database, params: CreateSessionParams) {
  const [result] = await db
    .insert(session)
    .values({
      userId: params.userId,
      token: params.token,
      expiresAt: params.expiresAt,
      ipAddress: params.ipAddress ?? "",
      userAgent: params.userAgent ?? "",
      createdAt: datetime
    })
    .returning();

  return result;
}
