export type Context = {
  Variables: {
    clientIp?: string;
    userAgent?: string;
  };
  Bindings: {
    DB: D1Database;
  };
};
