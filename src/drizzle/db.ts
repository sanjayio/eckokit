import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@/drizzle/schema";

// Parse DATABASE_URL and configure SSL options
const getDbConfig = () => {
  const url = process.env.DATABASE_URL!;

  try {
    const dbUrl = new URL(url);
    const sslMode = dbUrl.searchParams.get("sslmode");

    // Configure SSL based on sslmode parameter
    let ssl: boolean | { rejectUnauthorized: boolean } = false;

    if (sslMode === "require" || sslMode === "prefer") {
      // In production, verify certificates; in development, allow self-signed
      ssl =
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: true }
          : { rejectUnauthorized: false };
    }

    return {
      connectionString: url,
      ssl,
    };
  } catch {
    // If URL parsing fails, use connection string directly
    // and check if it contains SSL parameters
    const hasSslMode =
      url.includes("sslmode=require") || url.includes("sslmode=prefer");
    return {
      connectionString: url,
      ssl: hasSslMode
        ? process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: true }
          : { rejectUnauthorized: false }
        : false,
    };
  }
};

const pool = new Pool(getDbConfig());

export const db = drizzle(pool, { schema });
