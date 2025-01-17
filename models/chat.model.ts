import { ELanguage } from './language.model';

const { UA, EN } = ELanguage;

export const LS_CHAT_NAME = 'ezo-chat';
export const LS_CHAT_MAX_MESSAGES = 200;

export const CHAT_MODEL = {
  chatTitle: {
    [UA]: 'Чат',
    [EN]: 'Chat',
  },
  overviewText: {
    [UA]: `Введіть або виберіть ваше запитання`,
    [EN]: `Enter or select your question`,
  },

  chatBtn: {
    caption: {
      [UA]: 'Чат',
      [EN]: 'Chat',
    },
    ariaLabel: {
      [UA]: 'Відкрити вікно чату',
      [EN]: 'Open chat widget',
    },
  },

  closeBtn: {
    ariaLabel: {
      [UA]: 'Закрити вікно чату',
      [EN]: 'Close chat window',
    },
  },
};

export const chatSuggestedActions = [
  // {
  //   title: {
  //     [UA]: 'Я хочу замовити сеанс',
  //     [EN]: 'I want to book a session',
  //   },
  //   label: {
  //     [UA]: 'на певний час',
  //     [EN]: 'on a specific time',
  //   },
  //   action(lang: ELanguage) {
  //     return `${this.title[lang]} ${this.label[lang]}`;
  //   },
  // },

  {
    title: {
      [UA]: 'Який головний урок я маю засвоїти зараз',
      [EN]: 'What is the main lesson I need to learn in my life',
    },
    label: {
      [UA]: 'у своєму житті?',
      [EN]: 'right now?',
    },
    action(lang: ELanguage) {
      return `${this.title[lang]} ${this.label[lang]}`;
    },
  },

  {
    title: {
      [UA]: 'Що я можу зробити, щоб притягнути у своє життя',
      [EN]: 'What can I do to attract abundance and happiness',
    },
    label: {
      [UA]: 'достаток і щастя?',
      [EN]: 'into my life?',
    },
    action(lang: ELanguage) {
      return `${this.title[lang]} ${this.label[lang]}`;
    },
  },

  {
    title: {
      [UA]: 'Що мене чекає у коханні, кар’єрі',
      [EN]: 'What is my future in love, career,',
    },
    label: {
      [UA]: 'чи особистому зростанні?',
      [EN]: 'or personal growth?',
    },
    action(lang: ELanguage) {
      return `${this.title[lang]} ${this.label[lang]}`;
    },
  },

  {
    title: {
      [UA]: 'Чи є людина, про яку я думаю, моєю',
      [EN]: 'Is the person I’m thinking about',
    },
    label: {
      [UA]: 'спорідненою душею?',
      [EN]: 'my soulmate?',
    },
    action(lang: ELanguage) {
      return `${this.title[lang]} ${this.label[lang]}`;
    },
  },

  {
    title: {
      [UA]: "Чи зміцниться мій поточний зв'язок,",
      [EN]: 'Will my current relationship grow stronger, or is it',
    },
    label: {
      [UA]: 'чи краще відпустити?',
      [EN]: 'time to let go?',
    },
    action(lang: ELanguage) {
      return `${this.title[lang]} ${this.label[lang]}`;
    },
  },

  {
    title: {
      [UA]: 'Яким знаком зодіаку у мене найбільша сумісність відповідно до моєї дати',
      [EN]: 'Which zodiac sign is most compatible with me based on my',
    },
    label: {
      [UA]: 'народження?',
      [EN]: 'date of birth?',
    },
    action(lang: ELanguage) {
      return `${this.title[lang]} ${this.label[lang]}`;
    },
  },
];

// export const initialMessages: Message[] = [
//   {
//     id: '',
//     createdAt: new Date(),
//     content: `Вітаю Вас в чаті! Мене звати Езобот.
//       Я досвідчений фахівець в сфері езотеричних знань.
//       Я прикладу всі зусилля і мої знання щоб дати Вам відповіді на всі ваші запитання.`,
//     role: 'assistant',
//   },
//   {
//     id: '1',
//     createdAt: new Date(),
//     content: `Я звичайний юзер`,
//     role: 'user',
//   },
// ];
