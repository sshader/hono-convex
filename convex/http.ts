import { Hono } from "hono";
import { logger } from "hono/logger";
import stripAnsi from "strip-ansi";
import { HonoWithConvex, HttpRouterWithHono } from "./lib/honoWithConvex";
import { cors } from "hono/cors";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const app: HonoWithConvex = new Hono();

// Custom 404
app.notFound((c) => {
  return c.text("Oh no! Couldn't find a route for that", 404);
});

// Middleware!
app.use(
  "*",
  logger((...args) => {
    console.log(...args.map(stripAnsi));
  })
);

app.get("/listMessages/:userId{[0-9]+}", async (c) => {
  // Extracting a token from the URL!
  const userId = c.req.param("userId");

  // Running a Convex query
  const messages = await c.env.runQuery("listMessages:byAuthor", userId);

  // Helpers for pretty JSON!
  c.pretty(true, 2);
  return c.json(messages);
});

app.post(
  "/postMessage",
  // Body validation!
  zValidator(
    "json",
    z.object({
      author: z.string().startsWith("User "),
      body: z.string().max(100),
    })
  ),
  async (c) => {
    // With type safety!
    const { body, author } = c.req.valid("json");
    await c.env.runMutation("sendMessage", body, author);
    return c.text("Sent message!");
  }
);

// Set up CORS as middleware
app.use("/api/*", cors());

// This endpoint should be accessible from the browser.
app.get("/api/hello", (c) => {
  return c.text("hello!");
});

app.use(
  "/api2/*",
  cors({
    origin: "http://examplesite.come",
    allowHeaders: ["X-Custom-Header", "Upgrade-Insecure-Requests"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600,
    credentials: true,
  })
);

export default new HttpRouterWithHono(app);
