import React from 'react';
import { ELanguage } from './language.model';
import { DEFAULT_META_OG } from './root.model';
import SeoSVG from '@/components/custom/SeoSVG';

const { UA, EN } = ELanguage;

export const HEADER_MODEL = {
  logo: {
    [UA]: `Логотип сайту з посиланням на початкову сторінку ${DEFAULT_META_OG.siteName}`,
    [EN]: `Site logo with link to the main page ${DEFAULT_META_OG.siteName}`,
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

type LanguageData = {
  caption: string;
  ariaLabel: string;
  icon: React.ReactNode;
};

export const LANGUAGE_SELECT: Record<ELanguage, LanguageData> = {
  [UA]: {
    caption: 'English',
    ariaLabel: 'Переключити мову на англійську',
    icon: (
      <SeoSVG strokeWidth={0.2} viewBox="0 0 36 36" className="size-6">
        <path
          fill="#00247D"
          d="M0 9.059V13h5.628zM4.664 31H13v-5.837zM23 25.164V31h8.335zM0 23v3.941L5.63 23zM31.337 5H23v5.837zM36 26.942V23h-5.631zM36 13V9.059L30.371 13zM13 5H4.664L13 10.837z"
        />
        <path
          fill="#CF1B2B"
          d="m25.14 23l9.712 6.801a4 4 0 0 0 .99-1.749L28.627 23zM13 23h-2.141l-9.711 6.8c.521.53 1.189.909 1.938 1.085L13 23.943zm10-10h2.141l9.711-6.8a4 4 0 0 0-1.937-1.085L23 12.057zm-12.141 0L1.148 6.2a4 4 0 0 0-.991 1.749L7.372 13z"
        />
        <path
          fill="#EEE"
          d="M36 21H21v10h2v-5.836L31.335 31H32a4 4 0 0 0 2.852-1.199L25.14 23h3.487l7.215 5.052c.093-.337.158-.686.158-1.052v-.058L30.369 23H36zM0 21v2h5.63L0 26.941V27c0 1.091.439 2.078 1.148 2.8l9.711-6.8H13v.943l-9.914 6.941c.294.07.598.116.914.116h.664L13 25.163V31h2V21zM36 9a3.98 3.98 0 0 0-1.148-2.8L25.141 13H23v-.943l9.915-6.942A4 4 0 0 0 32 5h-.663L23 10.837V5h-2v10h15v-2h-5.629L36 9.059zM13 5v5.837L4.664 5H4a4 4 0 0 0-2.852 1.2l9.711 6.8H7.372L.157 7.949A4 4 0 0 0 0 9v.059L5.628 13H0v2h15V5z"
        />
        <path fill="#CF1B2B" d="M21 15V5h-6v10H0v6h15v10h6V21h15v-6z" />
      </SeoSVG>
    ),
  },
  [EN]: {
    caption: 'Українська',
    ariaLabel: 'Switch language to Ukrainian',
    icon: (
      <SeoSVG strokeWidth={0.2} viewBox="0 0 64 64" className="size-6">
        <path
          fill="#1b75bb"
          d="M54 10H10C3.373 10 0 14.925 0 21v11h64V21c0-6.075-3.373-11-10-11"
        />
        <path
          fill="#f9cb38"
          d="M0 43c0 6.075 3.373 11 10 11h44c6.627 0 10-4.925 10-11V32H0z"
        />
      </SeoSVG>
    ),
  },
};

export const THEME_SELECT = {
  dark: {
    caption: {
      [EN]: 'Dark',
      [UA]: 'Темний',
    },
    ariaLabel: {
      [EN]: 'Toggle to dark mode',
      [UA]: 'Переключити на темний режим',
    },
  },

  light: {
    caption: {
      [EN]: 'Light',
      [UA]: 'Світлий',
    },
    ariaLabel: {
      [EN]: 'Toggle to light mode',
      [UA]: 'Переключити на світлий режим',
    },
  },
};

export const HEADER_LOGIN = {
  signin: {
    [EN]: 'Login',
    [UA]: 'Увійти',
  },
  signout: {
    [EN]: 'Sign out',
    [UA]: 'Вийти',
  },
};

export const SIDEBAR = {
  title: {
    [UA]: 'Меню сайту',
    [EN]: 'Site menu',
  },
  description: {
    [UA]: 'Навігаційне меню',
    [EN]: 'Navigation menu',
  },
};

export const FOOTER_MODEL = {
  title: { [UA]: `Контакти`, [EN]: 'Contact Us' },
  description: {
    [UA]: `Зв'яжіться з нами:`,
    [EN]: `Get in touch with us:`,
  },
  phone: {
    caption: { [UA]: 'Телефон', [EN]: 'Phone' },
    ariaLabel: {
      [UA]: 'Зателефонувати нам',
      [EN]: 'Call us',
    },
  },

  mail: {
    ariaLabel: {
      [UA]: 'Надіслати нам листа',
      [EN]: 'Send us an email',
    },
  },
};
