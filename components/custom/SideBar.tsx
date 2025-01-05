'use client';

// import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { useState } from 'react';

import { MenuIcon } from './icons';
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
import Link from 'next/link';
import { ESegment } from '@/models/url.model';
import { ELanguage } from '@/models/language.model';
import { Session } from 'next-auth';
import SeoLink from './SeoLink';
import { ThemeToggle } from './theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { logout } from '@/app/[lang]/(auth)/actions';
import { HEADER_MODEL } from '@/models/header.model';
import LanguageSwitcher from './LanguageSwitcher';

const { MASTER, BLOG, ARTICLE_ADD } = ESegment;
const { sideBarOpenIcon } = HEADER_MODEL;
const { links } = HEADER_MODEL;

export const SideBar = ({
  session,
  isAdmin,
  lang,
}: {
  session?: Session;
  isAdmin: boolean;
  lang: ELanguage;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Sheet
        open={isOpen}
        onOpenChange={(state) => {
          setIsOpen(state);
        }}
      >
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="p-1.5 h-fit md:hidden"
            onClick={() => {
              setIsOpen(true);
            }}
          >
            <MenuIcon />
            <span className="sr-only">{sideBarOpenIcon.ariaLabel[lang]}</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-3 w-80 bg-muted">
          <SheetHeader>
            {/* TODO: lang */}
            <SheetTitle className="text-left">Site menu</SheetTitle>
            <SheetDescription className="text-left">
              Навігаційне меню
            </SheetDescription>
          </SheetHeader>

          <nav className="flex flex-col gap-2 items-center">
            <SheetClose asChild>
              <SeoLink
                title={links.blog.ariaLabel[lang]}
                href={`/${lang}/${BLOG}`}
              >
                {links.blog.caption[lang]}
              </SeoLink>
            </SheetClose>

            <LanguageSwitcher withCaption />

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
                      className="w-full text-left px-1 py-0.5 text-red-500"
                      onClick={() => logout(`/${lang}`)}
                    >
                      Sign out
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <SheetClose asChild>
                <Button
                  className="py-1.5 px-2 h-fit font-normal text-white"
                  asChild
                >
                  <Link href={`/${lang}/login`}>Login</Link>
                </Button>
              </SheetClose>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
};
// <VisuallyHidden.Root>
