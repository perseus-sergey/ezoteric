import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const postgresUrl = process.env.POSTGRES_URL || '';

export const getDB = () => {
  const client = postgres(postgresUrl);
  return drizzle(client, { schema });
};
