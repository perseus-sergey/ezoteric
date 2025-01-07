import { ELanguage } from './language.model';

const { UA, EN } = ELanguage;

export const CHAT = {
  chatBtn: {
    caption: {
      [UA]: 'Чат',
      [EN]: 'Chat',
    },
  },

  closeBtn: {
    ariaLabel: {
      [UA]: 'Закрити вікно чату',
      [EN]: 'Close chat window',
    },
  },
};
// const initialMessages: Message[] = [
//   {
//     id,
//     createdAt: new Date(),
//     content: `Вітаю Вас в чаті! Мене звати Езобот.
//       Я досвідчений фахівець в сфері езотеричних знань.
//       Я прикладу всі зусилля і мої знання щоб дати Вам відповіді на всі ваші запитання.`,
//     role: "assistant",
//   },
// ];
