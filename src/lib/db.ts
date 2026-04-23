// Creates a shared Neon Postgres client when DATABASE_URL is configured.
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;

export const hasDatabase = Boolean(databaseUrl);

export const sql = databaseUrl
  ? postgres(databaseUrl, {
      ssl: "require",
      max: 5,
      idle_timeout: 20,
      connect_timeout: 10,
      prepare: false,
    })
  : null;
