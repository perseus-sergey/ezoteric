/* eslint-disable react/no-unescaped-entities */

import { getELangKey } from '@/lib/utils/getLanguage';
import { ESegment, MAIN_URL, TParams } from '@/models/url.model';
import { Title } from '@/components/custom/Title';
import { ELanguage } from '@/models/language.model';
import { DEFAULT_META_OG, SITE_DOMAIN } from '@/models/root.model';
import SeoLink from '@/components/custom/SeoLink';
import { Metadata } from 'next';
import { META_COOKIE, siteAddress } from '@/models/policy.model';
import { SiteAddress } from '@/components/custom/SiteAddress';

export const revalidate = 2592000; // 3600 * 24 * 30 invalidate cache every month

export const dynamicParams = false;

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || MAIN_URL;
const siteMail = process.env.NEXT_PUBLIC_SITE_EMAIL || 'mail@ezoteric.net';
const siteLegalName = DEFAULT_META_OG.siteName;

const { UA, EN } = ELanguage;

export const generateMetadata = async ({
  params,
}: {
  params: TParams;
}): Promise<Metadata> => {
  const p = await params;
  const lang = getELangKey(p.lang);

  return {
    metadataBase: new URL(baseUrl),
    ...META_COOKIE[lang],
    openGraph: {
      ...DEFAULT_META_OG,
      ...META_COOKIE[lang],
      url: `/${lang}/${ESegment.COOKIE_POLICY}`,
    },
    alternates: {
      canonical: `/${lang}/${ESegment.COOKIE_POLICY}`,
      languages: {
        en: `/${EN}/${ESegment.COOKIE_POLICY}`,
        uk: `/${UA}/${ESegment.COOKIE_POLICY}`,
      },
    },
  };
};

