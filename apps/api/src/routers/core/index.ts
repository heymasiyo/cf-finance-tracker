import { Hono } from "hono";

import { authRouter } from "@/routers/core/auth";

const app = new Hono();

app.route("/auth", authRouter);

export const coreRouter = app;
