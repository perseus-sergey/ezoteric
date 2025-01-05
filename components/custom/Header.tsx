import Image from 'next/image';
import Link from 'next/link';

import { auth, signOut } from '@/app/[lang]/(auth)/auth';

import { SideBar } from './SideBar';
import { SlashIcon } from './icons';
import { ThemeToggle } from './theme-toggle';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { ELanguage } from '@/models/language.model';
import SeoLink from './SeoLink';
import { HEADER_MODEL } from '@/models/root.model';
import { isAdminAuth } from '@/lib/utils/loggedUser';
import { ESegment } from '@/models/url.model';

const { BLOG, MASTER, ARTICLE_ADD } = ESegment;
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
          <Image
            src="/images/gemini-logo.png"
            height={20}
            width={20}
            alt="gemini logo"
          />

          <div className="text-zinc-500">
            <SlashIcon size={16} />
          </div>
          <SeoLink
            title={logo[lang]}
            href={`/${lang}`}
            className="text-sm dark:text-zinc-300 truncate w-28 md:w-fit"
          >
            Ezoteric.net
          </SeoLink>
        </div>
      </div>

      <nav className="hidden md:flex flex-row gap-4 items-center">
        <SeoLink title={links.blog.ariaLabel[lang]} href={`/${lang}/${BLOG}`}>
          {links.blog.caption[lang]}
        </SeoLink>

        <ThemeToggle />

        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="py-1.5 px-2 h-fit font-normal"
                variant="secondary"
              >
                {session.user?.name || session.user?.email}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {isAdmin ? (
                <DropdownMenuItem>
                  <Link href={`/${lang}/${MASTER}/${BLOG}/${ARTICLE_ADD}`}>
                    Add New Post
                  </Link>
                </DropdownMenuItem>
              ) : null}

              <DropdownMenuItem className="p-1 z-50">
                <button
                  type="submit"
                  className="w-full text-left px-1 py-0.5 text-red-500"
                  onClick={async () => {
                    'use server';

                    await signOut({
                      redirectTo: `/${lang}`,
                    });
                  }}
                >
                  Sign out
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button className="py-1.5 px-2 h-fit font-normal text-white" asChild>
            <Link href={`/${lang}/login`}>Login</Link>
          </Button>
        )}
      </nav>
    </header>
  );
};
