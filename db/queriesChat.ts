'use server';

import 'server-only';

import { desc, eq } from 'drizzle-orm';

import { tblArticle, tblTests } from './schema';
import { db } from './root';
import { cache } from 'react';
import { ELanguage } from '@/models/language.model';
import { ESegment } from '@/models/url.model';

const { UA, EN } = ELanguage;
const { BLOG, TESTS } = ESegment;

export interface IPostsTests {
  slug: string;
  titleUa: string;
  descriptionUa: string;
  titleEn: string;
  descriptionEn: string;
}

export const getArticlesForChatFromDb = cache(async () => {
  const {
    slug,
    titleEn,
    titleUa,
    descriptionEn,
    descriptionUa,
    published,
    updatedAt,
  } = tblArticle;

  try {
    const articles = await db
      .select({
        slug,
        titleUa,
        descriptionUa,
        titleEn,
        descriptionEn,
      })
      .from(tblArticle)
      .where(eq(published, true))
      .orderBy(desc(updatedAt))
      .limit(100);

    return articles;
  } catch (error) {
    console.log('getPostsFromDb ~ error:', error);
    return [];
  }
});

export const getTestsForChatFromDb = cache(async () => {
  const {
    slug,
    titleEn,
    titleUa,
    descriptionEn,
    descriptionUa,
    published,
    updatedAt,
  } = tblTests;
  try {
    const tests = await db
      .select({
        slug,
        titleUa,
        descriptionUa,
        titleEn,
        descriptionEn,
      })
      .from(tblTests)
      .where(eq(published, true))
      .orderBy(desc(updatedAt))
      .limit(100);

    return tests;
  } catch (error) {
    console.log('getTestsFromDb ~ error:', error);
    return [];
  }
});

export const makeLinksForExternal = async () => {
  const postList = await getArticlesForChatFromDb();
  const testList = await getTestsForChatFromDb();

  const numerologyTest = {
    title: 'Тест з Нумерології',
    description:
      "Тест який визначає: Life Path Number, Soul Number, Destiny Number, Personality Number. Також інтерпретацію кожного отриманого числа і повний висновок. При цьому користувачу потрібно спочатку заповнити форму, написавши своє повне ім'я та дату народження.",
    href: '/uk/#numerology-form-id',
  };

  const makeLinks = (startPath: string, itemList: IPostsTests[]) =>
    itemList.map((item) => ({
      title: item.titleUa,
      description: item.descriptionUa,
      href: `/${UA}/${startPath}/${item.slug}`,
    }));

  return {
    articles: makeLinks(BLOG, postList),
    tests: [numerologyTest, ...makeLinks(TESTS, testList)],
  };
};

export const makeLinksForChat = async () => {
  const postList = await getArticlesForChatFromDb();
  const testList = await getTestsForChatFromDb();

  const numerologyTest = {
    titleUa: 'Тест з Нумерології',
    descriptionEn:
      'A test that determines: life path number, soul number, destiny number, personality number. Also, the interpretation of each number received and a full conclusion. In this case, the user must first fill out a form by writing their full name and date of birth.',
    hrefUa: '/uk/#numerology-form-id',
    hrefEn: '/en/#numerology-form-id',
  };

  const makeLinks = (startPath: string, itemList: IPostsTests[]) =>
    itemList.map((item) => ({
      titleUa: item.titleUa,
      descriptionEn: item.descriptionEn,
      hrefUa: `/${UA}/${startPath}/${item.slug}`,
      hrefEn: `/${EN}/${startPath}/${item.slug}`,
    }));

  return {
    articles: makeLinks(BLOG, postList),
    tests: [numerologyTest, ...makeLinks(TESTS, testList)],
  };
};
