import { ELanguage } from './language.model';

export const DEFAULT_META_OG = {
  siteName: 'Ezoteric',
  type: 'website',
  authors: ['https://github.com/perseus-sergey'],
};

const { EN, UA } = ELanguage;

export const HEADER_MODEL = {
  logo: {
    [UA]: `Перейти на початкову сторінку ${DEFAULT_META_OG.siteName}`,
    [EN]: `Go to the ${DEFAULT_META_OG.siteName} homepage`,
  },
};
