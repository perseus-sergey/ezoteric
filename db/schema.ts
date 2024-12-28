import { Message } from 'ai';
import { InferSelectModel } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  timestamp,
  json,
  uuid,
  boolean,
  serial,
  text,
  integer,
} from 'drizzle-orm/pg-core';

enum DB_TABLE_NAME {
  TBL_USER = 'ezo_ser',
  TBL_CHAT = 'ezo_hat',
  TBL_RESERVATION = 'ezo_reservation',
  TBL_ARTICLE = 'ezo_article',
}

const { TBL_USER, TBL_CHAT, TBL_RESERVATION, TBL_ARTICLE } = DB_TABLE_NAME;

export const user = pgTable(TBL_USER, {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  email: varchar('email', { length: 64 }).notNull().unique(),
  name: varchar('name', { length: 128 }),
  password: varchar('password', { length: 64 }),
});

export type User = InferSelectModel<typeof user>;

export const chat = pgTable(TBL_CHAT, {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('createdAt').notNull(),
  messages: json('messages').notNull(),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id),
});

export type Chat = Omit<InferSelectModel<typeof chat>, 'messages'> & {
  messages: Array<Message>;
};

export const reservation = pgTable(TBL_RESERVATION, {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('createdAt').notNull(),
  details: json('details').notNull(),
  hasCompletedPayment: boolean('hasCompletedPayment').notNull().default(false),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id),
});

export type Reservation = InferSelectModel<typeof reservation>;

export const article = pgTable(TBL_ARTICLE, {
  id: serial('id').primaryKey(),
  createdAt: timestamp('createdAt').notNull(),
  slug: varchar('slug', { length: 256 }).notNull().unique(),
  titleUa: varchar('title_ua', { length: 256 }).notNull().unique(),
  titleEn: varchar('title_en', { length: 256 }).notNull().unique(),
  descriptionUa: varchar('description_ua', { length: 640 }).notNull(),
  descriptionEn: varchar('description_en', { length: 640 }).notNull(),
  keywordsUa: varchar('keywords_ua', { length: 256 }).notNull(),
  keywordsEn: varchar('keywords_en', { length: 256 }).notNull(),
  textUa: text('text_ua').notNull(),
  textEn: text('text_en').notNull(),
  imageName: varchar('image_name', { length: 256 }),
  view: integer('view'),
});

export type TArticle = InferSelectModel<typeof article>;
