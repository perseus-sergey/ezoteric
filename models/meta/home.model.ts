import { parseISO, subYears } from 'date-fns';
import { ELanguage } from '../language.model';
import * as z from 'zod';

export const MAIN_TEXT = {
  h1: {
    [ELanguage.UA]:
      'Розкрий свій внутрішній потенціал: пізнай світ езотеричної мудрості',
    [ELanguage.EN]:
      'Unlock Your Inner Potential: Explore the World of Esoteric Wisdom',
  },
  h1_p: {
    [ELanguage.UA]: [
      `Ezoteric.net – це ваш провідник у світ езотеричних знань. Ми
          пропонуємо професійні консультації з Human Design, нумерології, Таро,
          Священної Геометрії, астрології, ангелософії, Фен-Шуй та інших
          нетрадиційних наук. Наша місія – допомогти вам зрозуміти себе, свій
          потенціал та шлях до гармонійного життя.`,
    ],
    [ELanguage.EN]: [
      `Ezoteric.net is your guide to the world of esoteric knowledge. We
          offer professional consultations in Human Design, Numerology, Tarot,
          Sacred Geometry, Astrology, Angelosophy, Feng Shui, and other
          unconventional sciences. Our mission is to help you understand
          yourself, your potential, and the path to a harmonious life.`,
    ],
  },
  h1_img_alt: {
    [ELanguage.UA]:
      'Людина медитує у природі на заході сонця під зоряним небом.',
    [ELanguage.EN]:
      'Person meditating peacefully in nature at twilight under a starry sky.',
  },

  h2_1: { [ELanguage.UA]: `Наші послуги`, [ELanguage.EN]: 'Our Services' },
  h2_1_p: {
    [ELanguage.UA]: [
      `Ми пропонуємо різноманітні персоналізовані послуги, які допоможуть вам глибше зрозуміти себе та свій життєвий шлях.`,
    ],
    [ELanguage.EN]: [
      'We offer a variety of personalized services to help you gain a deeper understanding of yourself and your life path.',
    ],
  },
  h2_1_ul: {
    [ELanguage.UA]: [
      [`Human Design`, `Відкрий свій унікальний енергетичний план.`],
      [`Нумерологія`, `Розкрий прихований зміст своїх чисел.`],
      [
        `Гадання на картах Таро`,
        `Отримай ясність та розуміння своєї поточної ситуації.`,
      ],
      [`Священна Геометрія`, `Досліджуй фундаментальні візерунки всесвіту.`],
      [`Астрологія`, `Зрозумій вплив космосу на своє життя.`],
      [`Ангелософія`, `Зв'яжися з ангельською мудрістю та керівництвом.`],
      [
        `Фен-Шуй`,
        `Гармонізуй свій життєвий простір для оптимального благополуччя.`,
      ],
    ],
    [ELanguage.EN]: [
      ['Human Design', 'Discover your unique energetic blueprint.'],
      ['Numerology', 'Uncover the hidden meanings behind your numbers.'],
      [
        'Tarot Card Reading',
        'Gain clarity and insight into your current situation.',
      ],
      ['Sacred Geometry', 'Explore the fundamental patterns of the universe.'],
      ['Astrology', 'Understand the influence of the cosmos on your life.'],
      ['Angelosophy', 'Connect with angelic wisdom and guidance.'],
      ['Feng Shui', 'Harmonize your living space for optimal well-being.'],
    ],
  },
  h2_1_img_alt: {
    [ELanguage.UA]:
      'Людина медитує у природі на заході сонця під зоряним небом.',
    [ELanguage.EN]:
      'Person meditating peacefully in nature at twilight under a starry sky.',
  },

  h2_2: {
    [ELanguage.UA]: `Дізнайтеся про себе`,
    [ELanguage.EN]: 'Discover Yourself',
  },
  h2_2_p: {
    [ELanguage.UA]: [
      `Введіть своє ім'я та дату народження, щоб отримати базову інформацію про вашу особистість:`,
    ],
    [ELanguage.EN]: [
      `Enter your name and date of birth to receive basic information about your personality:`,
    ],
  },

  numerologyForm: {
    name: {
      label: {
        [ELanguage.EN]: 'Full Name:',
        [ELanguage.UA]: "Повне ім'я",
      },
      placeholder: {
        [ELanguage.UA]: "Введіть своє повне ім'я",
        [ELanguage.EN]: 'Enter your full name',
      },
    },
    birthdate: {
      label: {
        [ELanguage.UA]: 'Дата народження',
        [ELanguage.EN]: 'Date of Birth',
      },
      caption: {
        [ELanguage.EN]: 'Pick a date',
        [ELanguage.UA]: 'Виберіть дату',
      },
    },
    submit: {
      title: {
        [ELanguage.UA]: 'Отримати інформацію',
        [ELanguage.EN]: 'Get Information',
      },
      pending: {
        [ELanguage.EN]: 'Please wait',
        [ELanguage.UA]: 'Зачекайте',
      },
    },

    resultDescription: {
      title: {
        [ELanguage.EN]: 'For the most accurate results:',
        [ELanguage.UA]: 'Для більш повного результату:',
      },
      texts: {
        [ELanguage.EN]: [
          'Please provide your full name (including surname and any middle names) when filling out the form. This allows for a more comprehensive and insightful numerological analysis.',
        ],
        [ELanguage.UA]: [
          `Будьте уважні при заповненні форми, введіть ваше повне ім'я (з урахуванням прізвища та бажано по батькові). Це дозволяє надати більш конкретний і повний результат.`,
        ],
      },
    },
  },
};

