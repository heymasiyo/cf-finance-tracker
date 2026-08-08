import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";

import { routers } from "@/routers";

const app = new Hono();

app.use(logger());
app.use(
  secureHeaders({
    crossOriginResourcePolicy: "cross-origin"
  })
);

app.use(
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Authorization", "Content-Type", "User-Agent"],
    exposeHeaders: [
      "Content-Length",
      "Content-Type",
      "Cache-Control",
      "Cross-Origin-Resource-Policy",
      "Server-Timing"
    ],
    maxAge: 86400
  })
);

app.use("*", async (c, next) => {
  const start = performance.now();
  await next();
  const duration = (performance.now() - start).toFixed(2);

  c.res.headers.append("Server-Timing", `app;dur=${duration}`);
  c.res.headers.append("X-Server-Timestamp", Date.now().toString());
});

app.get("/favicon.ico", (c) => c.body(null, 204));
app.get("/robots.txt", (c) => c.body(null, 204));

app.use(prettyJSON());

app.get("/health", (c) => {
  return c.json(
    {
      message: "OK"
    },
    200
  );
});

app.route("/", routers);

app.notFound((c) => {
  return c.json(
    {
      message: "Not Found"
    },
    404
  );
});

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    console.error(err);

    return c.json(
      {
        message: err.message
      },
      err.status
    );
  }

  console.error(err);

  return c.json(
    {
      message: "Internal Server Error"
    },
    500
  );
});

export default app;
