import { ELanguage } from './language.model';
import { IMeta } from './meta/default.model';

const { UA, EN } = ELanguage;

export const META_BLOG: Record<ELanguage, (q?: string) => IMeta> = {
  [UA]: (q?: string) => ({
    title: 'Блог - Езотерика, Нумерологія, Таро, Астрологія, Фен-шуй',
    description: `${
      q
        ? `Результати пошуку в назвах або текстах статей за запитом 🔎«${q}».`
        : 'Наш блог пропонує статті про езотерику, нумерологію, Таро, астрологію, фен-шуй та інші нетрадиційні науки.'
    } Дізнайтеся більше про себе та світ навколо!`,
    keywords:
      'езотерика, нумерологія, Таро, астрологія, фен-шуй, нетрадиційні науки, блог, статті',
  }),

  [EN]: (q?: string) => ({
    title: 'Blog - Esotericism, Numerology, Tarot, Astrology, Feng Shui',
    description: `${
      q
        ? `Search results for 🔎«${q}» in titles or texts.`
        : 'Our blog offers articles on esotericism, numerology, Tarot, astrology, feng shui, and other unconventional sciences.'
    } Learn more about yourself and the world around you!`,
    keywords:
      'esotericism, numerology, Tarot, astrology, feng shui, unconventional sciences, blog, articles',
  }),
};

export const META_BLOG_PAGINATED: Record<
  ELanguage,
  (page: number, q?: string) => IMeta
> = {
  [UA]: (page: number, q?: string) => ({
    title: `Сторінка ${page} - Блог: Езотерика, Нумерологія, Таро, Астрологія, Фен-шуй`,
    description: `Перегляньте ${page} сторінку нашого блогу${q ? ` для пошукового запиту 🔎«${q}»` : ''}, де ви знайдете нові статті про езотерику, нумерологію, Таро, астрологію, фен-шуй та інші нетрадиційні науки.`,
    keywords:
      'езотерика, нумерологія, Таро, астрологія, фен-шуй, нетрадиційні науки, блог, статті',
  }),
  [EN]: (page: number, q?: string) => ({
    title: `Page ${page} - Blog: Esotericism, Numerology, Tarot, Astrology, Feng Shui`,
    description: `View page ${page} of our blog${q ? ` for search query 🔎«${q}»` : ''}, where you'll find new articles on esotericism, numerology, Tarot, astrology, feng shui and other unconventional sciences.`,
    keywords:
      'esotericism, numerology, Tarot, astrology, feng shui, unconventional sciences, blog, articles',
  }),
};

export const META_BLOG_TAG: Record<ELanguage, (tagName: string) => IMeta> = {
  [UA]: (tagName: string) => ({
    title: `${tagName} - Блог`,
    description: `Статті, вміст яких торкається теми «${tagName}». Дізнайтеся більше про себе та світ навколо через статті, пов'язані з тегом «${tagName}».`,
    keywords: `${tagName}, блог, статті, езотерика, нумерологія, Таро, астрологія, фен-шуй, нетрадиційні науки`,
  }),
  [EN]: (tagName: string) => ({
    title: `${tagName} - Blog`,
    description: `Articles with content related to the topic «${tagName}». Learn more about yourself and the world around you through articles related to the tag «${tagName}».`,
    keywords: `${tagName}, blog, articles, esotericism, numerology, Tarot, astrology, feng shui, unconventional sciences`,
  }),
};

export const META_BLOG_TAG_PAGINATED: Record<
  ELanguage,
  (tagName: string, page: number) => IMeta
> = {
  [UA]: (tagName: string, page: number) => ({
    title: `${tagName} - Блог | Сторінка ${page}`,
    description: `${page} сторінка статей, вміст яких торкається теми «${tagName}». Дізнайтеся більше про себе та світ навколо через статті, пов'язані з тегом «${tagName}».`,
    keywords: `${tagName}, блог, статті, сторінка ${page}, езотерика, нумерологія, Таро, астрологія, фен-шуй, нетрадиційні науки`,
  }),
  [EN]: (tagName: string, page: number) => ({
    title: `${tagName} - Blog | Page ${page}`,
    description: `Page ${page} of articles with content related to the topic «${tagName}». Learn more about yourself and the world around you through articles related to the tag «${tagName}».`,
    keywords: `${tagName}, blog, articles, page ${page}, esotericism, numerology, Tarot, astrology, feng shui, unconventional sciences`,
  }),
};

export const BLOG_H1 = {
  [UA]: 'Блог',
  [EN]: 'Blog',
};

export const BLOG_SEARCH_INPUT_PARAMS = {
  [UA]: {
    placeholder: 'Пошуковий запит...',
    inputAriaLabel: 'Пошук статей у блозі',
    cancelAriaLabel: 'Очистити поле пошуку',
    submitAriaLabel: 'Розпочати пошук',
  },
  [EN]: {
    placeholder: 'Search query...',
    inputAriaLabel: 'Search articles in the blog',
    cancelAriaLabel: 'Clear search field',
    submitAriaLabel: 'Start search',
  },
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