export const MODAL_NUMEROLOGY = {
  modalCaption: {
    [ELanguage.UA]: `Дізнайтеся про себе`,
    [ELanguage.EN]: 'Discover Yourself',
  },

  modalDescription: {
    [ELanguage.EN]: 'Numerology results for',
    [ELanguage.UA]: 'Результати нумерології для',
  },

  modalCloseBtn: {
    [ELanguage.UA]: `Закрити`,
    [ELanguage.EN]: 'Close',
  },

  modalResponseParams: {
    lifePathNumber: {
      [ELanguage.EN]: 'Life Path Number',
      [ELanguage.UA]: 'Число Життєвого Шляху',
    },
    destinyNumber: {
      [ELanguage.EN]: 'Destiny Number',
      [ELanguage.UA]: 'Число Долі',
    },
    personalityNumber: {
      [ELanguage.EN]: 'Personality Number',
      [ELanguage.UA]: 'Число Особистості',
    },
    overallInterpretation: {
      [ELanguage.EN]: 'Overall Interpretation',
      [ELanguage.UA]: 'Загальна Інтерпретація',
    },
  },

  modalResponseErrors: {
    [ELanguage.UA]: [
      `На жаль, під час виконання сталася помилка.`,
      `Будь ласка, спробуйте пізніше.`,
    ],
    [ELanguage.EN]: [
      `An error occurred while executing the request.`,
      `Please try again later.`,
    ],
  },
};

export interface INumerologyJsonSchema {
  lifePathNumber: number;
  destinyNumber: number;
  personalityNumber: number;
  lifePathNumberInterpretation: string;
  destinyNumberInterpretation: string;
  personalityNumberInterpretation: string;
  overallInterpretation: string;
}

export interface IModalAiResponseProps {
  aiResponse: INumerologyJsonSchema | null;
  formData: z.infer<typeof numerologyFormSchema>;
}

export const BIRTH_DATE_FORMAT = 'yyyy-MM-dd';

export const numerologyFormSchema = z.object({
  username: z.string().min(2, { message: "Ім'я занадто коротке" }),
  birthdate: z
    .string()
    .refine((val) => !isNaN(parseISO(val).getTime()), {
      message: 'Не коректний формат дати',
    })
    .transform((val) => parseISO(val))
    .refine((date) => date < subYears(new Date(), 8), {
      message: 'Ваш вік повинен бути більше ніж 8 років',
    })
    .refine((date) => date > subYears(new Date(), 150), {
      message: 'Ваш вік повинен бути менше ніж 150 років',
    })
    .transform((date) => date.toISOString()),
});
