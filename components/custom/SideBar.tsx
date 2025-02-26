import { Button } from '../ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';

import { ESegment } from '@/models/url.model';
import { ELanguage } from '@/models/language.model';
import { Session } from 'next-auth';
import SeoLink from './SeoLink';
import { HEADER_MODEL, SIDEBAR } from '@/models/header.model';
import LanguageSwitcher from './LanguageSwitcher';
import { BookOpenText, Menu } from 'lucide-react';
import UserMenu from './UserMenu';
import LoginProviders from './LoginProviders';
import ThemeToggleWrapped from './ThemeToggle';
import TestsMenu from './TestsMenu';
import { Quest } from '@/svg/Quest';
import { Separator } from '../ui/separator';
import { Suspense } from 'react';

const { BLOG } = ESegment;
const { sideBarOpenIcon, links } = HEADER_MODEL;

export default function SideBar({
  session,
  isAdmin,
  lang,
}: {
  session?: Session;
  isAdmin: boolean;
  lang: ELanguage;
}) {
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="p-1.5 h-fit md:hidden">
            <Menu className="size-6" />
            <span className="sr-only">{sideBarOpenIcon.ariaLabel[lang]}</span>
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="p-3 w-80 bg-muted">
          <SheetHeader>
            <SheetTitle className="text-left">{SIDEBAR.title[lang]}</SheetTitle>
            <SheetDescription className="text-left">
              {SIDEBAR.description[lang]}
            </SheetDescription>
          </SheetHeader>

          <nav className="w-fit px-4 py-8 flex flex-col items-start gap-2 font-georgia">
            <SheetClose asChild>
              <SeoLink
                className="flex items-center gap-4 px-4 py-2"
                title={links.blog.ariaLabel[lang]}
                href={`/${lang}/${BLOG}`}
              >
                <BookOpenText className="size-6 text-muted-foreground" />
                {links.blog.caption[lang]}
              </SeoLink>
            </SheetClose>

            <div className="flex items-center gap-4 px-4 py-2">
              <Quest className="size-6 opacity-90" />
              <Suspense>
                <TestsMenu lang={lang} className="p-0" isSideMenu />
              </Suspense>
            </div>

            <Separator />

            <LanguageSwitcher withCaption />

            <ThemeToggleWrapped lang={lang} withCaption />

            <Separator />

            {session ? (
              <UserMenu
                lang={lang}
                userEmail={session?.user?.email}
                userName={session?.user?.name}
                userImgSrc={session?.user?.image}
                isAdmin={isAdmin}
              />
            ) : (
              <LoginProviders lang={lang} withIcons />
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}
