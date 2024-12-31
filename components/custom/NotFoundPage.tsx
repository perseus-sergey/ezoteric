// import { DEFAULT_LANG, ELanguage } from '@/models/language.model';
// import Image from 'next/image';
import { DEFAULT_LANG, ELanguage } from '../../models/language.model';
import SeoLink from './SeoLink';
import { Title } from './Title';
// import emptyPageImg from 'public/Images/empty_page.png';
// import mainLogoImg from 'public/Images/InstallsatOrig_400.png';

export const NOT_FOUND_PAGE = {
  NOT_FOUND_TITLE: {
    [ELanguage.UA]: 'Сторінку не знайдено.',
    [ELanguage.EN]: 'Page not found.',
  },
  NOT_FOUND_DESCRIPTION: {
    [ELanguage.UA]:
      'На жаль, зазначену сторінку не знайдено. Можливо, вона була видалена або переміщена.',
    [ELanguage.EN]:
      'Unfortunately, the specified page was not found. It may have been deleted or moved.',
  },
  NOT_FOUND_ACTION: {
    [ELanguage.UA]: 'Перейти на головну сторінку.',
    [ELanguage.EN]: 'Go to the main page.',
  },
};

const NotFoundPage = ({ lang = DEFAULT_LANG }: { lang?: ELanguage }) => (
  <div
    className="bg-violet-100 border-2 rounded-lg border-stone-300 flex flex-col justify-center items-center min-h-[75vh] gap-[5vh] p-3"
    data-testid="NotFoundPage"
  >
    {/* <div className={styles.NotFoundPage} data-testid="NotFoundPage"> */}
    <Title className="text-center text-shadow-lg">
      {NOT_FOUND_PAGE.NOT_FOUND_TITLE[lang]}
    </Title>
    {/* <Image
      src={emptyPageImg}
      alt="Image of space for marking an empty result"
      priority
    /> */}
    <p className="text-center font-bold text-xl">
      {NOT_FOUND_PAGE.NOT_FOUND_DESCRIPTION[lang]}
    </p>
    <SeoLink
      href={`/`}
      // href={`/${lang}`}
      className="flex flex-col items-center gap-8"
      title="Go to the Home Page"
    >
      {/* <Image src={mainLogoImg} alt="Installsat TV Logo" priority /> */}
      <p className="text-blue-900 hover:text-red-500">
        {NOT_FOUND_PAGE.NOT_FOUND_ACTION[lang]}
      </p>
    </SeoLink>
  </div>
);

export default NotFoundPage;
