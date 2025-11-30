import { drizzle } from "drizzle-orm/node-postgres";
import { Pool, PoolConfig } from "pg";
import * as schema from "@/drizzle/schema";

// Parse DATABASE_URL and configure SSL options using the same logic as drizzle.config.ts
const getDbConfig = (url: string): PoolConfig => {
  const databaseUrl =
    url ||
    (() => {
      throw new Error("DATABASE_URL environment variable is required");
    })();

  // Try to parse the URL
  try {
    const dbUrl = new URL(databaseUrl);
    const sslMode = dbUrl.searchParams.get("sslmode");

    // Strip sslmode from URL so pg doesn't override our explicit ssl setting
    dbUrl.searchParams.delete("sslmode");

    // Configure SSL based on sslmode parameter (same logic as drizzle.config.ts)
    // But strip sslmode from connection string so our explicit config is authoritative
    let ssl: boolean | { rejectUnauthorized: boolean } = false;

    if (sslMode === "require") {
      ssl =
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: true }
          : { rejectUnauthorized: false };
    }

    return {
      connectionString: dbUrl.toString(),
      ssl,
    };
  } catch {
    // If URL parsing fails, manually strip sslmode from the connection string
    // Check if sslmode=require is present in the string
    const hasSslRequire = databaseUrl.includes("sslmode=require");

    // Remove sslmode parameter from URL
    let cleanedUrl = databaseUrl.replace(/[?&]sslmode=[^&]*/g, "");
    // Clean up any malformed query strings
    cleanedUrl = cleanedUrl
      .replace(/\?&+/, "?")
      .replace(/&+$/, "")
      .replace(/\?$/, "");

    return {
      connectionString: cleanedUrl,
      ssl: hasSslRequire
        ? process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: true }
          : { rejectUnauthorized: false }
        : false,
    };
  }
};

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is required");
}

const pool = new Pool(getDbConfig(databaseUrl));

export const db = drizzle(pool, { schema });

// Export getDbConfig for use in procedures.ts
export { getDbConfig };
