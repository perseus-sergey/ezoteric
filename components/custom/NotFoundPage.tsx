import * as motion from 'motion/react-client';

import { DEFAULT_LANG, ELanguage } from '../../models/language.model';
import SeoLink from './SeoLink';
import SeoSVG from './SeoSVG';
import { Title } from './Title';

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
  <div className="flex-1 bg-tertiary border-2 rounded-lg border-stone-300 flex flex-col justify-center items-center min-h-[75vh] p-3">
    <Title className="text-center text-shadow-lg">
      {NOT_FOUND_PAGE.NOT_FOUND_TITLE[DEFAULT_LANG]}
    </Title>

    <div className="py-6">
      {[
        NOT_FOUND_PAGE.NOT_FOUND_DESCRIPTION[ELanguage.EN],
        NOT_FOUND_PAGE.NOT_FOUND_DESCRIPTION[ELanguage.UA],
      ].map((title) => (
        <p
          key={title}
          className="text-xl text-center text-muted-foreground font-bold"
        >
          {title}
        </p>
      ))}
    </div>

    <SeoLink
      href={`/${lang}`}
      className="flex flex-col items-center gap-8 group"
      title="Go to the Home Page"
    >
      <SeoSVG viewBox="0 0 48 48" className="size-24">
        <g fill="none" stroke="currentColor" strokeWidth="3">
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ ease: 'easeOut', duration: 1, delay: 0.5 }}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 10c.5 3 1 4.5 1.5 8c.4 2.8.5 7.167.5 9c-2.167 1-7 3-7 7s5 9 19 9s19-5 19-9s-7-7-7-7s0-5.5.5-9s1-5 1.5-8"
          />
          <motion.path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M36 27c0 4-1 8-12.5 8"
          />
          <motion.ellipse
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ ease: 'easeOut', duration: 0.5 }}
            cx="24"
            cy="10"
            rx="14"
            ry="5"
          ></motion.ellipse>
        </g>
      </SeoSVG>

      <div className="flex flex-col gap-2 items-center">
        {[
          NOT_FOUND_PAGE.NOT_FOUND_ACTION[ELanguage.EN],
          NOT_FOUND_PAGE.NOT_FOUND_ACTION[ELanguage.UA],
        ].map((title) => (
          <p
            key={title}
            className="text-muted-foreground group-hover:opacity-70 duration-200"
          >
            {title}
          </p>
        ))}
      </div>
    </SeoLink>
  </div>
);

export default NotFoundPage;