export default async function Page({ params }: { params: TParams }) {
  const p = await params;
  const lang = getELangKey(p.lang);

  return (
    <article className="relative mx-auto bg-tertiary rounded-2xl py-8 px-12">
      {lang === UA ? (
        <>
          <Title>ПОЛІТИКА ВИКОРИСТАННЯ ФАЙЛІВ COOKIE</Title>
          <p className="text-sm text-muted-foreground mb-6">
            Останнє оновлення: 10 квітня 2025 року
          </p>

          <p className="mb-4">
            Ця Політика використання файлів cookie пояснює, як{' '}
            <strong>{siteLegalName}</strong> ("<strong>Компанія</strong>", "
            <strong>ми</strong>", "<strong>нас</strong>", та "
            <strong>наш</strong>") використовує файли cookie та подібні
            технології для розпізнавання вас, коли ви відвідуєте наш вебсайт за
            адресою{' '}
            <SeoLink
              href={baseUrl}
              title={`Відвідати ${SITE_DOMAIN}`}
              isTargetBlank
              className="text-blue-500 hover:underline"
            >
              {baseUrl}
            </SeoLink>{' '}
            ("<strong>Вебсайт</strong>"). Вона пояснює, що це за технології та
            чому ми їх використовуємо, а також ваші права контролювати наше їх
            використання.
          </p>
          <p className="mb-6">
            У деяких випадках ми можемо використовувати файли cookie для збору
            особистої інформації або інформації, яка стає особистою, якщо ми
            поєднуємо її з іншою інформацією.
          </p>

          <section>
            <h2 className="text-2xl font-semibold my-4">
              Що таке файли cookie?
            </h2>
            <p className="mb-4">
              Файли cookie – це невеликі файли даних, які розміщуються на вашому
              комп'ютері або мобільному пристрої, коли ви відвідуєте вебсайт.
              Файли cookie широко використовуються власниками вебсайтів для
              того, щоб їхні вебсайти працювали або працювали ефективніше, а
              також для надання звітної інформації.
            </p>
            <p className="mb-6">
              Файли cookie, встановлені власником вебсайту (у цьому випадку,{' '}
              <strong>{siteLegalName}</strong>), називаються "основними файлами
              cookie" (first-party cookies). Файли cookie, встановлені іншими
              сторонами, крім власника вебсайту, називаються "сторонніми файлами
              cookie" (third-party cookies). Сторонні файли cookie дозволяють
              надавати функції або функціональні можливості третіх сторін на
              вебсайті або через нього (наприклад, реклама, інтерактивний
              контент та аналітика). Сторони, які встановлюють ці сторонні файли
              cookie, можуть розпізнавати ваш комп'ютер як під час відвідування
              відповідного вебсайту, так і під час відвідування деяких інших
              вебсайтів.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold my-4">
              Чому ми використовуємо файли cookie?
            </h2>
            <p className="mb-6">
              Ми використовуємо основні та сторонні файли cookie з кількох
              причин. Деякі файли cookie необхідні з технічних причин для роботи
              нашого Вебсайту, і ми називаємо їх "необхідними" або "строго
              необхідними" файлами cookie. Інші файли cookie також дозволяють
              нам відстежувати та націлювати інтереси наших користувачів для
              покращення досвіду на наших Онлайн-ресурсах. Треті сторони надають
              файли cookie через наш Вебсайт для реклами, аналітики та інших
              цілей. Це описано більш детально нижче.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold my-4">
              Як я можу контролювати файли cookie?
            </h2>
            <p className="mb-4">
              Ви маєте право вирішувати, приймати чи відхиляти файли cookie. Ви
              можете реалізувати свої права щодо файлів cookie, встановивши свої
              уподобання в Менеджері згоди на використання файлів cookie.
              Менеджер згоди на використання файлів cookie дозволяє вам вибрати,
              які категорії файлів cookie ви приймаєте чи відхиляєте. Необхідні
              файли cookie не можна відхилити, оскільки вони є строго
              необхідними для надання вам послуг.
            </p>
            <p className="mb-6">
              Менеджер згоди на використання файлів cookie можна знайти в банері
              сповіщень та на нашому Вебсайті. Якщо ви вирішите відхилити файли
              cookie, ви все ще можете користуватися нашим Вебсайтом, хоча ваш
              доступ до деяких функціональних можливостей та розділів нашого
              Вебсайту може бути обмежений. Ви також можете налаштувати або
              змінити елементи керування вашого веббраузера, щоб приймати або
              відхиляти файли cookie.
            </p>
            {/* Примітка: Таблиця з описом конкретних кукі, згадана Termly, зазвичай генерується динамічно їх скриптом або потребує ручного створення. Цей шаблон не містить статичної таблиці. */}
          </section>

          <section>
            <h2 className="text-2xl font-semibold my-4">
              Як я можу контролювати файли cookie у своєму браузері?
            </h2>
            <p className="mb-4">
              Оскільки способи відмови від файлів cookie за допомогою елементів
              керування веббраузера відрізняються в різних браузерах, вам слід
              відвідати меню допомоги вашого браузера для отримання додаткової
              інформації. Нижче наведено інформацію про те, як керувати файлами
              cookie в найпопулярніших браузерах:
            </p>
            <ul className="list-disc list-inside mb-4 pl-8">
              <li>
                <SeoLink
                  href="https://support.google.com/chrome/answer/95647#zippy=%2Callow-or-block-cookies"
                  title="Налаштування cookie в Chrome"
                  isTargetBlank
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Chrome
                </SeoLink>
              </li>
              <li>
                <SeoLink
                  href="https://support.microsoft.com/uk-ua/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d"
                  title="Налаштування cookie в Internet Explorer"
                  isTargetBlank
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Internet Explorer
                </SeoLink>
              </li>
              <li>
                <SeoLink
                  href="https://support.mozilla.org/uk/kb/%D0%92%D1%96%D0%B4%D1%81%D1%82%D0%B5%D0%B6%D0%B5%D0%BD%D0%BD%D1%8F-%D0%BA%D1%83%D0%BA%D0%B8" // Змінено посилання на українську версію, якщо є
                  title="Налаштування cookie в Firefox"
                  isTargetBlank
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Firefox
                </SeoLink>
              </li>
              <li>
                <SeoLink
                  href="https://support.apple.com/uk-ua/guide/safari/sfri11471/mac" // Змінено посилання на українську версію, якщо є
                  title="Налаштування cookie в Safari"
                  isTargetBlank
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Safari
                </SeoLink>
              </li>
              <li>
                <SeoLink
                  href="https://support.microsoft.com/uk-ua/windows/microsoft-edge-browsing-data-and-privacy-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd"
                  title="Налаштування cookie в Edge"
                  isTargetBlank
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Edge
                </SeoLink>
              </li>
              <li>
                <SeoLink
                  href="https://help.opera.com/en/latest/web-preferences/" // Української версії може не бути
                  title="Налаштування cookie в Opera"
                  isTargetBlank
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Opera
                </SeoLink>
              </li>
            </ul>
            <p className="mb-6">
              Крім того, більшість рекламних мереж пропонують вам спосіб
              відмовитися від цільової реклами. Якщо ви бажаєте дізнатися
              більше, відвідайте:
            </p>
            <ul className="list-disc list-inside mb-6 pl-8">
              <li>
                <SeoLink
                  href="http://www.aboutads.info/choices/"
                  title="Digital Advertising Alliance"
                  isTargetBlank
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Digital Advertising Alliance
                </SeoLink>
              </li>
              <li>
                <SeoLink
                  href="https://youradchoices.ca/"
                  title="Digital Advertising Alliance of Canada"
                  isTargetBlank
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Digital Advertising Alliance of Canada
                </SeoLink>
              </li>
              <li>
                <SeoLink
                  href="http://www.youronlinechoices.com/"
                  title="European Interactive Digital Advertising Alliance"
                  isTargetBlank
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  European Interactive Digital Advertising Alliance
                </SeoLink>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold my-4">
              Що щодо інших технологій відстеження, таких як веб-маяки?
            </h2>
            <p className="mb-6">
              Файли cookie – це не єдиний спосіб розпізнавати або відстежувати
              відвідувачів вебсайту. Ми можемо час від часу використовувати
              інші, подібні технології, такі як веб-маяки (іноді звані
              "пікселями відстеження" або "прозорими GIF-файлами"). Це крихітні
              графічні файли, які містять унікальний ідентифікатор, що дозволяє
              нам розпізнавати, коли хтось відвідав наш Вебсайт або відкрив
              електронний лист, що містить їх. Це дозволяє нам, наприклад,
              відстежувати моделі трафіку користувачів з однієї сторінки
              вебсайту на іншу, доставляти або спілкуватися з файлами cookie,
              розуміти, чи прийшли ви на вебсайт з онлайн-реклами, відображеної
              на сторонньому вебсайті, покращувати продуктивність сайту та
              вимірювати успішність маркетингових кампаній електронною поштою. У
              багатьох випадках ці технології залежать від файлів cookie для
              належного функціонування, тому відмова від файлів cookie погіршить
              їхню роботу.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold my-4">
              Чи використовуєте ви Flash-cookie або локальні спільні об'єкти?
            </h2>
            <p className="mb-4">
              Вебсайти також можуть використовувати так звані "Flash Cookies"
              (також відомі як локальні спільні об'єкти або "LSO") для, серед
              іншого, збору та зберігання інформації про ваше використання наших
              послуг, запобігання шахрайству та для інших операцій сайту.
            </p>
            <p className="mb-4">
              Якщо ви не хочете, щоб Flash Cookies зберігалися на вашому
              комп'ютері, ви можете налаштувати параметри вашого Flash-плеєра
              для блокування зберігання Flash Cookies за допомогою інструментів,
              що містяться в{' '}
              <SeoLink
                href="http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager07.html"
                title="Панель налаштувань зберігання вебсайту"
                isTargetBlank
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Панелі налаштувань зберігання вебсайту
              </SeoLink>
              . Ви також можете контролювати Flash Cookies, перейшовши до{' '}
              <SeoLink
                href="http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager03.html"
                title="Глобальна панель налаштувань зберігання"
                isTargetBlank
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Глобальної панелі налаштувань зберігання
              </SeoLink>{' '}
              та дотримуючись інструкцій (які можуть включати інструкції, що
              пояснюють, наприклад, як видалити існуючі Flash Cookies (згадувані
              як "інформація" на сайті Macromedia), як запобігти розміщенню
              Flash LSO на вашому комп'ютері без вашого запиту, та (для Flash
              Player 8 і пізніших версій) як блокувати Flash Cookies, які не
              доставляються оператором сторінки, на якій ви перебуваєте в даний
              момент).
            </p>
            <p className="mb-6">
              Зверніть увагу, що налаштування Flash Player для обмеження або
              лімітування прийняття Flash Cookies може зменшити або перешкодити
              функціональності деяких Flash-додатків, включаючи, потенційно,
              Flash-додатки, що використовуються у зв'язку з нашими послугами
              або онлайн-контентом.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold my-4">
              Чи показуєте ви цільову рекламу?
            </h2>
            <p className="mb-6">
              Треті сторони можуть розміщувати файли cookie на вашому комп'ютері
              або мобільному пристрої для показу реклами через наш Вебсайт. Ці
              компанії можуть використовувати інформацію про ваші відвідування
              цього та інших вебсайтів для надання релевантної реклами про
              товари та послуги, які можуть вас зацікавити. Вони також можуть
              використовувати технологію для вимірювання ефективності реклами.
              Вони можуть досягти цього, використовуючи файли cookie або
              веб-маяки для збору інформації про ваші відвідування цього та
              інших сайтів з метою надання релевантної реклами про товари та
              послуги, що потенційно вас зацікавлять. Інформація, зібрана в ході
              цього процесу, не дозволяє нам або їм ідентифікувати ваше ім'я,
              контактні дані або інші деталі, що безпосередньо вас
              ідентифікують, якщо ви не вирішите їх надати.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold my-4">
              Як часто ви будете оновлювати цю Політику використання файлів
              cookie?
            </h2>
            <p className="mb-6">
              Ми можемо час від часу оновлювати цю Політику використання файлів
              cookie, щоб відобразити, наприклад, зміни у файлах cookie, які ми
              використовуємо, або з інших операційних, юридичних чи регуляторних
              причин. Тому, будь ласка, регулярно переглядайте цю Політику
              використання файлів cookie, щоб бути в курсі нашого використання
              файлів cookie та пов'язаних технологій.
            </p>
            <p className="mb-6">
              Дата вгорі цієї Політики використання файлів cookie вказує, коли
              її востаннє оновлювали.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold my-4">
              Де я можу отримати додаткову інформацію?
            </h2>
            <p className="mb-4">
              Якщо у вас є будь-які питання щодо нашого використання файлів
              cookie або інших технологій, будь ласка, напишіть нам на{' '}
              <SeoLink
                href={`mailto:${siteMail}`}
                title={`Надіслати листа на ${siteMail}`}
                className="text-blue-500 hover:underline"
              >
                {siteMail}
              </SeoLink>{' '}
              або поштою за адресою:
            </p>
            <SiteAddress
              siteLegalName={siteLegalName}
              siteAddress={siteAddress[lang]}
            />
          </section>
        </>
      ) : (
        <>
          <Title>COOKIE POLICY</Title>
          <p className="text-sm text-muted-foreground mb-6">
            Last updated April 10, 2025
          </p>

          <p className="mb-4">
            This Cookie Policy explains how <strong>{siteLegalName}</strong> ( "
            <strong>Company</strong>," "<strong>we</strong>," "
            <strong>us</strong>," and "<strong>our</strong>") uses cookies and
            similar technologies to recognize you when you visit our website at{' '}
            <SeoLink
              href={baseUrl}
              title={`Visit ${SITE_DOMAIN}`}
              isTargetBlank
              className="text-blue-500 hover:underline"
            >
              {baseUrl}
            </SeoLink>{' '}
            ("<strong>Website</strong>"). It explains what these technologies
            are and why we use them, as well as your rights to control our use
            of them.
          </p>
          <p className="mb-6">
            In some cases we may use cookies to collect personal information, or
            that becomes personal information if we combine it with other
            information.
          </p>

          <section>
            <h2 className="text-2xl font-semibold my-4">What are cookies?</h2>
            <p className="mb-4">
              Cookies are small data files that are placed on your computer or
              mobile device when you visit a website. Cookies are widely used by
              website owners in order to make their websites work, or to work
              more efficiently, as well as to provide reporting information.
            </p>
            <p className="mb-6">
              Cookies set by the website owner (in this case,{' '}
              <strong>{siteLegalName}</strong>) are called "first-party
              cookies." Cookies set by parties other than the website owner are
              called "third-party cookies." Third-party cookies enable
              third-party features or functionality to be provided on or through
              the website (e.g., advertising, interactive content, and
              analytics). The parties that set these third-party cookies can
              recognize your computer both when it visits the website in
              question and also when it visits certain other websites.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold my-4">
              Why do we use cookies?
            </h2>
            <p className="mb-6">
              We use first- and third-party cookies for several reasons. Some
              cookies are required for technical reasons in order for our
              Website to operate, and we refer to these as "essential" or
              "strictly necessary" cookies. Other cookies also enable us to
              track and target the interests of our users to enhance the
              experience on our Online Properties. Third parties serve cookies
              through our Website for advertising, analytics, and other
              purposes. This is described in more detail below.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold my-4">
              How can I control cookies?
            </h2>
            <p className="mb-4">
              You have the right to decide whether to accept or reject cookies.
              You can exercise your cookie rights by setting your preferences in
              the Cookie Consent Manager. The Cookie Consent Manager allows you
              to select which categories of cookies you accept or reject.
              Essential cookies cannot be rejected as they are strictly
              necessary to provide you with services.
            </p>
            <p className="mb-6">
              The Cookie Consent Manager can be found in the notification banner
              and on our Website. If you choose to reject cookies, you may still
              use our Website though your access to some functionality and areas
              of our Website may be restricted. You may also set or amend your
              web browser controls to accept or refuse cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold my-4">
              How can I control cookies on my browser?
            </h2>
            <p className="mb-4">
              As the means by which you can refuse cookies through your web
              browser controls vary from browser to browser, you should visit
              your browser's help menu for more information. The following is
              information about how to manage cookies on the most popular
              browsers:
            </p>
            <ul className="list-disc list-inside mb-4 pl-8">
              <li>
                <SeoLink
                  href="https://support.google.com/chrome/answer/95647#zippy=%2Callow-or-block-cookies"
                  title="Chrome cookie settings"
                  isTargetBlank
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Chrome
                </SeoLink>
              </li>
              <li>
                <SeoLink
                  href="https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d"
                  title="Internet Explorer cookie settings"
                  isTargetBlank
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Internet Explorer
                </SeoLink>
              </li>
              <li>
                <SeoLink
                  href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop?redirectslug=enable-and-disable-cookies-website-preferences&redirectlocale=en-US"
                  title="Firefox cookie settings"
                  isTargetBlank
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Firefox
                </SeoLink>
              </li>
              <li>
                <SeoLink
                  href="https://support.apple.com/en-ie/guide/safari/sfri11471/mac"
                  title="Safari cookie settings"
                  isTargetBlank
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Safari
                </SeoLink>
              </li>
              <li>
                <SeoLink
                  href="https://support.microsoft.com/en-us/windows/microsoft-edge-browsing-data-and-privacy-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd"
                  title="Edge cookie settings"
                  isTargetBlank
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Edge
                </SeoLink>
              </li>
              <li>
                <SeoLink
                  href="https://help.opera.com/en/latest/web-preferences/"
                  title="Opera cookie settings"
                  isTargetBlank
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Opera
                </SeoLink>
              </li>
            </ul>
            <p className="mb-6">
              In addition, most advertising networks offer you a way to opt out
              of targeted advertising. If you would like to find out more
              information, please visit:
            </p>
            <ul className="list-disc list-inside mb-6 pl-8">
              <li>
                <SeoLink
                  href="http://www.aboutads.info/choices/"
                  title="Digital Advertising Alliance"
                  isTargetBlank
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Digital Advertising Alliance
                </SeoLink>
              </li>
              <li>
                <SeoLink
                  href="https://youradchoices.ca/"
                  title="Digital Advertising Alliance of Canada"
                  isTargetBlank
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Digital Advertising Alliance of Canada
                </SeoLink>
              </li>
              <li>
                <SeoLink
                  href="http://www.youronlinechoices.com/"
                  title="European Interactive Digital Advertising Alliance"
                  isTargetBlank
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  European Interactive Digital Advertising Alliance
                </SeoLink>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold my-4">
              What about other tracking technologies, like web beacons?
            </h2>
            <p className="mb-6">
              Cookies are not the only way to recognize or track visitors to a
              website. We may use other, similar technologies from time to time,
              like web beacons (sometimes called "tracking pixels" or "clear
              gifs"). These are tiny graphics files that contain a unique
              identifier that enables us to recognize when someone has visited
              our Website or opened an email including them. This allows us, for
              example, to monitor the traffic patterns of users from one page
              within a website to another, to deliver or communicate with
              cookies, to understand whether you have come to the website from
              an online advertisement displayed on a third-party website, to
              improve site performance, and to measure the success of email
              marketing campaigns. In many instances, these technologies are
              reliant on cookies to function properly, and so declining cookies
              will impair their functioning.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold my-4">
              Do you use Flash cookies or Local Shared Objects?
            </h2>
            <p className="mb-4">
              Websites may also use so-called "Flash Cookies" (also known as
              Local Shared Objects or "LSOs") to, among other things, collect
              and store information about your use of our services, fraud
              prevention, and for other site operations.
            </p>
            <p className="mb-4">
              If you do not want Flash Cookies stored on your computer, you can
              adjust the settings of your Flash player to block Flash Cookies
              storage using the tools contained in the{' '}
              <SeoLink
                href="http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager07.html"
                title="Website Storage Settings Panel"
                isTargetBlank
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Website Storage Settings Panel
              </SeoLink>
              . You can also control Flash Cookies by going to the{' '}
              <SeoLink
                href="http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager03.html"
                title="Global Storage Settings Panel"
                isTargetBlank
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Global Storage Settings Panel
              </SeoLink>{' '}
              and following the instructions (which may include instructions
              that explain, for example, how to delete existing Flash Cookies
              (referred to "information" on the Macromedia site), how to prevent
              Flash LSOs from being placed on your computer without your being
              asked, and (for Flash Player 8 and later) how to block Flash
              Cookies that are not being delivered by the operator of the page
              you are on at the time).
            </p>
            <p className="mb-6">
              Please note that setting the Flash Player to restrict or limit
              acceptance of Flash Cookies may reduce or impede the functionality
              of some Flash applications, including, potentially, Flash
              applications used in connection with our services or online
              content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold my-4">
              Do you serve targeted advertising?
            </h2>
            <p className="mb-6">
              Third parties may serve cookies on your computer or mobile device
              to serve advertising through our Website. These companies may use
              information about your visits to this and other websites in order
              to provide relevant advertisements about goods and services that
              you may be interested in. They may also employ technology that is
              used to measure the effectiveness of advertisements. They can
              accomplish this by using cookies or web beacons to collect
              information about your visits to this and other sites in order to
              provide relevant advertisements about goods and services of
              potential interest to you. The information collected through this
              process does not enable us or them to identify your name, contact
              details, or other details that directly identify you unless you
              choose to provide these.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold my-4">
              How often will you update this Cookie Policy?
            </h2>
            <p className="mb-6">
              We may update this Cookie Policy from time to time in order to
              reflect, for example, changes to the cookies we use or for other
              operational, legal, or regulatory reasons. Please therefore
              revisit this Cookie Policy regularly to stay informed about our
              use of cookies and related technologies.
            </p>
            <p className="mb-6">
              The date at the top of this Cookie Policy indicates when it was
              last updated.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold my-4">
              Where can I get further information?
            </h2>
            <p className="mb-4">
              If you have any questions about our use of cookies or other
              technologies, please email us at{' '}
              <SeoLink
                href={`mailto:${siteMail}`}
                title={`Send mail to ${siteMail}`}
                className="text-blue-500 hover:underline"
              >
                {siteMail}
              </SeoLink>{' '}
              or by post to:
            </p>
            <SiteAddress
              siteLegalName={siteLegalName}
              siteAddress={siteAddress[lang]}
            />
          </section>
        </>
      )}
    </article>
  );
}
