import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Load environment variables
config({ path: ".env.local" });

// Create connection
const connectionString = process.env.DATABASE_URL || "";
const client = postgres(connectionString);

// Create db instance
export const db = drizzle(client); 