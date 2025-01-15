'use client';

import Link from 'next/link';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ELanguage } from '@/models/language.model';
import { ESegment } from '@/models/url.model';
import { HEADER_LOGIN } from '@/models/header.model';
import { LogOut } from 'lucide-react';
import { useState } from 'react';
import { logout } from '@/app/(auth)/actions';
import { PersonCelebrateRounded } from '@/svg/PersonCelebrateRounded';
import { LOGOUT_MODAL } from '@/models/modal.model';
import Image from 'next/image';

const { BLOG, MASTER, ARTICLE_ADD } = ESegment;
const { title, description, cancelBtn, confirmBtn } = LOGOUT_MODAL;

export default function UserMenu({
  lang,
  userEmail,
  userName,
  userImgSrc,
  isAdmin,
  withIcons = false,
}: {
  lang: ELanguage;
  isAdmin: boolean;
  withIcons?: boolean;
  userName?: string | null;
  userEmail?: string | null;
  userImgSrc?: string | null;
}) {
  const [isListOpen, setListOpen] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu onOpenChange={setListOpen} open={isListOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            className="[&_svg]:size-6"
            variant={withIcons ? 'ghost' : 'outline'}
          >
            {userImgSrc ? (
              <Image
                src={userImgSrc}
                width={24}
                height={24}
                alt={`${userName}'s avatar`}
                className="rounded-full"
              />
            ) : (
              <PersonCelebrateRounded className="text-muted-foreground" />
            )}

            {userName || userEmail}

            <span
              className="rotate-90 opacity-50 text-xl tracking-tight leading-none pb-2"
              aria-label="More options"
              role="img"
            >
              ...
            </span>
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
            <Button
              variant="destructive"
              className="py-2 px-4 size-fit"
              onClick={() => {
                setListOpen(false);
                setDialogOpen(true);
              }}
            >
              {HEADER_LOGIN.signout[lang]}
              <LogOut />
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title[lang]}</AlertDialogTitle>
            <AlertDialogDescription>{description[lang]}</AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>{cancelBtn[lang]}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={() => logout(`/${lang}`)}
            >
              {confirmBtn[lang]}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
