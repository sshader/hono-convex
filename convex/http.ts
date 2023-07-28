import { Hono } from "hono";
import { logger } from "hono/logger";
import stripAnsi from "strip-ansi";
import { HonoWithConvex, HttpRouterWithHono } from "./lib/honoWithConvex";
import { cors } from "hono/cors";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { internal } from "./_generated/api";

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

// Set up CORS as middleware
app.use("/api/*", cors());

// This endpoint should be accessible from the browser.
const apiRouter = app.basePath("/api");

// Nested as `/api/listMessages
apiRouter.get("/listMessages", async (c) => {
  // Running a Convex query
  const messages = await c.env.runQuery(internal.messages.listAll);

  // Helpers for pretty JSON!
  c.pretty(true, 2);
  return c.json(messages);
});

apiRouter.get("/listMessages/:userId{[0-9]+}", async (c) => {
  // Extracting a token from the URL!
  const userId = c.req.param("userId");

  // Running a Convex query
  const messages = await c.env.runQuery(internal.messages.listByAuthor, {
    authorNumber: userId,
  });

  // Helpers for pretty JSON!
  c.pretty(true, 2);
  return c.json(messages);
});

apiRouter.post(
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
    await c.env.runMutation(internal.messages.send, { body, author });
    return c.text("Sent message!");
  }
);

export default new HttpRouterWithHono(app);
