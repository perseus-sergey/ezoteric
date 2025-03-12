import { ELanguage } from './language.model';

export const DEFAULT_META_OG = {
  siteName: 'Ezoteric',
  type: 'website',
  authors: ['https://github.com/perseus-sergey'],
};

export const BACKGROUND_IMG_ALT = {
  [ELanguage.EN]: 'Magical crystal landscape',
  [ELanguage.UA]: 'Чарівний кришталевий пейзаж',
};

export const SITE_DOMAIN = `${DEFAULT_META_OG.siteName}.net`;
