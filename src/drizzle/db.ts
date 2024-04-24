import { env } from "@/env";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import postgres from "postgres";


// NOTE: postgres versions above 3.3.5 are not supported on the edge runtime
const client = postgres(env.DATABASE_URL, { max: 1 });

export const db = drizzle(client, {
  schema,
  logger: env.NODE_ENV === "development",
});




