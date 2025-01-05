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

  links: {
    blog: {
      ariaLabel: {
        [UA]: 'Перейти на сторінку з постами блогу',
        [EN]: 'Go to the blog page',
      },
      caption: {
        [UA]: 'Блог',
        [EN]: 'Blog',
      },
    },
  },

  sideBarOpenIcon: {
    alt: {
      [UA]: 'Іконка кнопки відкриття прихованого меню',
      [EN]: 'Open hidden menu button icon',
    },
    ariaLabel: {
      [UA]: 'Відкрити бокове меню',
      [EN]: 'Open side menu',
    },
  },

  sideBarCloseIcon: {
    alt: {
      [UA]: 'Іконка закриття бокового меню',
      [EN]: 'Side menu close icon',
    },
    ariaLabel: {
      [UA]: 'Закрити бокове меню',
      [EN]: 'Close the side menu',
    },
  },
};
