import { InferSelectModel, relations, sql } from 'drizzle-orm';
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
export const TBL_SCHEDULE = 'ezo_schedule';
export const TBL_IMAGES = 'ezo_images';
export const TBL_ARTICLE = 'ezo_article';
export const TBL_ARTICLE_VIEWS = 'ezo_article_views';
export const TBL_TESTS = 'ezo_tests';
export const TBL_TESTS_QUESTIONS = 'ezo_test_questions';
export const TBL_TESTS_ANSWERS = 'ezo_test_answers';
export const TBL_TESTS_CONCLUSIONS = 'ezo_test_conclusions';
export const TBL_TEST_VIEWS = 'ezo_test_views';
export const TBL_TEST_COMPLETED = 'ezo_test_completed';
export const TBL_TEST_CATEGORIES = 'ezo_test_categories';
export const TBL_TAGS = 'ezo_tags';
export const TBL_ARTICLE_TAGS = 'ezo_article_tags';
export const TBL_ARTICLE_VIEWS_COUNTS = 'ezo_article_view_counts';

export const userRoleEnum = pgEnum('user_role', ['user', 'admin', 'editor']);

// =================================================================
// TBL_USER
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
// TBL_SCHEDULE
// =================================================================

export const appointmentSchedule = pgTable(TBL_SCHEDULE, {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  meetDate: timestamp('meetDate', { withTimezone: true }).notNull(),

  reservedAt: timestamp('reservedAt', { withTimezone: true }),
  question: varchar('question', { length: 255 }),
  hasCompletedPayment: boolean('hasCompletedPayment').default(false),
  userName: varchar('userName', { length: 128 }),
  email: varchar('email', { length: 64 }).references(() => user.email),
});

export type TSchedule = InferSelectModel<typeof appointmentSchedule>;

// =================================================================
// TBL_IMAGES
// =================================================================

export const tblImages = pgTable(TBL_IMAGES, {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  filename: text('filename').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type TTblImages = InferSelectModel<typeof tblImages>;

// =================================================================
// TBL_TESTS
// =================================================================

export const tblTests = pgTable(
  TBL_TESTS,
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    h1En: varchar(`h1${langSuffix.en}`, { length: 255 }).notNull(),
    h1Ua: varchar(`h1${langSuffix.uk}`, { length: 255 }).notNull(),
    titleUa: varchar(`title${langSuffix.uk}`, { length: 255 })
      .notNull()
      .unique(),
    titleEn: varchar(`title${langSuffix.en}`, { length: 255 })
      .notNull()
      .unique(),
    descriptionUa: text(`description${langSuffix.uk}`).notNull(),
    descriptionEn: text(`description${langSuffix.en}`).notNull(),
    keywordsUa: varchar(`keywords${langSuffix.uk}`, { length: 255 }).notNull(),
    keywordsEn: varchar(`keywords${langSuffix.en}`, { length: 255 }).notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    imageSrc: varchar('image_src', { length: 255 }),
    published: boolean('published').notNull().default(true),
    spotifyId: varchar('spotify_id', { length: 255 }),
    viewCount: integer('view_count').notNull().default(0),
    completedCount: integer('completed_count').notNull().default(0),
    categoryId: integer('category_id')
      .references(() => tblTestCategories.id)
      .notNull(),
    textUa: text(`text${langSuffix.uk}`).notNull(),
    textEn: text(`text${langSuffix.en}`).notNull(),
  },
  (table) => ({
    searchIndexEn: index('tests_search_en_idx').using(
      'gin',
      sql`(
        setweight(to_tsvector('english', ${table.titleEn}), 'A') ||
        setweight(to_tsvector('english', ${table.descriptionEn}), 'B') ||
        setweight(to_tsvector('english', ${table.textEn}), 'C')
      )`
    ),
    searchIndexUa: index('tests_search_ua_idx').using(
      'gin',
      sql`(
        setweight(to_tsvector('simple', ${table.titleUa}), 'A') ||
        setweight(to_tsvector('simple', ${table.descriptionUa}), 'B') ||
         setweight(to_tsvector('simple', ${table.textUa}), 'C')
      )`
    ),
  })
);

export type TTblTests = InferSelectModel<typeof tblTests>;

export interface TestWithRelations extends InferSelectModel<typeof tblTests> {
  questions: (InferSelectModel<typeof tblTestQuestions> & {
    answers: InferSelectModel<typeof tblTestAnswers>[];
  })[];
  conclusions: InferSelectModel<typeof tblTestConclusions>[];
  category: InferSelectModel<typeof tblTestCategories>;
}

// TBL_TESTS_QUESTIONS
export const tblTestQuestions = pgTable(TBL_TESTS_QUESTIONS, {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  testId: integer('test_id')
    .references(() => tblTests.id)
    .notNull(),
  titleUa: text(`title${langSuffix.uk}`).notNull(),
  titleEn: text(`title${langSuffix.en}`).notNull(),
});

// TBL_TESTS_ANSWERS
export const tblTestAnswers = pgTable(TBL_TESTS_ANSWERS, {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  questionId: integer('question_id')
    .references(() => tblTestQuestions.id)
    .notNull(),
  textUa: text(`text${langSuffix.uk}`).notNull(),
  textEn: text(`text${langSuffix.en}`).notNull(),
  rating: integer('rating').notNull(), // Value assigned to the answer
});

// TBL_TESTS_CONCLUSIONS
export const tblTestConclusions = pgTable(TBL_TESTS_CONCLUSIONS, {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  testId: integer('test_id')
    .references(() => tblTests.id)
    .notNull(),
  minRank: integer('min_rank').notNull(), // Minimum total rank for this conclusion
  maxRank: integer('max_rank').notNull(), // Maximum total rank for this conclusion
  descriptionUa: text(`description${langSuffix.uk}`).notNull(),
  descriptionEn: text(`description${langSuffix.en}`).notNull(),
});

// TBL_TEST_CATEGORIES
export const tblTestCategories = pgTable(TBL_TEST_CATEGORIES, {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  nameUa: varchar(`name${langSuffix.uk}`, { length: 255 }).notNull().unique(),
  nameEn: varchar(`name${langSuffix.en}`, { length: 255 }).notNull().unique(),
  descriptionUa: varchar(`description${langSuffix.uk}`, {
    length: 640,
  }).notNull(),
  descriptionEn: varchar(`description${langSuffix.en}`, {
    length: 640,
  }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
});

export type TTestCategory = InferSelectModel<typeof tblTestCategories>;
export type TNewTestCategory = typeof tblTestCategories.$inferInsert;

export type TTestCategoryLocalized = Pick<
  InferSelectModel<typeof tblTestCategories>,
  'id' | 'slug'
> & { name: string; description?: string };

// TBL_TEST_VIEWS
export const tblTestViews = pgTable(
  TBL_TEST_VIEWS,
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    viewTimestamp: timestamp('view_timestamp').defaultNow().notNull(),
    testId: integer('test_id')
      .notNull()
      .references(() => tblTests.id),
  },
  (table) => ({
    testIdIdx: index('test_id_idx').on(table.testId),
  })
);

// TBL_TEST_COMPLETED
export const tblTestCompleted = pgTable(
  TBL_TEST_COMPLETED,
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    completedDate: timestamp('view_timestamp').defaultNow().notNull(),
    testId: integer('test_id')
      .notNull()
      .references(() => tblTests.id),
  },
  (table) => ({
    testIdIdx: index('test_id_completed_idx').on(table.testId),
  })
);

