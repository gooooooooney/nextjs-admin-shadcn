import { env } from '@/env';
import 'dotenv/config'; // make sure to install dotenv package
import type { Config } from 'drizzle-kit';



export default {
  dialect: "postgresql",
  out: './src/drizzle/migrations',
  schema: './src/drizzle/schema/index.ts',
  dbCredentials: {
    url: env.DATABASE_URL
  },
  // Print all statements
  verbose: true,
  // Always ask for confirmation
  strict: true,
} satisfies Config;