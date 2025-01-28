import { Message } from 'ai';
import { InferSelectModel, relations } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  timestamp,
  json,
  uuid,
  boolean,
  text,
  integer,
  pgEnum,
  index,
  primaryKey,
} from 'drizzle-orm/pg-core';

export const langSuffix = {
  uk: '_ua',
  en: '_en',
};

export const TBL_USER = 'ezo_user';
export const TBL_CHAT = 'ezo_chat';
export const TBL_RESERVATION = 'ezo_reservation';
export const TBL_ARTICLE = 'ezo_article';
export const TBL_ARTICLE_VIEWS = 'ezo_article_views';
export const TBL_TAGS = 'ezo_tags';
export const TBL_ARTICLE_TAGS = 'ezo_article_tags';
export const TBL_ARTICLE_VIEWS_COUNTS = 'ezo_article_view_counts';

export const userRoleEnum = pgEnum('user_role', ['user', 'admin', 'editor']);

// =================================================================
// TBL_CHAT
// =================================================================

export const user = pgTable(TBL_USER, {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  email: varchar('email', { length: 64 }).notNull().unique(),
  name: varchar('name', { length: 128 }),
  password: varchar('password', { length: 64 }),
  role: userRoleEnum('role').notNull().default('user'),
});

export type TUser = InferSelectModel<typeof user>;

// =================================================================
// TBL_CHAT
// =================================================================

export const chat = pgTable(TBL_CHAT, {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('createdAt').notNull(),
  messages: json('messages').notNull(),
  email: varchar('email', { length: 64 })
    .notNull()
    .references(() => user.email),
});

export type TChat = Omit<InferSelectModel<typeof chat>, 'messages'> & {
  messages: Array<Message>;
};

// =================================================================
// TBL_RESERVATION
// =================================================================

export const reservation = pgTable(TBL_RESERVATION, {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('createdAt').notNull(),
  details: json('details').notNull(),
  hasCompletedPayment: boolean('hasCompletedPayment').notNull().default(false),
  email: varchar('email', { length: 64 })
    .notNull()
    .references(() => user.email),
});

export type TReservation = InferSelectModel<typeof reservation>;

// =================================================================
// TBL_ARTICLE
// =================================================================

export const tblArticle = pgTable(TBL_ARTICLE, {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
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
  imageSrc: varchar('image_src', { length: 255 }),
  spotifyId: varchar('spotify_id', { length: 255 }),
  published: boolean('published').notNull().default(true),
});

export type TArticle = InferSelectModel<typeof tblArticle>;

// =================================================================
// TBL_TAGS
// =================================================================

export const tblTag = pgTable(TBL_TAGS, {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  nameUa: varchar(`name${langSuffix.uk}`, { length: 255 }).notNull().unique(),
  nameEn: varchar(`name${langSuffix.en}`, { length: 255 }).notNull().unique(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
});

export type TTag = InferSelectModel<typeof tblTag>;
export type TNewTag = typeof tblTag.$inferInsert;

export type TTagLocalized = Pick<
  InferSelectModel<typeof tblTag>,
  'id' | 'slug'
> & { name: string };

// =================================================================
// TBL_ARTICLE_TAGS
// =================================================================

export const tblArticleTag = pgTable(
  TBL_ARTICLE_TAGS,
  {
    // Junction table
    articleId: integer('article_id')
      .notNull()
      .references(() => tblArticle.id),
    tagId: integer('tag_id')
      .notNull()
      .references(() => tblTag.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.articleId, table.tagId] }), // Composite primary key
    };
  }
);

// =================================================================
// TBL_ARTICLE_VIEWS
// =================================================================

export const tblArticleViews = pgTable(
  TBL_ARTICLE_VIEWS,
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    articleId: integer('article_id')
      .notNull()
      .references(() => tblArticle.id),
    viewTimestamp: timestamp('view_timestamp').defaultNow().notNull(),
  },
  (table) => ({
    articleIdIdx: index('article_id_idx').on(table.articleId),
  })
);

// =================================================================
// TBL_ARTICLE_VIEWS_COUNTS
// =================================================================

export const articleViewCounts = pgTable(TBL_ARTICLE_VIEWS_COUNTS, {
  articleId: integer('article_id')
    .primaryKey()
    .references(() => tblArticle.id),
  viewCount: integer('view_count').notNull().default(0),
});

// =================================================================
// ------------------- Relations ---------------------------
// =================================================================

export const tblArticleRelations = relations(tblArticle, ({ many, one }) => ({
  articleTags: many(tblArticleTag),
  viewCount: one(articleViewCounts, {
    fields: [tblArticle.id],
    references: [articleViewCounts.articleId],
  }),
}));

export const tblTagRelations = relations(tblTag, ({ many }) => ({
  articleTags: many(tblArticleTag),
}));

export const tblArticleTagRelations = relations(tblArticleTag, ({ one }) => ({
  article: one(tblArticle, {
    fields: [tblArticleTag.articleId],
    references: [tblArticle.id],
  }),
  tag: one(tblTag, {
    fields: [tblArticleTag.tagId],
    references: [tblTag.id],
  }),
}));
