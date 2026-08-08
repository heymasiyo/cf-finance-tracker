import { Hono } from "hono";

import { coreRouter } from "@/routers/core";

const app = new Hono();

app.route("/v1/core", coreRouter);

export const routers = app;
