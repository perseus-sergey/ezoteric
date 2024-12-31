import { Message } from 'ai';
import { InferSelectModel } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  timestamp,
  json,
  uuid,
  boolean,
  text,
  integer,
} from 'drizzle-orm/pg-core';
import { DB_TABLE_NAME, langSuffix } from './root';

const { TBL_USER, TBL_CHAT, TBL_RESERVATION, TBL_ARTICLE } = DB_TABLE_NAME;

export const user = pgTable(TBL_USER, {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  email: varchar('email', { length: 64 }).notNull().unique(),
  name: varchar('name', { length: 128 }),
  password: varchar('password', { length: 64 }),
});

export type TUser = InferSelectModel<typeof user>;

export const chat = pgTable(TBL_CHAT, {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('createdAt').notNull(),
  messages: json('messages').notNull(),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id),
});

export type TChat = Omit<InferSelectModel<typeof chat>, 'messages'> & {
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

export type TReservation = InferSelectModel<typeof reservation>;

export const tblArticle = pgTable(TBL_ARTICLE, {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  titleUa: varchar(`title${langSuffix.uk}`, { length: 255 }).notNull().unique(),
  titleEn: varchar(`title${langSuffix.en}`, { length: 255 }).notNull().unique(),
  descriptionUa: varchar(`description${langSuffix.uk}`, {
    length: 640,
  }).notNull(),
  descriptionEn: varchar(`description${langSuffix.en}`, {
    length: 640,
  }).notNull(),
  keywordsUa: varchar(`keywords${langSuffix.uk}`, { length: 255 }).notNull(),
  keywordsEn: varchar(`keywords${langSuffix.en}`, { length: 255 }).notNull(),
  textUa: text(`text${langSuffix.uk}`).notNull(),
  textEn: text(`text${langSuffix.en}`).notNull(),
  imageName: varchar('image_name', { length: 255 }),
  view: integer('view'),
});

export type TArticle = InferSelectModel<typeof tblArticle>;

export type TArticleLocalized = Pick<
  InferSelectModel<typeof tblArticle>,
  'id' | 'slug' | 'updatedAt' | 'imageName' | 'view'
> & {
  title: string;
  description: string;
  text: string;
  keywords: string;
};
