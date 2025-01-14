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
