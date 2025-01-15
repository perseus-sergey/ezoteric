import ThemeToggle from './theme-toggle';
import { ELanguage } from '@/models/language.model';
import SeoLink from './SeoLink';
import { ESegment } from '@/models/url.model';
import { HEADER_MODEL } from '@/models/header.model';
import { EzotericIcon } from '@/svg/EzotericIcon';
import UserMenu from './UserMenu';
import { Session } from 'next-auth';
import LanguageSwitcher from './LanguageSwitcher';
import LoginProviders from './LoginProviders';
import SideBar from './SideBar';
import { Suspense } from 'react';

const { BLOG } = ESegment;
const { logo, links } = HEADER_MODEL;

export const Header = async ({
  lang,
  isAdmin,
  session,
}: {
  lang: ELanguage;
  isAdmin: boolean;
  session?: Session;
}) => {
  return (
    <header
      id="top"
      className="border-grid sticky z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 top-0 left-0 w-dvw py-2 px-3 justify-between flex flex-row items-center"
    >
      <div className="flex flex-row gap-3 items-center">
        <Suspense>
          <SideBar isAdmin={isAdmin} session={session} lang={lang} />
        </Suspense>

        <div className="flex flex-row gap-2 items-center">
          <EzotericIcon />
          <SeoLink
            title={logo[lang]}
            href={`/${lang}`}
            className="dark:text-zinc-300 truncate w-28 md:w-fit font-georgia"
          >
            Ezoteric.net
          </SeoLink>
        </div>
      </div>

      <nav className="hidden md:flex flex-row gap-4 items-center font-georgia">
        <SeoLink title={links.blog.ariaLabel[lang]} href={`/${lang}/${BLOG}`}>
          {links.blog.caption[lang]}
        </SeoLink>

        <LanguageSwitcher />

        <ThemeToggle lang={lang} />

        {session ? (
          <UserMenu
            lang={lang}
            userEmail={session?.user?.email}
            userName={session?.user?.name}
            userImgSrc={session?.user?.image}
            isAdmin={isAdmin}
          />
        ) : (
          <LoginProviders lang={lang} />
        )}
      </nav>
    </header>
  );
};
