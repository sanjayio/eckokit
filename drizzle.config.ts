import { defineConfig } from "drizzle-kit";

// Parse DATABASE_URL and extract connection parameters
const getDbCredentials = () => {
  const url =
    process.env.DATABASE_URL ||
    (() => {
      throw new Error("DATABASE_URL environment variable is required");
    })();

  // Try to parse the URL
  try {
    const dbUrl = new URL(url);

    let credentials: {
      host: string;
      port: number;
      user: string;
      password: string;
      database: string;
      ssl?: boolean | { rejectUnauthorized: boolean };
    } = {
      host: "",
      port: 0,
      user: "",
      password: "",
      database: "",
    };

    if (dbUrl.searchParams.get("sslmode") === "require") {
      credentials = {
        host: dbUrl.hostname,
        port: parseInt(dbUrl.port || "5432"),
        user: dbUrl.username,
        password: dbUrl.password,
        database: dbUrl.pathname.slice(1), // Remove leading '/'
        ssl:
          process.env.NODE_ENV === "production"
            ? { rejectUnauthorized: true }
            : { rejectUnauthorized: false },
      };
    } else {
      credentials = {
        host: dbUrl.hostname,
        port: parseInt(dbUrl.port || "5432"),
        user: dbUrl.username,
        password: dbUrl.password,
        database: dbUrl.pathname.slice(1), // Remove leading '/'
        // Configure SSL to allow self-signed certificates in development
        ssl: false,
      };
    }

    return credentials;
  } catch {
    // If URL parsing fails, fall back to using the URL string directly
    // and hope the connection string has SSL parameters
    return {
      url: url,
    };
  }
};

export default defineConfig({
  schema: "./src/drizzle/schema.ts",
  out: "./src/drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: getDbCredentials(),
});
