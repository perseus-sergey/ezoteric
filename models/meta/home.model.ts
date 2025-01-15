import { parseISO, subYears } from 'date-fns';
import { ELanguage } from '../language.model';
import * as z from 'zod';

const { EN, UA } = ELanguage;

export const MAIN_TEXT = {
  h1: {
    [UA]: 'Розкрий свій внутрішній потенціал: пізнай світ езотеричної мудрості',
    [EN]: 'Unlock Your Inner Potential: Explore the World of Esoteric Wisdom',
  },
  startText: {
    [UA]: [
      `Ezoteric.net – це ваш провідник у світ езотеричних знань. 
      Пориньте у стародавні мистецтва Фен-Шуй та Сакральної Геометрії, 
      щоб гармонізувати своє оточення та узгодитися з природним потоком енергії.  
      Дослідіть глибини своєї підсвідомості за допомогою Ансіології та отримайте 
      глибше розуміння своїх мотивів та бажань.`,
    ],
    [EN]: [
      `Ezoteric.net is your guide to the world of esoteric knowledge. 
      Delve into the ancient arts of Feng Shui and Sacred Geometry to harmonize your surroundings and align with the natural flow of energy.
      Explore the depths of your subconscious through Ansiology and gain a deeper understanding of your motivations and desires.`,
    ],
  },
  startTextImgAlt: {
    [UA]: 'У затишному лісі під зоряним небом, біля підніжжя водоспаду, людина знаходить спокій у медитації. Далеко видніється силует японського храму, що додає містики цій сцені.',
    [EN]: 'In a serene forest under a starry sky, at the foot of a waterfall, a person finds peace in meditation. The silhouette of a Japanese temple can be seen in the distance, adding to the mystical ambiance of the scene.',
  },

  ourServices: {
    title: {
      [UA]: `Наші послуги`,
      [EN]: 'Our Services',
    },

    text: {
      [UA]: [
        `Відправтесь у подорож самопізнання та дослідіть таємниці Всесвіту з нашими комплексними езотеричними послугами. 
        Незалежно від того, чи шукаєте ви керівництва мудрістю Таро, проникливості Астрології, точності Нумерології чи трансформаційної сили Human Design, ми тут, щоб освітити ваш шлях. 
        Наші досвідчені практики пропонують персоналізовані консультації, адаптовані до ваших унікальних потреб. 
        Отримайте ясність, знайдіть свою мету та розширте свої можливості, щоб створити життя, якого ви бажаєте. 
        `,
      ],
      [EN]: [
        `Embark on a journey of self-discovery and explore the mysteries of the universe with our comprehensive esoteric services.
         Whether you seek guidance through the wisdom of Tarot, the insights of Astrology, the precision of Numerology, or the transformative power of Human Design, we are here to illuminate your path.
         Our experienced practitioners offer personalized consultations tailored to your unique needs.
         Gain clarity, find your purpose, and empower yourself to create the life you desire.`,
      ],
    },

    serviceList: {
      [UA]: [
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
      [EN]: [
        ['Human Design', 'Discover your unique energetic blueprint.'],
        ['Numerology', 'Uncover the hidden meanings behind your numbers.'],
        [
          'Tarot Card Reading',
          'Gain clarity and insight into your current situation.',
        ],
        [
          'Sacred Geometry',
          'Explore the fundamental patterns of the universe.',
        ],
        ['Astrology', 'Understand the influence of the cosmos on your life.'],
        ['Angelosophy', 'Connect with angelic wisdom and guidance.'],
        ['Feng Shui', 'Harmonize your living space for optimal well-being.'],
      ],
    },

    imgAlt: {
      [UA]: `Руки тримають різноманітні езотеричні предмети, такі як кристали, кубики, карти та пір'їну.`,
      [EN]: `Hands holding various esoteric items such as crystals, dice, cards, and a feather.`,
    },
  },

  numerForm: {
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

    form: {
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
    lifePathNumber: {
      [EN]: 'Life Path Number',
      [UA]: 'Число Життєвого Шляху',
    },
    destinyNumber: {
      [EN]: 'Destiny Number',
      [UA]: 'Число Долі',
    },
    personalityNumber: {
      [EN]: 'Personality Number',
      [UA]: 'Число Особистості',
    },
    overallInterpretation: {
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

export interface INumerologyJsonSchema {
  lifePathNumber: number;
  destinyNumber: number;
  personalityNumber: number;
  lifePathNumberInterpretation: string;
  destinyNumberInterpretation: string;
  personalityNumberInterpretation: string;
  overallInterpretation: string;
}

export type TNumerologySchema = ReturnType<typeof numerologyFormSchema>;

export interface IModalAiResponseProps {
  aiResponse: INumerologyJsonSchema | null;
  formData: z.infer<TNumerologySchema>;
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

export const numerologyFormSchema = (lang: ELanguage) =>
  z.object({
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
