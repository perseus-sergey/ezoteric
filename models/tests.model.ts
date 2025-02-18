import { ELanguage } from './language.model';
import { IMeta } from './meta/default.model';

const { UA, EN } = ELanguage;

export const META_TESTS: Record<ELanguage, (q?: string) => IMeta> = {
  [UA]: (q?: string) => ({
    title: 'Тести - Езотерика, Нумерологія, Таро, Астрологія, Фен-шуй',
    description: `${
      q
        ? `Результати пошуку в назвах або описах тестів за запитом 🔎«${q}».`
        : 'Наш сайт пропонує тести про езотерику, нумерологію, Таро, астрологію, фен-шуй та інші нетрадиційні науки.'
    } Дізнайтеся більше про себе та світ навколо!`,
    keywords:
      'езотерика, нумерологія, Таро, астрологія, фен-шуй, нетрадиційні науки, тести',
  }),

  [EN]: (q?: string) => ({
    title: 'Tests - Esotericism, Numerology, Tarot, Astrology, Feng Shui',
    description: `${
      q
        ? `Search results in test titles or descriptions for query 🔎"${q}".`
        : 'Our website offers tests on esotericism, numerology, Tarot, astrology, Feng Shui, and other alternative sciences.'
    } Learn more about yourself and the world around you!`,
    keywords:
      'esotericism, numerology, Tarot, astrology, Feng Shui, alternative sciences, tests',
  }),
};

export const META_TESTS_PAGINATED: Record<
  ELanguage,
  (page: number, q?: string) => IMeta
> = {
  [UA]: (page: number, q?: string) => ({
    title: `Сторінка ${page} - Тести: Езотерика, Психологія, Нумерологія, Таро, Астрологія, Фен-шуй`,
    description: `Перегляньте ${page} сторінку списку наших тестів${q ? ` для пошукового запиту 🔎«${q}»` : ''}, де ви знайдете нові тести з езотерики, психології, нумерології, Таро, астрології, фен-шуй та інших нетрадиційних напрямків.`,
    keywords:
      'езотерика, нумерологія, Психологія, Таро, астрологія, фен-шуй, нетрадиційні науки, тести',
  }),
  [EN]: (page: number, q?: string) => ({
    title: `Page ${page} - Tests: Esotericism, Psychology, Numerology, Tarot, Astrology, Feng Shui`,
    description: `Browse page ${page} of our test list${
      q ? ` for search query 🔎"${q}"` : ''
    }, where you will find new tests on esotericism, psychology, numerology, Tarot, astrology, Feng Shui, and other alternative sciences.`,
    keywords:
      'esotericism, numerology, Psychology, Tarot, astrology, Feng Shui, alternative sciences, tests, page',
  }),
};

export const META_TESTS_CATEGORY: Record<
  ELanguage,
  (catName: string) => IMeta
> = {
  [UA]: (catName: string) => ({
    title: `${catName} - Тести`,
    description: `Тести, які відносяться до категорії «${catName}». Дізнайтеся більше про себе та світ навколо через тести, пов'язані з категорією «${catName}».`,
    keywords: `${catName}, тести, езотерика, нумерологія, Таро, астрологія, фен-шуй, нетрадиційні науки`,
  }),
  [EN]: (catName: string) => ({
    title: `${catName} - Tests`,
    description: `Tests related to the "${catName}" category. Learn more about yourself and the world around you through tests related to the "${catName}" category.`,
    keywords: `${catName}, tests, esotericism, numerology, Tarot, astrology, Feng Shui, alternative sciences`,
  }),
};

export const META_TESTS_CATEGORY_PAGINATED: Record<
  ELanguage,
  (catName: string, page: number) => IMeta
> = {
  [UA]: (catName: string, page: number) => ({
    title: `${catName} - Тести | Сторінка ${page}`,
    description: `${page} сторінка тестів, які відносяться до категорії «${catName}». Дізнайтеся більше про себе та світ навколо через тести, пов'язані з категорією «${catName}».`,
    keywords: `${catName}, тести, сторінка ${page}, езотерика, нумерологія, Таро, астрологія, фен-шуй, нетрадиційні науки`,
  }),
  [EN]: (catName: string, page: number) => ({
    title: `${catName} - Tests | Page ${page}`,
    description: `Page ${page} of tests related to the "${catName}" category. Learn more about yourself and the world around you through tests related to the "${catName}" category.`,
    keywords: `${catName}, tests, page ${page}, esotericism, numerology, Tarot, astrology, Feng Shui, alternative sciences`,
  }),
};

export const TESTS_H1 = {
  [UA]: 'Тести',
  [EN]: 'Test List',
};

export const TESTS_SEARCH_INPUT_PARAMS = {
  [UA]: {
    placeholder: 'Пошуковий запит...',
    inputAriaLabel: 'Пошук тестів',
    cancelAriaLabel: 'Очистити поле пошуку',
    submitAriaLabel: 'Розпочати пошук',
  },
  [EN]: {
    placeholder: 'Search query...',
    inputAriaLabel: 'Search tests',
    cancelAriaLabel: 'Clear search field',
    submitAriaLabel: 'Start search',
  },
};

export const TESTS_CARD_IMAGE = {
  defaultImgSrc: '/images/post/default_post_400.jpg',
  size: { width: 400, height: 400 },
};

export const TESTS_COUNT_CAPTION = {
  [EN]: 'Number of tests: ',
  [UA]: 'Кількість тестів: ',
};

export const TESTS_EXECUTION = {
  startBtnCaption: {
    [UA]: 'Почати тест',
    [EN]: 'Start testing',
  },
  dialogDescription: {
    [EN]: 'Answer the questions to discover your result.',
    [UA]: 'Зробіть свій вибір, щоб дізнатися результат.',
  },
  closeBtnCaption: {
    [UA]: 'Закрити',
    [EN]: 'Close',
  },
  nextBtnCaption: {
    [UA]: 'Далі',
    [EN]: 'Next',
  },
  conclusionBtnCaption: {
    [EN]: 'See Conclusion',
    [UA]: 'Дивитись висновок',
  },
  conclusionTitle: {
    [EN]: 'Conclusion',
    [UA]: 'Висновок',
  },
  fieldsetConclusionLegend: {
    [UA]: 'Результат',
    [EN]: 'Result',
  },
};

export const TESTS_PAGINATION_PARAMS = {
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
  [UA]: `Перейти до проходження тесту "${title}"`,
  [EN]: `Go to test "${title}"`,
});
