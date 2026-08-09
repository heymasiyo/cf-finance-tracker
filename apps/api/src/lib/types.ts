import type { Database } from "@/db/client";

export type Context = {
  Variables: {
    db: Database;
    session: Session;
    clientIp?: string;
    userAgent?: string;
  };
  Bindings: {
    DB: D1Database;
    BASIC_RATE_LIMITER: RateLimit;
    PROTECTED_RATE_LIMITER: RateLimit;

    API_ENV: "development" | "production";
    API_URL: string;

    BASIC_AUTH_USERNAME: string;
    BASIC_AUTH_PASSWORD: string;
    SECRET_KEY: string;
  };
};

export type Session = {
  userId: number;
  token: string;
};

export type JWTPayload = {
  exp: number;
  nbf: number;
  iat: number;
  iss: string;
  aud: string;
};
