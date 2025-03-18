import { NumerologyHtml } from '@/components/custom/NumerologyHtml';
import { ELanguage } from '../language.model';
import { ReactNode } from 'react';
import { SITE_DOMAIN } from '../root.model';

const { EN, UA } = ELanguage;

export const MAIN_TEXT = {
  h1: {
    [UA]: 'Розкрий свій внутрішній потенціал: пізнай світ езотеричної мудрості',
    [EN]: 'Unlock Your Inner Potential: Explore the World of Esoteric Wisdom',
  },
  startBlock: {
    [UA]: (
      <p>
        <strong>{SITE_DOMAIN}</strong> – це ваш провідник у світ езотеричних
        знань. Пориньте у стародавні мистецтва Фен-Шуй та Сакральної Геометрії,
        щоб гармонізувати своє оточення та узгодитися з природним потоком
        енергії. Дослідіть глибини своєї підсвідомості за допомогою Ансіології
        та отримайте глибше розуміння своїх мотивів та бажань.
      </p>
    ),
    [EN]: (
      <p>
        <strong>{SITE_DOMAIN}</strong> is your guide to the world of esoteric
        knowledge. Delve into the ancient arts of Feng Shui and Sacred Geometry
        to harmonize your surroundings and align with the natural flow of
        energy. Explore the depths of your subconscious through Ansiology and
        gain a deeper understanding of your motivations and desires.
      </p>
    ),
  },
  startBlockImgAlt: {
    [UA]: 'У затишному лісі під зоряним небом, біля підніжжя водоспаду, людина знаходить спокій у медитації. Далеко видніється силует японського храму, що додає містики цій сцені.',
    [EN]: 'In a serene forest under a starry sky, at the foot of a waterfall, a person finds peace in meditation. The silhouette of a Japanese temple can be seen in the distance, adding to the mystical ambiance of the scene.',
  },

  ourServices: {
    title: {
      [UA]: `Наші послуги`,
      [EN]: 'Our Services',
    },

    text: {
      [UA]: (
        <p>
          Відправтесь у подорож самопізнання та дослідіть таємниці Всесвіту з
          нашими комплексними езотеричними послугами. Незалежно від того, чи
          шукаєте ви керівництва мудрістю Таро, проникливості Астрології,
          точності Нумерології чи трансформаційної сили Human Design, ми тут,
          щоб освітити ваш шлях. Наші досвідчені практики пропонують
          персоналізовані консультації, адаптовані до ваших унікальних потреб.
          Отримайте ясність, знайдіть свою мету та розширте свої можливості, щоб
          створити життя, якого ви бажаєте.
        </p>
      ),
      [EN]: (
        <p>
          Embark on a journey of self-discovery and explore the mysteries of the
          universe with our comprehensive esoteric services. Whether you seek
          guidance through the wisdom of Tarot, the insights of Astrology, the
          precision of Numerology, or the transformative power of Human Design,
          we are here to illuminate your path. Our experienced practitioners
          offer personalized consultations tailored to your unique needs. Gain
          clarity, find your purpose, and empower yourself to create the life
          you desire.,
        </p>
      ),
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
};

export const NUMEROLOGY_JSX: Record<ELanguage, ReactNode> = {
  [UA]: <NumerologyHtml lang={UA} />,
  [EN]: <NumerologyHtml lang={EN} />,
};

export const SIMILAR_BLOCK = {
  articles: {
    [UA]: 'Нові статті',
    [EN]: 'New Articles',
  },
  tests: {
    [UA]: 'Останні тести',
    [EN]: 'Latest Tests',
  },
};
