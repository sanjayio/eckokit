import { j } from "./__internals/j";
import { HTTPException } from "hono/http-exception";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "hono/adapter";
import * as schema from "@/drizzle/schema";
import { user } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth/auth";
import { getDbConfig } from "@/drizzle/db";

// Create pool once at module level
let pool: Pool | null = null;
const getPool = (connectionString: string) => {
  if (!pool) {
    pool = new Pool(getDbConfig(connectionString));
  }
  return pool;
};

const extendedDatabaseMiddleware = j.middleware(async ({ c, next }) => {
  const variables = env(c);

  const pool = getPool(variables.DATABASE_URL);

  const db = drizzle(pool, { schema });

  // Whatever you put inside of `next` is accessible to all following middlewares
  return await next({ db });
});

const authMiddleware = j.middleware(async ({ c, ctx, next }) => {
  const sessionData = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!sessionData?.user) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  // Get user from database using the session's userId
  // ctx.db is available from the extendedDatabaseMiddleware
  const db = (ctx as { db: ReturnType<typeof drizzle> }).db;
  const userRecord = await db
    .select()
    .from(user)
    .where(eq(user.id, sessionData.user.id))
    .limit(1);

  if (userRecord.length === 0) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  return next({ user: userRecord[0] });
});

/**
 * Public (unauthenticated) procedures
 *
 * This is the base piece you use to build new queries and mutations on your API.
 */
export const baseProcedure = j.procedure;
export const publicProcedure = baseProcedure.use(extendedDatabaseMiddleware);
export const privateProcedure = publicProcedure.use(authMiddleware);
