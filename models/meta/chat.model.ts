import { ELanguage } from "../language.model";

export const CHAT_LANG_MODEL = {
  chatTitle: {
    [ELanguage.UA]: "Чат",
    [ELanguage.EN]: "Chat",
  },
  overviewTexts: {
    [ELanguage.UA]: [
      `Будь ласка, введіть ваше запитання, або виберіть одне із запропонованих`,
    ],
    [ELanguage.EN]: [
      "Please enter your question, or choose one of the suggested options",
    ],
  },
};

export const chatSuggestedActions = [
  {
    title: {
      [ELanguage.UA]: "Я хочу замовити сеанс",
      [ELanguage.EN]: "I want to book a session",
    },
    label: {
      [ELanguage.UA]: "на певний час",
      [ELanguage.EN]: "on a specific time",
    },
    action: {
      [ELanguage.UA]: "Я хочу замовити сеанс на певний час",
      [ELanguage.EN]: "I want to book a session on a specific time",
    },
  },

  {
    title: {
      [ELanguage.UA]: "Я хочу замовити сеанс",
      [ELanguage.EN]: "I want to book a session",
    },
    label: {
      [ELanguage.UA]: "на певний час",
      [ELanguage.EN]: "on a specific time",
    },
    action: {
      [ELanguage.UA]: "Я хочу замовити сеанс на певний час",
      [ELanguage.EN]: "I want to book a session on a specific time",
    },
  },
];
