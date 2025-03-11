import { ELanguage } from '@/models/language.model';
import SeoLink from './SeoLink';
import { ESegment } from '@/models/url.model';
import { HEADER_MODEL } from '@/models/header.model';
import UserMenu from './UserMenu';
import { Session } from 'next-auth';
import LanguageSwitcher from './LanguageSwitcher';
import LoginProviders from './LoginProviders';
import { Suspense } from 'react';
import ThemeToggleWrapped from './ThemeToggle';
import { Osaka } from '@/svg/Osaka';
import SideBar from './SideBar';
import TestsMenu from './TestsMenu';
import MeetDialog from './MeetDialog';
import { isAuthorized } from '@/lib/utils/loggedUser';

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
  const isAuthorizedUser = await isAuthorized(session);

  return (
    <header
      id="top"
      className="border-grid sticky z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 top-0 left-0 w-dvw py-2 px-3 justify-between flex flex-row items-center"
    >
      <div className="flex flex-row gap-3 items-center">
        <SideBar
          isAdmin={isAdmin}
          session={session}
          lang={lang}
          isAuthorizedUser={isAuthorizedUser}
        />

        <SeoLink
          title={logo[lang]}
          href={`/${lang}`}
          className="flex flex-row gap-4 items-center dark:text-zinc-300 truncate w-28 md:w-fit font-georgia"
        >
          <Osaka className="size-8" />
          Ezoteric.net
        </SeoLink>
      </div>

      <nav className="hidden md:flex flex-row gap-4 items-center font-georgia">
        <Suspense>
          <TestsMenu lang={lang} />
        </Suspense>

        <SeoLink title={links.blog.ariaLabel[lang]} href={`/${lang}/${BLOG}`}>
          {links.blog.caption[lang]}
        </SeoLink>

        {isAdmin && <MeetDialog lang={lang} isAuthorized={isAuthorizedUser} />}

        <LanguageSwitcher />

        <ThemeToggleWrapped lang={lang} />

        {session ? (
          <UserMenu
            lang={lang}
            userEmail={session.user?.email}
            userName={session.user?.name}
            userImgSrc={session.user?.image}
            isAdmin={isAdmin}
          />
        ) : (
          <LoginProviders lang={lang} />
        )}
      </nav>
    </header>
  );
};
