import { ELanguage } from './language.model';
import { DEFAULT_META_OG, SITE_DOMAIN } from './root.model';

const { EN, UA } = ELanguage;

export const SCHEDULE_EMAIL = {
  subject: {
    [UA]: `Підтвердження бронювання сеансу на ${DEFAULT_META_OG.siteName}`,
    [EN]: `Booking confirmation for ${DEFAULT_META_OG.siteName}`,
  },

  getTitleDescription(time: string) {
    return {
      [UA]: `Ваш сеанс на ${time} успішно заброньовано.`,
      [EN]: `Your appointment at ${time} has been booked successfully.`,
    };
  },
  hello: {
    [UA]: 'Вітаю',
    [EN]: 'Hello',
  },
  dateCaption: {
    [UA]: 'Дата',
    [EN]: 'Date',
  },
  timeCaption: {
    [UA]: 'Час',
    [EN]: 'Time',
  },
  questionCaption: {
    [UA]: 'Ваше питання',
    [EN]: 'Your question',
  },
  autoGenerate: {
    [UA]: 'Цей лист було згенеровано автоматично.',
    [EN]: 'This email was automatically generated.',
  },
  additionalQuestion: {
    [UA]: "Якщо у вас з'являться додаткові питання, напишіть нам на пошту",
    [EN]: 'If you have any additional questions, please contact us at',
  },
  seeYou: {
    [UA]: 'До зустрічі!',
    [EN]: 'See you soon!',
  },
  sincerely: {
    [UA]: 'З повагою,',
    [EN]: 'Sincerely,',
  },
  team: {
    [UA]: `Команда ${SITE_DOMAIN}`,
    [EN]: `The ${SITE_DOMAIN} team`,
  },
};

export const BOOK_APPOINTMENT_ACTION = {
  timeNotFound: {
    [UA]: 'Обраний час сеансу не знайдено.',
    [EN]: 'The selected appointment time was not found.',
  },
  timeBooked: {
    [UA]: 'Обраний час сеансу вже заброньовано.',
    [EN]: 'The selected appointment time is already booked.',
  },
  errorDbBooked: {
    [UA]: 'Не вдалося забронювати час сеансу в базі даних.',
    [EN]: 'Failed to book the appointment time in the database.',
  },
  errorSendMailToUser: {
    [UA]: 'Помилка відправлення email користувачу, але бронювання збережено:',
    [EN]: 'Error sending email to user, but booking saved:',
  },
  errorSendMailToAdmin: {
    [UA]: 'Помилка відправлення email адміністратору:',
    [EN]: 'Error sending email to admin:',
  },
  bookingConsoleError: {
    [UA]: 'Помилка бронювання сеансу:',
    [EN]: 'Booking error:',
  },
  bookingError: {
    [UA]: 'Не вдалося забронювати сеанс. Спробуйте зайти пізніше.',
    [EN]: 'Failed to book an appointment. Please try again later.',
  },
};
