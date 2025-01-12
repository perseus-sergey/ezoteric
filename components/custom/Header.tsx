import { auth } from '@/app/(auth)/auth';

import { SideBar } from './SideBar';
import ThemeToggle from './theme-toggle';
import { ELanguage } from '@/models/language.model';
import SeoLink from './SeoLink';
import { isAdminAuth } from '@/lib/utils/loggedUser';
import { ESegment } from '@/models/url.model';
import LanguageSwitcher from './LanguageSwitcher';
import { HEADER_MODEL } from '@/models/header.model';
import { EzotericIcon } from '@/svg/EzotericIcon';
import { UserMenu } from './UserMenu';
import { LoginProviders } from './LoginProviders';

const { BLOG } = ESegment;
const { logo, links } = HEADER_MODEL;

export const Header = async ({ lang }: { lang: ELanguage }) => {
  const session = (await auth()) || undefined;
  const isAdmin = await isAdminAuth(session);

  return (
    <header
      id="top"
      className="border-grid sticky z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 top-0 left-0 w-dvw py-2 px-3 justify-between flex flex-row items-center"
    >
      <div className="flex flex-row gap-3 items-center">
        <SideBar isAdmin={isAdmin} session={session} lang={lang} />

        <div className="flex flex-row gap-2 items-center">
          <EzotericIcon strokeWidth={0} />
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
