import { ELanguage } from './language.model';
import { IMeta } from './meta/default.model';
import { DEFAULT_META_OG } from './root.model';

const { EN, UA } = ELanguage;

export interface ISiteAddress {
  street: string;
  number: string;
  city: string;
  region: string;
  zip: string;
  country: string;
}

export const siteAddress: Record<ELanguage, ISiteAddress> = {
  [EN]: {
    street: 'Shevchnko',
    number: '94',
    city: 'Kremenchuk',
    region: 'Poltava',
    zip: '39600',
    country: 'Ukraine',
  },
  [UA]: {
    street: 'Шевченко',
    number: '94',
    city: 'Кременчук',
    region: 'Полтавська',
    zip: '39600',
    country: 'Україна',
  },
  // [EN]: {
  //   street: 'Filikis Eterias',
  //   number: '17',
  //   city: 'Glifada',
  //   region: 'Athens',
  //   zip: '16674',
  //   country: 'Greece',
  // },
};

export const META_PRIVACY: Record<ELanguage, IMeta> = {
  [UA]: {
    title: `Політика Конфіденційності | ${DEFAULT_META_OG.siteName}`,
    description: `Дізнайтеся, як ${DEFAULT_META_OG.siteName} збирає, використовує, захищає та передає вашу особисту інформацію. Ознайомтеся з вашими правами на конфіденційність.`,
    keywords: `політика конфіденційності, ${DEFAULT_META_OG.siteName}, приватність, захист даних, GDPR, права користувача`,
  },
  [EN]: {
    title: `Privacy Policy | ${DEFAULT_META_OG.siteName}`,
    description: `Learn how ${DEFAULT_META_OG.siteName} collects, uses, protects, and shares your personal information. Understand your privacy rights.`,
    keywords: `privacy policy, ${DEFAULT_META_OG.siteName}, privacy, data protection, GDPR, user rights`,
  },
};

export const META_COOKIE: Record<ELanguage, IMeta> = {
  [UA]: {
    title: `Політика використання файлів cookie | ${DEFAULT_META_OG.siteName}`,
    description: `Огляд використання файлів cookie та подібних технологій на ${DEFAULT_META_OG.siteName}. Дізнайтеся про типи файлів cookie та як керувати своїми налаштуваннями.`,
    keywords: `cookie політика, файли cookie, ${DEFAULT_META_OG.siteName}, кукі, налаштування cookie, відстеження`,
  },
  [EN]: {
    title: `Cookie Policy | ${DEFAULT_META_OG.siteName}`,
    description: `Overview of how ${DEFAULT_META_OG.siteName} uses cookies and similar technologies. Learn about cookie types and how to manage your preferences.`,
    keywords: `cookie policy, cookies, ${DEFAULT_META_OG.siteName}, manage cookies, tracking technologies`,
  },
};

export const META_TERMS: Record<ELanguage, IMeta> = {
  [UA]: {
    title: `Правила та Умови | ${DEFAULT_META_OG.siteName}`,
    description: `Ознайомтеся з офіційними Правилами та Умовами, що регулюють ваш доступ та використання веб-сайту ${DEFAULT_META_OG.siteName} та його послуг. Дізнайтеся про ваші права, обов'язки та обмеження відповідальності.`,
    keywords: `правила та умови, умови використання, ${DEFAULT_META_OG.siteName}, юридичні умови, угода користувача, права користувача, обов'язки користувача, обмеження відповідальності`,
  },
  [EN]: {
    title: `Terms and Conditions | ${DEFAULT_META_OG.siteName}`,
    description: `Review the official Terms and Conditions governing your access to and use of the ${DEFAULT_META_OG.siteName} website and its services. Understand your rights, obligations, and the limitations of liability.`,
    keywords: `terms and conditions, terms of use, terms of service, ${DEFAULT_META_OG.siteName}, legal terms, user agreement, user rights, user obligations, liability limitation`,
  },
};
