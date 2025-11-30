import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";
import { notificationRouter } from "./routers/notification-router";
import { agentRouter } from "./routers/agent-router";
import { organizationRouter } from "./routers/organization-router";

const app = new Hono().basePath("/api").use(cors());

/**
 * This is the primary router for your server.
 *
 * All routers added in /server/routers should be manually added here.
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const appRouter = app
  .route("/notifications", notificationRouter)
  .route("/agents", agentRouter)
  .route("/organizations", organizationRouter);
// .route("/project", projectRouter)

// The handler Next.js uses to answer API requests
export const httpHandler = handle(app);

/**
 * (Optional)
 * Exporting our API here for easy deployment
 *
 * Run `npm run deploy` for one-click API deployment to Cloudflare's edge network
 */
export default app;

// export type definition of API
export type AppType = typeof appRouter;
