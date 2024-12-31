import { ELanguage } from './language.model';

const { UA, EN } = ELanguage;

export const ARTICLE_IMG = {
  path: '/images/post/',

  size: { width: 800, height: 800 },

  getAlt(title: string) {
    return {
      [UA]: `Ілюстрація до статті "${title}"`,
      [EN]: `Illustration for the article "${title}"`,
    };
  },
};

export const ARTICLE_CARD_IMAGE = {
  defaultImgSrc: '/images/post/default_post_400.jpg',
  size: { width: 250, height: 250 },
};

export const ARTICLES_COUNT_CAPTION = {
  [EN]: 'Number of articles found: ',
  [UA]: 'Кількість знайдених статей: ',
};

export const ARTICLE_PAGINATION_PARAMS = {
  perPage: 10,
  offsetNumber: 3,
  firstPageTitle: '<<',
  lastPageTitle: '>>',
  previousPageTitle: '<',
  nextPageTitle: '>',
  linkTitle: {
    currentPage: {
      [UA]: 'Зараз ви на сторінці: ',
      [EN]: 'You are now on page: ',
    },
    pageStartStr: {
      [UA]: 'Перейти на сторінку: ',
      [EN]: 'Go to page: ',
    },
    firstPage: {
      [UA]: 'Перейти на першу сторінку',
      [EN]: 'Go to first page',
    },
    nextPage: {
      [UA]: 'Перейти на наступну сторінку',
      [EN]: 'Go to next page',
    },
    previousPage: {
      [UA]: 'Перейти на попередню сторінку',
      [EN]: 'Go to previous page',
    },
    lastPage: {
      [UA]: 'Перейти на останню сторінку',
      [EN]: 'Go to last page',
    },
  },
};

export const getSeoCardLinkTitle = (title: string) => ({
  [UA]: `Перейти до перегляду статті "${title}"`,
  [EN]: `Go to view the article "${title}"`,
});
