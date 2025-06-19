import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const postgresUrl = process.env.POSTGRES_URL || '';

if (!postgresUrl) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

const client = postgres(postgresUrl);
export const db = drizzle(client, { schema });
