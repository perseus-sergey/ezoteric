'use server';

import 'server-only';
import { getDB } from './root';
import { cache } from 'react';
import { ELanguage } from '@/models/language.model';
import { TTestLocalized } from '@/models/test.model';
import { and, eq, sql } from 'drizzle-orm';
import { tblTestCategories, tblTests, tblTestViews } from './schema';

const { UA, EN } = ELanguage;

const db = getDB();

export const getTestCategoriesFromDb = async () => {
  try {
    const res = await db.query.tblTestCategories.findMany({
      orderBy: (cats, { asc }) => [asc(cats.nameEn)],
    });
    return res;
  } catch (error) {
    throw new Error(`fetching Categories failed: ${error}`);
  }
};

export const getTestsChunk = cache(
  async (
    offset: number,
    perPage: number,
    lang: ELanguage,
    isAdmin: boolean,
    searchQuery?: string,
    categorySlug?: string
  ): Promise<{
    tests: TTestLocalized[] | null;
    totalCount: number | null;
    // =================================================================
    // check if ti needs categoryName
    // =================================================================
    categoryName: string | null;
  }> => {
    // Search condition
    const searchCondition = searchQuery
      ? sql`(
      setweight(to_tsvector(${lang === EN ? 'english' : 'simple'}, ${tblTests[lang === EN ? 'titleEn' : 'titleUa']}), 'A') ||
      setweight(to_tsvector(${lang === EN ? 'english' : 'simple'}, ${tblTests[lang === EN ? 'descriptionEn' : 'descriptionUa']}), 'B')
    ) @@ plainto_tsquery('english', ${searchQuery})`
      : undefined;

    const publishedCondition = eq(tblTests.published, true);

    try {
      const [totalCountQuery, tests, categoryName] = await Promise.all([
        // Calculate total count of PUBLISHED tests
        db
          .select({
            total_count: sql<number>`COUNT(${tblTests.id})`.mapWith(Number),
          })
          .from(tblTests)
          .innerJoin(
            tblTestCategories,
            eq(tblTests.categoryId, tblTestCategories.id)
          )
          .where(
            and(
              searchCondition,
              isAdmin ? undefined : publishedCondition,
              categorySlug
                ? eq(tblTestCategories.slug, categorySlug)
                : undefined
            )
          ),

        // Fetch tests with pagination
        db.query.tblTests.findMany({
          limit: perPage,
          offset,
          where: (test, { and }) =>
            and(
              searchCondition,
              isAdmin ? undefined : publishedCondition,
              categorySlug
                ? eq(tblTestCategories.slug, categorySlug)
                : undefined
            ),
          orderBy: (tests, { desc }) => [desc(tests.updatedAt)],

          columns: {
            id: true,
            updatedAt: true,
            createdAt: true,
            slug: true,
            imageSrc: true,
            published: true,
            viewCount: true,
          },
          extras: {
            title:
              sql<string>`${tblTests[lang === EN ? 'titleEn' : 'titleUa']}`.as(
                'title'
              ),
            description:
              sql<string>`${tblTests[lang === EN ? 'descriptionEn' : 'descriptionUa']}`.as(
                'description'
              ),
            text: sql<string>`${tblTests[lang === EN ? 'textEn' : 'textUa']}`.as(
              'text'
            ),
          },
          with: {
            category: {
              columns: {
                id: true,
                slug: true,
              },
              extras: {
                name: sql<string>`${tblTestCategories[lang === EN ? 'nameEn' : 'nameUa']}`.as(
                  'name'
                ),
              },
            },
          },
        }),

        // Запит на отримання назви категорії
        categorySlug
          ? db
              .select({
                name: tblTestCategories[lang === EN ? 'nameEn' : 'nameUa'],
              })
              .from(tblTestCategories)
              .where(eq(tblTestCategories.slug, categorySlug))
              .limit(1)
          : Promise.resolve(null),
      ]);

      return {
        totalCount: totalCountQuery[0]?.total_count || 0,
        tests,
        categoryName: categoryName?.[0]?.name || null,
      };
    } catch (error) {
      console.error(
        'Failed to get tests from database.',
        'Error: ',
        (error as Error).message
      );
      return { totalCount: null, tests: null, categoryName: null };
    }
  }
);

export const getTestBySlug = cache(async (slug: string, lang: ELanguage) => {
  try {
    const test = await db.query.tblTests.findFirst({
      where: (test, { eq }) => eq(test.slug, slug),
      columns: {
        id: true,
        updatedAt: true,
        createdAt: true,
        slug: true,
        imageSrc: true,
        published: true,
        spotifyId: true,
        viewCount: true,
      },
      extras: {
        title: sql<string>`${tblTests[lang === UA ? 'titleUa' : 'titleEn']}`.as(
          'title'
        ),
        h1Text: sql<string>`${tblTests[lang === UA ? 'h1Ua' : 'h1En']}`.as(
          'h1Text'
        ),
        description:
          sql<string>`${tblTests[lang === UA ? 'descriptionUa' : 'descriptionEn']}`.as(
            'description'
          ),
        keywords:
          sql<string>`${tblTests[lang === UA ? 'keywordsUa' : 'keywordsEn']}`.as(
            'keywords'
          ),
        text: sql<string>`${tblTests[lang === UA ? 'textUa' : 'textEn']}`.as(
          'text'
        ),
      },
      with: {
        questions: {
          extras: {
            title:
              sql<string>`${tblTests[lang === UA ? 'titleUa' : 'titleEn']}`.as(
                'title'
              ),
          },
          with: {
            answers: {
              columns: { rating: true, id: true },
              extras: {
                text: sql<string>`${tblTests[lang === UA ? 'textUa' : 'textEn']}`.as(
                  'text'
                ),
              },
            },
          },
        },
        conclusions: {
          columns: { minRank: true, maxRank: true },
          extras: {
            description:
              sql<string>`${tblTests[lang === UA ? 'descriptionUa' : 'descriptionEn']}`.as(
                'description'
              ),
          },
        },
        category: {
          columns: {
            id: true,
            slug: true,
          },
          extras: {
            name: sql<string>`${tblTestCategories[lang === EN ? 'nameEn' : 'nameUa']}`.as(
              'name'
            ),
          },
        },
      },
    });

    return test || null;
  } catch (error) {
    console.error(
      'Failed to get test from database',
      'Error Name: ',
      (error as Error).name
    );
    return null;
  }
});

export type TTestRelationsLocalized = Awaited<ReturnType<typeof getTestBySlug>>;

export const updateTestView = async (testId: number, isAdmin: boolean) => {
  if (process.env.NODE_ENV !== 'production' || isAdmin) return;

  try {
    await db.insert(tblTestViews).values({ testId });
  } catch (error) {
    console.error('Помилка при додаванні перегляду статті:', error);
  }
};
