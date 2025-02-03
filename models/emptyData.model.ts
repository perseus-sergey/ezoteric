import { ELanguage } from './language.model';

const { UA, EN } = ELanguage;

export const EMPTY_DATA_MODEL = {
  text(query?: string) {
    return {
      [UA]: `На жаль, запит${query ? ` "${query}"` : ''} повернув порожній результат`,
      [EN]: `Unfortunately, the query${query ? ` "${query}"` : ''} returned an empty result`,
    };
  },

  imgAlt: {
    [UA]: 'Зображення для позначення порожнього результату',
    [EN]: 'Image for marking an empty result',
  },
};
