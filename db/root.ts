import { ELanguage } from '@/models/language.model';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

export const langSuffix = {
  [ELanguage.UA]: '_ua',
  [ELanguage.EN]: '_en',
};

export enum DB_TABLE_NAME {
  TBL_USER = 'ezo_user',
  TBL_CHAT = 'ezo_chat',
  TBL_RESERVATION = 'ezo_reservation',
  TBL_ARTICLE = 'ezo_article',
}

const postgresUrl = process.env.POSTGRES_URL || '';

export const getDB = () => {
  // let db: PostgresJsDatabase<Record<string, never>> & {
  //   $client: postgres.Sql;
  // };
  const client = postgres(postgresUrl);
  return drizzle(client, { schema });

  // try {
  //   const client = postgres(postgresUrl);
  //   return drizzle(client);
  // } catch (error) {
  //   console.log('🚀 ~ DB CONNECTION ERROR:', error);
  //   return null;
  // }
};
