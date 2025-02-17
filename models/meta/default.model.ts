import { ELanguage } from '../language.model';

export interface IMeta {
  title: string;
  description: string;
  keywords: string;
}

export const DEFAULT_META_DATA = {
  [ELanguage.UA]: {
    title: 'Нумерологія та Таро — таємниці та відповіді',
    description:
      'Дізнайтеся про нумерологію, Таро та інші езотеричні практики. Відкрийте для себе таємниці чисел, символів та отримайте відповіді на життєві питання.',
    keywords:
      'нумерологія, таро, езотерика, значення чисел, символи, передбачення, духовні практики',
  },

  [ELanguage.EN]: {
    title: 'Numerology and Tarot — Secrets and Answers',
    description:
      "Discover the world of numerology, Tarot, and other esoteric practices. Unlock the mysteries of numbers, symbols, and find answers to life's questions.",
    keywords:
      'numerology, tarot, esoterics, number meanings, symbols, divination, spiritual practices',
  },
};
