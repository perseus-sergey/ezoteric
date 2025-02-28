import { ELanguage } from '@/models/language.model';
import { NUMEROLOGY_FORM_ID } from '@/models/url.model';
import { NumerologyPictogram } from '@/svg/NumerologyPictogram';
import { Title } from './Title';
import { HrWithIcon } from './HrWithIcon';

const { UA } = ELanguage;

export const NumerologyHtml = ({ lang }: { lang: ELanguage }) => (
  <>
    <Title titleType="h2">
      {lang === UA
        ? 'Нумерологічний тест: розкрийте код своєї долі'
        : 'Numerology Test: Unlock the Code of Your Destiny'}
    </Title>
    <section className="flex items-center justify-around flex-wrap md:flex-nowrap gap-8 py-6">
      <NumerologyPictogram
        className="shrink-0 size-20 text-tertiary-foreground/40"
        lang={lang}
      />

      <p className="mb-4">
        {lang === UA
          ? `Числа супроводжують нас протягом усього життя, і нумерологія стверджує,
        що вони несуть в собі глибинний сенс та енергію. За допомогою нашого
        безкоштовного нумерологічного тесту ви зможете зануритися у світ чисел
        та отримати персональний нумерологічний аналіз, заснований на вашому
        імені та даті народження.`
          : `Numbers accompany us throughout our lives, and numerology suggests
          that they carry profound meaning and energy. With our free numerology
          test, you can dive into the world of numbers and receive a
          personalized numerological analysis based on your name and birthdate.`}
      </p>
    </section>

    <h3 className="text-xl font-semibold mb-2">
      {lang === UA
        ? `Що ви дізнаєтесь за допомогою тесту:`
        : `What You Will Discover in the Test:`}
    </h3>

    <ul className="list-disc list-inside">
      {lang === UA ? (
        <>
          <li>
            <span className="font-semibold">Число Життєвого Шляху:</span>{' '}
            дізнайтеся про свій основний життєвий напрямок, таланти та виклики,
            що чекають на вас. Це число розкриває вашу унікальну місію та
            потенціал.
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
            бачать в соціальному світі. Це число розкриває вашу зовнішню
            особистість.
          </li>
          <li>
            <span className="font-semibold">Число Долі (Місія в житті):</span>{' '}
            розкрийте свою місію у цьому житті, ціль, до якої ви підсвідомо
            прагнете, та ваш внесок у світ.
          </li>
        </>
      ) : (
        <>
          <li>
            <span className="font-semibold">Life Path Number:</span> Learn about
            your main life direction, talents, and challenges ahead. This number
            reveals your unique mission and potential.
          </li>
          <li>
            <span className="font-semibold">Soul Number (Heart’s Desire):</span>{' '}
            Discover your deepest desires, motivation, and what truly brings you
            joy and fulfillment.
          </li>
          <li>
            <span className="font-semibold">
              Personality Number (How Others Perceive You):
            </span>{' '}
            Understand how others see you and the impression you make in social
            settings. This number unveils your external personality.
          </li>
          <li>
            <span className="font-semibold">
              Destiny Number (Life’s Mission):
            </span>{' '}
            Uncover your life&apos;s mission, the purpose you subconsciously
            strive for, and your contribution to the world.
          </li>
        </>
      )}
    </ul>

    <HrWithIcon lang={lang} />

    <p className="mb-4">
      {lang === UA ? (
        <>
          Особливу увагу варто приділити{' '}
          <span className="font-semibold">Числу Особистості</span>. В нашому
          тесті ви можете розрахувати його, використовуючи{' '}
          <span className="font-semibold">дві різні системи нумерології</span>:
          Піфагорійську та Халдейську.
        </>
      ) : (
        <>
          Pay special attention to your{' '}
          <span className="font-semibold">Personality Number</span>. In our
          test, you can calculate it using{' '}
          <span className="font-semibold">
            two different numerology systems:
          </span>{' '}
          Pythagorean and Chaldean.
        </>
      )}
    </p>

    <p className="mb-4">
      {lang === UA ? (
        <>
          <span className="font-semibold">Піфагорійська система</span>, більш
          поширена в західній нумерології, розглядає Число Особистості як
          відображення вашої{' '}
          <span className="font-semibold">зовнішньої манери поведінки</span>,
          того, як ви представляєте себе світу та яке{' '}
          <span className="font-semibold">перше враження</span> справляєте на
          людей. Вона фокусується на раціональних та соціальних аспектах вашої
          особистості.
        </>
      ) : (
        <>
          The <span className="font-semibold">Pythagorean system</span>, more
          commonly used in Western numerology, views the Personality Number as a
          reflection of your{' '}
          <span className="font-semibold">outer behavior</span>, how you present
          yourself to the world, and the{' '}
          <span className="font-semibold">first impression</span> you leave on
          people. It focuses on the rational and social aspects of your
          personality.
        </>
      )}
    </p>

    <p className="mb-4">
      {lang === UA ? (
        <>
          Натомість, <span className="font-semibold">Халдейська система</span>,
          що сягає корінням стародавнього Вавилону, пропонує глибший погляд на
          Число Особистості. Вона враховує{' '}
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
          <span className="font-semibold">нюансоване та духовне</span> розуміння
          того, ким ви є насправді за маскою соціальних ролей.
        </>
      ) : (
        <>
          On the other hand, the{' '}
          <span className="font-semibold">Chaldean system</span>, rooted in
          ancient Babylon, offers a deeper insight into the Personality Number.
          It considers the{' '}
          <span className="font-semibold">
            vibrational essence of your name
          </span>
          , revealing{' '}
          <span className="font-semibold">
            hidden aspects of your inner nature
          </span>
          , deep motivations, and even{' '}
          <span className="font-semibold">karmic influences</span> shaping your
          external personality. The Chaldean system can provide a more{' '}
          <span className="font-semibold">nuanced and spiritual</span>{' '}
          understanding of who you truly are behind social masks.
        </>
      )}
    </p>

    <HrWithIcon lang={lang} />

    <h3 className="text-xl font-semibold mb-2">
      {lang === UA
        ? `Переваги нашого нумерологічного тесту:`
        : ` Benefits of Our Numerology Test:`}
    </h3>

    <ul className="list-disc list-inside mb-4">
      {lang === UA ? (
        <>
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
            допоможе вам краще зрозуміти себе, свої сильні сторони та потенційні
            напрямки розвитку.
          </li>
        </>
      ) : (
        <>
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
            <span className="font-semibold">Personalized Insights:</span> Learn
            not just about your numbers but also their meaning specifically for
            you.
          </li>
          <li>
            <span className="font-semibold">Deep Self-Discovery:</span> The test
            will help you better understand yourself, your strengths, and
            potential paths for growth.
          </li>
        </>
      )}
    </ul>

    <HrWithIcon lang={lang} />

    <p className="mb-4">
      {lang === UA
        ? `Заповніть форму нижче, вказавши своє повне ім'я та дату народження, та
        відкрийте для себе захоплюючий світ нумерології! Отримайте цінні інсайти
        про свою особистість та долю вже зараз.`
        : `Fill out the form below with your full name and birth date to explore
        the fascinating world of numerology! Gain valuable insights into your
        personality and destiny today.`}
    </p>

    <p className="font-semibold text-center" id={NUMEROLOGY_FORM_ID}>
      {lang === UA ? (
        <>
          <span aria-label="іконка руки, що вказує вниз">👇</span> Заповніть
          форму та розпочніть свою подорож самопізнання!
        </>
      ) : (
        <>
          <span aria-label="pointing down hand icon">👇</span> Fill out the form
          and begin your journey of self-discovery!
        </>
      )}
    </p>
  </>
);