// =================================================================
// ------------------- Tests Relations ---------------------------
// =================================================================

export const testsRelations = relations(tblTests, ({ many, one }) => ({
  questions: many(tblTestQuestions),
  conclusions: many(tblTestConclusions),
  category: one(tblTestCategories, {
    fields: [tblTests.categoryId],
    references: [tblTestCategories.id],
  }),
  views: many(tblTestViews),
  completedCount: many(tblTestCompleted),
}));

export const testQuestionsRelations = relations(
  tblTestQuestions,
  ({ one, many }) => ({
    test: one(tblTests, {
      fields: [tblTestQuestions.testId],
      references: [tblTests.id],
    }),
    answers: many(tblTestAnswers),
  })
);

export const testAnswersRelations = relations(tblTestAnswers, ({ one }) => ({
  question: one(tblTestQuestions, {
    fields: [tblTestAnswers.questionId],
    references: [tblTestQuestions.id],
  }),
}));

export const testConclusionsRelations = relations(
  tblTestConclusions,
  ({ one }) => ({
    test: one(tblTests, {
      fields: [tblTestConclusions.testId],
      references: [tblTests.id],
    }),
  })
);

export const testViewsRelations = relations(tblTestViews, ({ one }) => ({
  test: one(tblTests, {
    fields: [tblTestViews.testId],
    references: [tblTests.id],
  }),
}));

export const testCompletedRelations = relations(
  tblTestCompleted,
  ({ one }) => ({
    test: one(tblTests, {
      fields: [tblTestCompleted.testId],
      references: [tblTests.id],
    }),
  })
);

export const testCategoriesRelations = relations(
  tblTestCategories,
  ({ many }) => ({
    tests: many(tblTests),
  })
);

// =================================================================
// TBL_ARTICLE
// =================================================================

export const tblArticle = pgTable(
  TBL_ARTICLE,
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    titleUa: varchar(`title${langSuffix.uk}`, { length: 255 })
      .notNull()
      .unique(),
    titleEn: varchar(`title${langSuffix.en}`, { length: 255 })
      .notNull()
      .unique(),
    h1En: varchar(`h1${langSuffix.en}`, { length: 255 }),
    h1Ua: varchar(`h1${langSuffix.uk}`, { length: 255 }),
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
    viewCount: integer('view_count').notNull().default(0),
  },
  (table) => ({
    searchIndexEn: index('articles_search_en_idx').using(
      'gin',
      sql`(
        setweight(to_tsvector('english', ${table.titleEn}), 'A') ||
        setweight(to_tsvector('english', ${table.textEn}), 'B')
      )`
    ),
    searchIndexUa: index('articles_search_ua_idx').using(
      'gin',
      sql`(
        setweight(to_tsvector('simple', ${table.titleUa}), 'A') ||
        setweight(to_tsvector('simple', ${table.textUa}), 'B')
      )`
    ),
  })
);

export type TArticle = InferSelectModel<typeof tblArticle>;

// TBL_ARTICLE_VIEWS
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

// TBL_ARTICLE_VIEWS_COUNTS
// export const articleViewCounts = pgTable(TBL_ARTICLE_VIEWS_COUNTS, {
//   articleId: integer('article_id')
//     .primaryKey()
//     .references(() => tblArticle.id),
//   viewCount: integer('view_count').notNull().default(0),
// });

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

// TBL_ARTICLE_TAGS
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
// ------------------- Article Relations ---------------------------
// =================================================================

export const tblArticleRelations = relations(tblArticle, ({ many }) => ({
  articleTags: many(tblArticleTag),
  // viewCount: one(articleViewCounts, {
  //   fields: [tblArticle.id],
  //   references: [articleViewCounts.articleId],
  // }),
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
