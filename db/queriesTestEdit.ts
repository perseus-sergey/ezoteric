'use server';

import 'server-only';

import { eq, inArray } from 'drizzle-orm';

import {
  tblArticleViews,
  tblTestAnswers,
  tblTestCategories,
  tblTestConclusions,
  tblTestQuestions,
  tblTests,
  TestWithRelations,
  TNewTestCategory,
  TTestCategory,
} from './schema';
import { getDB } from './root';
import { testFormSchema, TTestFormValues } from '@/models/editArticle.model';
import { revalidateTag } from 'next/cache';
import { ESegment } from '@/models/url.model';
import { getTestCategoriesFromDb } from './queriesTests';

const db = getDB();

export const getCatsFromDb = async () => {
  try {
    const res = await getDB().query.tblTestCategories.findMany({
      orderBy: (cats, { asc }) => [asc(cats.nameEn)],
    });
    return res;
  } catch (error) {
    throw new Error(`fetching Categories failed: ${error}`);
  }
};

export const insertCategoryToDb = async (newCategory: TNewTestCategory) => {
  try {
    const [cat] = await db
      .insert(tblTestCategories)
      .values(newCategory)
      .returning();

    // revalidateTag('master');
    return cat;
  } catch (error) {
    throw new Error(`Insert New Category failed: ${error}`);
  }
};

export const updateCategoryInDb = async (
  categoryId: number,
  updatedCategory: TNewTestCategory
) => {
  try {
    const [tag] = await db
      .update(tblTestCategories)
      .set(updatedCategory)
      .where(eq(tblTestCategories.id, categoryId))
      .returning();

    // revalidateTag('master');

    return tag;
  } catch (error) {
    throw new Error(`Update Category failed: ${error}`);
  }
};

export const deleteCategoryFromDb = async (categoryId: number) => {
  try {
    // Check if category has any tests
    const categoryWithTests = await db.query.tblTestCategories.findFirst({
      where: (category, { eq }) => eq(category.id, categoryId),
      with: {
        tests: true,
      },
    });

    if (
      categoryWithTests?.tests?.length &&
      categoryWithTests?.tests?.length > 0
    ) {
      return categoryWithTests?.tests[0].id;
    }

    // If no tests are associated, proceed with deletion
    const deletedCategory = await db
      .delete(tblTestCategories)
      .where(eq(tblTestCategories.id, categoryId))
      .returning();

    return deletedCategory[0];
  } catch (error) {
    throw new Error(`Delete Category failed: ${error}`);
  }
};

export const insertNewTest = async (newTest: TTestFormValues) => {
  try {
    // 1. Validate the data:
    const validatedData = testFormSchema.parse(newTest);
    const { questions, conclusions, ...test } = validatedData;

    // 2. Start a transaction:
    const res = await db.transaction(async (tx) => {
      // 3. Insert into tblTests:
      const [insertedTest] = await tx.insert(tblTests).values(test).returning();

      // 4. Get the inserted test ID:
      const testId = insertedTest.id;

      // 5. Insert into tblTestQuestions and tblTestAnswers:
      for (const { titleEn, titleUa, answers } of questions) {
        const insertedQuestion = await tx
          .insert(tblTestQuestions)
          .values({
            testId: testId,
            titleUa,
            titleEn,
          })
          .returning();

        const questionId = insertedQuestion[0].id;

        for (const answer of answers) {
          await tx.insert(tblTestAnswers).values({
            questionId: questionId,
            ...answer,
          });
        }
      }

      // 6. Insert into tblTestConclusions:
      for (const conclusion of conclusions) {
        await tx
          .insert(tblTestConclusions)
          .values({ testId: testId, ...conclusion });
      }

      return insertedTest;
    });

    revalidateTag(ESegment.TESTS);

    return res;
  } catch (error) {
    throw new Error(`Error inserting New Test: ${error}`);
  }
};

export const updateTest = async (
  updatedTest: TTestFormValues,
  testId: number
) => {
  const validatedData = testFormSchema.parse(updatedTest);
  const { questions, conclusions, ...testData } = validatedData;

  try {
    const res = await db.transaction(async (tx) => {
      // 1. Update tblTests
      const [resTx] = await tx
        .update(tblTests)
        .set(testData)
        .where(eq(tblTests.id, testId))
        .returning({ updatedAt: tblTests.updatedAt });

      if (!resTx) tx.rollback();

      // 2. Delete existing questions, answers, and conclusions for this test:
      await tx
        .delete(tblTestConclusions)
        .where(eq(tblTestConclusions.testId, testId));

      await tx
        .delete(tblTestAnswers)
        .where(
          inArray(
            tblTestAnswers.questionId,
            db
              .select({ id: tblTestQuestions.id })
              .from(tblTestQuestions)
              .where(eq(tblTestQuestions.testId, testId))
          )
        );

      await tx
        .delete(tblTestQuestions)
        .where(eq(tblTestQuestions.testId, testId));

      // 3. Insert new questions and answers:
      for (const { titleEn, titleUa, answers } of questions) {
        const [insertedQuestion] = await tx
          .insert(tblTestQuestions)
          .values({
            testId: testId,
            titleUa,
            titleEn,
          })
          .returning();

        if (!insertedQuestion) tx.rollback();

        for (const answer of answers) {
          const insertedAnswer = await tx.insert(tblTestAnswers).values({
            questionId: insertedQuestion.id,
            ...answer,
          });

          if (!insertedAnswer) tx.rollback();
        }
      }

      // 4. Insert new conclusions:
      for (const conclusion of conclusions) {
        const insertedConclusion = await tx
          .insert(tblTestConclusions)
          .values({ testId: testId, ...conclusion });

        if (!insertedConclusion) tx.rollback();
      }

      return resTx;
    });
    return res;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error updating test: ${error.message}`);
    }
    throw new Error('An unknown error occurred while updating test');
  }
};

// =================================================================
export async function getTestByIdForUpdate(
  id: number
): Promise<{ test: TestWithRelations; categories: TTestCategory[] }> {
  try {
    const categories = await getTestCategoriesFromDb();

    const test = await db.query.tblTests.findFirst({
      where: eq(tblTests.id, id),
      with: {
        questions: {
          with: {
            answers: true,
          },
        },
        conclusions: true,
        category: true,
      },
    });

    if (!test) {
      throw new Error(`Test with id: ${id} not found.`);
    }

    return { test, categories };
  } catch (error) {
    console.error('Error getting test by ID:', error);
    throw new Error(`Error getting test by ID: ${error}`);
  }
}

export const updateArticleView = async (
  articleId: number,
  isAdmin: boolean
) => {
  if (process.env.NODE_ENV !== 'production' || isAdmin) return;

  try {
    await db.insert(tblArticleViews).values({ articleId });
  } catch (error) {
    console.error('Помилка при додаванні перегляду статті:', error);
  }
};
