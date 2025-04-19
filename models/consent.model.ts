import { ELanguage } from './language.model';

const { UA, EN } = ELanguage;

export const COOKIES_CONSENT = {
  [EN]: {
    consentModal: {
      title: 'We use cookies',
      description:
        'This website uses essential cookies to ensure its proper operation and tracking cookies to understand how you interact with it. The latter will be set only after consent.',
      acceptAllBtn: 'Accept all',
      acceptNecessaryBtn: 'Reject all',
      showPreferencesBtn: 'Manage Individual preferences',
    },
    preferencesModal: {
      title: 'Manage cookie preferences',
      acceptAllBtn: 'Accept all',
      acceptNecessaryBtn: 'Reject all',
      savePreferencesBtn: 'Accept current selection',
      closeIconLabel: 'Close modal',
      sections: [
        {
          title: 'Cookie usage',
          description:
            'We use cookies to ensure the basic functionalities of the website and to enhance your online experience.',
        },
        {
          title: 'Strictly necessary cookies',
          description:
            'These cookies are essential for the proper functioning of the website, for example for user authentication.',
          linkedCategory: 'necessary',
        },
        {
          title: 'Analytics',
          description:
            'Cookies used for analytics help collect data that allows services to understand how users interact with a particular service. These insights allow services both to improve content and to build better features that improve the user’s experience.',
          linkedCategory: 'analytics',
        },
        {
          title: 'Functionality',
          description:
            'These cookies enable additional functionality and services, such as embedded video players or social media features.',
          linkedCategory: 'functionality',
        },
        {
          title: 'More information',
          description:
            'When you visit any website, it may store or retrieve information on your browser, mostly in the form of cookies. This information might be about you, your preferences or your device and is mostly used to make the site work as you expect it to. The information does not usually directly identify you, but it can give you a more personalized web experience. Because we respect your right to privacy, you can choose not to allow some types of cookies. Click on the different category headings to find out more and change our default settings. However, blocking some types of cookies may impact your experience of the site and the services we are able to offer.<br><a href="https://cookiepedia.co.uk/giving-consent-to-cookies">Read more...</a>',
        },
      ],
    },
  },
  [UA]: {
    consentModal: {
      title: 'Ми використовуємо файли cookie',
      description:
        'Цей веб-сайт використовує необхідні файли cookie для забезпечення належної роботи та файли cookie відстеження, щоб зрозуміти, як ви з ним взаємодієте. Останні будуть встановлені лише після отримання згоди.',
      acceptAllBtn: 'Прийняти всі',
      acceptNecessaryBtn: 'Відхилити всі',
      showPreferencesBtn: 'Керувати індивідуальними налаштуваннями',
    },
    preferencesModal: {
      title: 'Керування налаштуваннями файлів cookie',
      acceptAllBtn: 'Прийняти всі',
      acceptNecessaryBtn: 'Відхилити всі',
      savePreferencesBtn: 'Прийняти поточний вибір',
      closeIconLabel: 'Закрити модальне вікно',
      sections: [
        {
          title: 'Використання файлів cookie',
          description:
            'Ми використовуємо файли cookie для забезпечення основних функцій веб-сайту та покращення вашого онлайн-досвіду.',
        },
        {
          title: 'Строго необхідні файли cookie',
          description:
            'Ці файли cookie необхідні для належного функціонування веб-сайту, наприклад, для аутентифікації користувача.',
          linkedCategory: 'necessary',
        },
        {
          title: 'Аналітика',
          description:
            'Файли cookie, що використовуються для аналітики, допомагають збирати дані, які дозволяють службам зрозуміти, як користувачі взаємодіють із певною службою. Ці відомості дозволяють службам покращувати контент і створювати кращі функції, які покращують досвід користувача.',
          linkedCategory: 'analytics',
        },
        {
          title: 'Функціональність',
          description:
            'Ці файли cookie забезпечують додаткову функціональність та послуги, такі як вбудовані відеопрогравачі або функції соціальних мереж.',
          linkedCategory: 'functionality',
        },
        {
          title: 'Більше інформації',
          description:
            'Коли ви відвідуєте будь-який веб-сайт, він може зберігати або отримувати інформацію у вашому браузері, переважно у вигляді файлів cookie. Ця інформація може стосуватися вас, ваших уподобань або вашого пристрою та переважно використовується для того, щоб сайт працював так, як ви очікуєте. Зазвичай ця інформація безпосередньо не ідентифікує вас, але вона може надати вам більш персоналізований досвід користування веб-сайтом. Оскільки ми поважаємо ваше право на конфіденційність, ви можете не дозволяти використання деяких типів файлів cookie. Натисніть на заголовки різних категорій, щоб дізнатися більше та змінити наші налаштування за замовчуванням. Однак блокування деяких типів файлів cookie може вплинути на ваш досвід користування сайтом та послугами, які ми можемо запропонувати.<br><a href="https://cookiepedia.co.uk/giving-consent-to-cookies">Дізнатися більше...</a>',
        },
      ],
    },
  },
};
