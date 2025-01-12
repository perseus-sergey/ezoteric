import { ELanguage } from './language.model';

const { UA, EN } = ELanguage;
export const META_BLOG = {
  [UA]: {
    title: 'Блог - Езотерика, Нумерологія, Таро, Астрологія, Фен-шуй',
    description:
      'Наш блог пропонує статті про езотерику, нумерологію, Таро, астрологію, фен-шуй та інші нетрадиційні науки. Дізнайтеся більше про себе та світ навколо!',
    keywords:
      'езотерика, нумерологія, Таро, астрологія, фен-шуй, нетрадиційні науки, блог, статті',
  },
  [EN]: {
    title: 'Blog - Esotericism, Numerology, Tarot, Astrology, Feng Shui',
    description:
      'Our blog offers articles on esotericism, numerology, Tarot, astrology, feng shui and other unconventional sciences. Learn more about yourself and the world around you!',
    keywords:
      'esotericism, numerology, Tarot, astrology, feng shui, unconventional sciences, blog, articles',
  },
};

export const BLOG_H1 = {
  [UA]: 'Блог',
  [EN]: 'Blog',
};

export const BLOG_CARD_IMAGE = {
  defaultImgSrc: '/images/post/default_post_400.jpg',
  size: { width: 400, height: 400 },
};

export const BLOG_COUNT_CAPTION = {
  [EN]: 'Number of articles: ',
  [UA]: 'Кількість статей: ',
};

export const BLOG_PAGINATION_PARAMS = {
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
