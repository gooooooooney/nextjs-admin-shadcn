import { env } from '@/env';
import 'dotenv/config'; // make sure to install dotenv package
import type { Config } from 'drizzle-kit';

export default {
  driver: 'pg',
  out: './src/drizzle',
  schema: './src/drizzle/schema/index.ts',
  dbCredentials: {
    connectionString: env.DATABASE_URL
  },
  // Print all statements
  verbose: true,
  // Always ask for confirmation
  strict: true,
} satisfies Config;