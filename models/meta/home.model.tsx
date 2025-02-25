import { Title } from '@/components/custom/Title';
import { ELanguage } from '../language.model';
import { NumerologyPictogram } from '@/svg/NumerologyPictogram';
import { NUMEROLOGY_FORM_ID } from '../url.model';

const { EN, UA } = ELanguage;

const NumerologyHr = ({ lang }: { lang: ELanguage }) => (
  <div className="inline-flex items-center justify-center w-full">
    <hr className="w-64 h-px my-8 bg-foreground/20 border-0" />
    <div className="absolute px-4 -translate-x-1/2 bg-tertiary left-1/2">
      {/* <BasilLeaves lang={lang} className="size-8 text-foreground/80" /> */}
      <NumerologyPictogram lang={lang} className="size-5 text-foreground/50" />
    </div>
  </div>
);

export const MAIN_TEXT = {
  h1: {
    [UA]: 'Розкрий свій внутрішній потенціал: пізнай світ езотеричної мудрості',
    [EN]: 'Unlock Your Inner Potential: Explore the World of Esoteric Wisdom',
  },
  startBlock: {
    [UA]: (
      <p>
        <strong>Ezoteric.net</strong> – це ваш провідник у світ езотеричних
        знань. Пориньте у стародавні мистецтва Фен-Шуй та Сакральної Геометрії,
        щоб гармонізувати своє оточення та узгодитися з природним потоком
        енергії. Дослідіть глибини своєї підсвідомості за допомогою Ансіології
        та отримайте глибше розуміння своїх мотивів та бажань.
      </p>
    ),
    [EN]: (
      <p>
        <strong>Ezoteric.net</strong> is your guide to the world of esoteric
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

  numerologyBlock: {
    content: {
      [UA]: (
        <>
          <Title titleType="h2">
            Нумерологічний тест: розкрийте код своєї долі
          </Title>
          <section className="flex items-center justify-around flex-wrap md:flex-nowrap gap-8 py-6">
            <NumerologyPictogram
              className="shrink-0 size-36 text-tertiary-foreground/40"
              lang={UA}
            />

            <p className="mb-4">
              Числа супроводжують нас протягом усього життя, і нумерологія
              стверджує, що вони несуть в собі глибинний сенс та енергію. За
              допомогою нашого безкоштовного нумерологічного тесту ви зможете
              зануритися у світ чисел та отримати персональний нумерологічний
              аналіз, заснований на вашому імені та даті народження.
            </p>
          </section>

          <h3 className="text-xl font-semibold mb-2">
            Що ви дізнаєтесь за допомогою тесту:
          </h3>
          <ul className="list-disc list-inside">
            <li>
              <span className="font-semibold">Число Життєвого Шляху:</span>{' '}
              дізнайтеся про свій основний життєвий напрямок, таланти та
              виклики, що чекають на вас. Це число розкриває вашу унікальну
              місію та потенціал.
            </li>
            <li>
              <span className="font-semibold">Число Душі (Бажання серця):</span>{' '}
              відкрийте свої найглибші бажання, мотивацію та те, що дійсно
              наповнює ваше серце радістю та задоволенням.
            </li>
            <li>
              <span className="font-semibold">
                Число Особистості (Як вас сприймають інші):
              </span>{' '}
              зрозумійте, яке враження ви справляєте на оточуючих, та як вас
              бачать в соціальному світі. Це число розкриває вашу {'зовнішню'}{' '}
              особистість.
            </li>
            <li>
              <span className="font-semibold">Число Долі (Місія в житті):</span>{' '}
              розкрийте свою місію у цьому житті, ціль, до якої ви підсвідомо
              прагнете, та ваш внесок у світ.
            </li>
          </ul>

          <NumerologyHr lang={UA} />

          <p className="mb-4">
            Особливу увагу варто приділити{' '}
            <span className="font-semibold">Числу Особистості</span>. В нашому
            тесті ви можете розрахувати його, використовуючи{' '}
            <span className="font-semibold">дві різні системи нумерології</span>
            : Піфагорійську та Халдейську.
          </p>

          <p className="mb-4">
            <span className="font-semibold">Піфагорійська система</span>, більш
            поширена в західній нумерології, розглядає Число Особистості як
            відображення вашої{' '}
            <span className="font-semibold">зовнішньої манери поведінки</span>,
            того, як ви представляєте себе світу та яке{' '}
            <span className="font-semibold">перше враження</span> справляєте на
            людей. Вона фокусується на раціональних та соціальних аспектах вашої
            особистості.
          </p>

          <p className="mb-4">
            Натомість, <span className="font-semibold">Халдейська система</span>
            , що сягає корінням стародавнього Вавилону, пропонує глибший погляд
            на Число Особистості. Вона враховує{' '}
            <span className="font-semibold">
              вібраційну сутність вашого імені
            </span>
            , розкриваючи{' '}
            <span className="font-semibold">
              приховані аспекти вашої внутрішньої природи
            </span>
            , глибинну мотивацію та навіть{' '}
            <span className="font-semibold">кармічні впливи</span>, що формують
            вашу зовнішню особистість. Халдейська система може відкрити більш{' '}
            <span className="font-semibold">нюансоване та духовне</span>{' '}
            розуміння того, ким ви є насправді за маскою соціальних ролей.
          </p>

          <NumerologyHr lang={UA} />

          <h3 className="text-xl font-semibold mb-2">
            Переваги нашого нумерологічного тесту:
          </h3>
          <ul className="list-disc list-inside mb-4">
            <li>
              <span className="font-semibold">Швидко та безкоштовно:</span>{' '}
              отримайте персональний аналіз за лічені секунди, абсолютно
              безкоштовно.
            </li>
            <li>
              <span className="font-semibold">Дві системи нумерології:</span>{' '}
              оберіть між класичною Піфагорійською та глибинною Халдейською
              системою для більш точного аналізу.
            </li>
            <li>
              <span className="font-semibold">Персоналізовані висновки:</span>{' '}
              дізнайтеся не лише про свої числа, але й про їх значення саме для
              вас.
            </li>
            <li>
              <span className="font-semibold">Глибоке самопізнання:</span> тест
              допоможе вам краще зрозуміти себе, свої сильні сторони та
              потенційні напрямки розвитку.
            </li>
          </ul>

          <NumerologyHr lang={UA} />

          <p className="mb-4">
            {`Заповніть форму нижче, вказавши своє повне ім'я та дату народження, та
                відкрийте для себе захоплюючий світ нумерології! Отримайте цінні інсайти
                про свою особистість та долю вже зараз.`}
          </p>

          <p className="font-semibold text-center" id={NUMEROLOGY_FORM_ID}>
            <span aria-label="іконка руки, що вказує вниз">👇</span> Заповніть
            форму та розпочніть свою подорож самопізнання!
          </p>
        </>
      ),
      [EN]: (
        <>
          <Title titleType="h2">
            Numerology Test: Unlock the Code of Your Destiny
          </Title>
          <section className="flex items-center justify-around flex-wrap md:flex-nowrap gap-8 py-6">
            <NumerologyPictogram
              className="shrink-0 size-36 text-tertiary-foreground/40"
              lang={EN}
            />

            <p className="mb-4">
              Numbers accompany us throughout our lives, and numerology suggests
              that they carry profound meaning and energy. With our free
              numerology test, you can dive into the world of numbers and
              receive a personalized numerological analysis based on your name
              and birthdate.
            </p>
          </section>

          <h3 className="text-xl font-semibold mb-2">
            What You Will Discover in the Test:
          </h3>
          <ul className="list-disc list-inside">
            <li>
              <span className="font-semibold">Life Path Number:</span> Learn
              about your main life direction, talents, and challenges ahead.
              This number reveals your unique mission and potential.
            </li>
            <li>
              <span className="font-semibold">
                Soul Number (Heart’s Desire):
              </span>{' '}
              Discover your deepest desires, motivation, and what truly brings
              you joy and fulfillment.
            </li>
            <li>
              <span className="font-semibold">
                Personality Number (How Others Perceive You):
              </span>{' '}
              Understand how others see you and the impression you make in
              social settings. This number unveils your external personality.
            </li>
            <li>
              <span className="font-semibold">
                Destiny Number (Life’s Mission):
              </span>{' '}
              Uncover your life&apos;s mission, the purpose you subconsciously
              strive for, and your contribution to the world.
            </li>
          </ul>

          <NumerologyHr lang={EN} />

          <p className="mb-4">
            Pay special attention to your{' '}
            <span className="font-semibold">Personality Number</span>. In our
            test, you can calculate it using{' '}
            <span className="font-semibold">
              two different numerology systems:
            </span>{' '}
            Pythagorean and Chaldean.
          </p>

          <p className="mb-4">
            The <span className="font-semibold">Pythagorean system</span>, more
            commonly used in Western numerology, views the Personality Number as
            a reflection of your{' '}
            <span className="font-semibold">outer behavior</span>, how you
            present yourself to the world, and the{' '}
            <span className="font-semibold">first impression</span> you leave on
            people. It focuses on the rational and social aspects of your
            personality.
          </p>

          <p className="mb-4">
            On the other hand, the{' '}
            <span className="font-semibold">Chaldean system</span>, rooted in
            ancient Babylon, offers a deeper insight into the Personality
            Number. It considers the{' '}
            <span className="font-semibold">
              vibrational essence of your name
            </span>
            , revealing{' '}
            <span className="font-semibold">
              hidden aspects of your inner nature
            </span>
            , deep motivations, and even{' '}
            <span className="font-semibold">karmic influences</span> shaping
            your external personality. The Chaldean system can provide a more{' '}
            <span className="font-semibold">nuanced and spiritual</span>{' '}
            understanding of who you truly are behind social masks.
          </p>

          <NumerologyHr lang={EN} />

          <h3 className="text-xl font-semibold mb-2">
            Benefits of Our Numerology Test:
          </h3>
          <ul className="list-disc list-inside mb-4">
            <li>
              <span className="font-semibold">Fast & Free:</span> Get a
              personalized analysis in seconds, absolutely free.
            </li>
            <li>
              <span className="font-semibold">Two Numerology Systems:</span>{' '}
              Choose between the classic Pythagorean system and the deeper
              Chaldean system for a more precise analysis.
            </li>
            <li>
              <span className="font-semibold">Personalized Insights:</span>{' '}
              Learn not just about your numbers but also their meaning
              specifically for you.
            </li>
            <li>
              <span className="font-semibold">Deep Self-Discovery:</span> The
              test will help you better understand yourself, your strengths, and
              potential paths for growth.
            </li>
          </ul>

          <NumerologyHr lang={EN} />

          <p className="mb-4">
            Fill out the form below with your full name and birth date to
            explore the fascinating world of numerology! Gain valuable insights
            into your personality and destiny today.
          </p>

          <p className="font-semibold text-center" id={NUMEROLOGY_FORM_ID}>
            <span aria-label="pointing down hand icon">👇</span> Fill out the
            form and begin your journey of self-discovery!
          </p>
        </>
      ),
    },
  },
};
