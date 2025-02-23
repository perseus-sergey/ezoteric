import { parseISO, subYears } from 'date-fns';
import { ELanguage } from '../language.model';
import * as z from 'zod';

const { EN, UA } = ELanguage;

export const NUMEROLOGY_FORM_MODEL = {
  title: {
    [UA]: `Дізнайтеся про себе`,
    [EN]: 'Discover Yourself',
  },
  text: {
    [UA]: [
      `Введіть своє ім'я та дату народження, щоб отримати базову інформацію про вашу особистість`,
    ],
    [EN]: [
      `Enter your name and date of birth to receive basic information about your personality`,
    ],
  },

  numerologyForm: {
    name: {
      label: {
        [EN]: 'Full Name:',
        [UA]: "Повне ім'я",
      },
      placeholder: {
        [UA]: "Введіть своє повне ім'я",
        [EN]: 'Enter your full name',
      },
    },
    birthdate: {
      label: {
        [UA]: 'Дата народження',
        [EN]: 'Date of Birth',
      },
      caption: {
        [EN]: 'Pick a date',
        [UA]: 'Виберіть дату',
      },
    },
    submit: {
      title: {
        [UA]: 'Отримати інформацію',
        [EN]: 'Get Information',
      },
      pending: {
        [EN]: 'Please wait',
        [UA]: 'Зачекайте',
      },
    },

    system: {
      label: {
        [EN]: 'Numerology System',
        [UA]: 'Система нумерології',
      },
      pythagorean: {
        [EN]: 'Pythagorean',
        [UA]: 'Піфагорійська',
      },
      chaldean: {
        [EN]: 'Chaldean',
        [UA]: 'Халдейська',
      },
    },

    resultDescription: {
      title: {
        [EN]: 'For the most accurate results:',
        [UA]: 'Для більш повного результату:',
      },
      texts: {
        [EN]: [
          'Please provide your full name (including surname and any middle names) when filling out the form. This allows for a more comprehensive and insightful numerological analysis.',
        ],
        [UA]: [
          `Будьте уважні при заповненні форми, введіть ваше повне ім'я (з урахуванням прізвища та бажано по батькові). Це дозволяє надати більш конкретний і повний результат.`,
        ],
      },
    },
  },
};

export const MODAL_NUMEROLOGY = {
  modalCaption: {
    [UA]: `Дізнайтеся про себе`,
    [EN]: 'Discover Yourself',
  },

  modalDescription: {
    [EN]: 'Numerology results for',
    [UA]: 'Результати нумерології для',
  },

  modalCloseBtn: {
    [UA]: `Закрити`,
    [EN]: 'Close',
  },

  modalResponseParams: {
    lifePathNumberCaption: {
      [UA]: 'Число Життєвого Шляху',
      [EN]: 'Life Path Number',
    },
    soulNumberCaption: {
      [UA]: 'Число Душі (Бажання серця)',
      [EN]: 'Soul Number (Desire of Heart)',
    },
    personalityNumberCaption: {
      [UA]: 'Число Особистості (Як тебе сприймають інші)',
      [EN]: 'Personality Number (How others perceive you)',
    },
    destinyNumberCaption: {
      [UA]: 'Число Долі (Місія в житті)',
      [EN]: 'Destiny Number (Your Purpose in Life)',
    },

    overallInterpretationCaption: {
      [EN]: 'Overall Interpretation',
      [UA]: 'Загальна Інтерпретація',
    },
  },

  modalResponseErrors: {
    [UA]: [
      `Під час виконання запиту сталася помилка.`,
      `Будь ласка, спробуйте пізніше.`,
    ],
    [EN]: [
      `An error occurred while executing the request.`,
      `Please try again later.`,
    ],
  },
};

export interface INumerologyResults {
  lifePathNumber: number;
  soulNumber: number;
  personalityNumber: number;
  destinyNumber: number;
  lifePathInvolvedNumbers: number[];
  soulInvolvedNumbers: number[];
  destinyInvolvedNumbers: number[];
  personalityInvolvedNumbers: number[];

  formData: TNumerologySchema;

  lifePathNumberInterpretation: string;
  soulNumberInterpretation: string;
  destinyNumberInterpretation: string;
  personalityNumberInterpretation: string;
  overallInterpretation: string;
}

export const BIRTH_DATE_FORMAT = 'yyyy-MM-dd';

const errorMessages = {
  [UA]: {
    shortName: "Ім'я занадто коротке",
    wrongDate: 'Не коректний формат дати',
    toYang: 'Ваш вік повинен бути більше ніж 8 років',
    toOld: 'Ваш вік повинен бути менше ніж 150 років',
  },
  [EN]: {
    shortName: 'Name is too short',
    wrongDate: 'Invalid date format',
    toYang: 'You must be older than 8 years',
    toOld: 'You must be younger than 150 years',
  },
};

export enum ENumerologySystem {
  Pythagorean = 'pythagorean',
  Chaldean = 'chaldean',
}

export const numerologyFormSchema = (lang: ELanguage) =>
  z.object({
    numerologySystem: z.enum(
      [ENumerologySystem.Pythagorean, ENumerologySystem.Chaldean],
      {
        required_error: 'You need to select a numerology system.',
      }
    ),
    username: z.string().min(2, { message: errorMessages[lang]['shortName'] }),
    birthdate: z
      .string()
      .refine((val) => !isNaN(parseISO(val).getTime()), {
        message: errorMessages[lang]['wrongDate'],
      })
      .transform((val) => parseISO(val))
      .refine((date) => date < subYears(new Date(), 8), {
        message: errorMessages[lang]['toYang'],
      })
      .refine((date) => date > subYears(new Date(), 150), {
        message: errorMessages[lang]['toOld'],
      })
      .transform((date) => date.toISOString()),
  });

export type TNumerologySchema = z.infer<
  ReturnType<typeof numerologyFormSchema>
>;
