import { ELanguage } from './language.model';

const { UA, EN } = ELanguage;

export const LOGOUT_MODAL = {
  title: {
    [UA]: 'Вихід з акаунту',
    [EN]: 'Logout from account',
  },

  description: {
    [UA]: 'Чи ви впевнені що бажаєте вийти зі свого акаунту?',
    [EN]: 'Are you sure you want to log out from your account?',
  },

  cancelBtn: {
    [UA]: 'Відмінити',
    [EN]: 'Cancel',
  },

  confirmBtn: {
    [UA]: 'Вийти з акаунту',
    [EN]: 'Logout',
  },
};
