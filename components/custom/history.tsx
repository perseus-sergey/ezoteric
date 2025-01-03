'use client';

import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { useState } from 'react';

import { MenuIcon } from './icons';
import { Button } from '../ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';
import Link from 'next/link';
import { ESegment } from '@/models/url.model';
import { ELanguage } from '@/models/language.model';

const { MASTER, BLOG, ARTICLE_ADD } = ESegment;

export const History = ({
  isAdmin,
  lang,
}: {
  isAdmin: boolean;
  lang: ELanguage;
}) => {
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        className="p-1.5 h-fit"
        onClick={() => {
          setIsHistoryVisible(true);
        }}
      >
        <MenuIcon />
      </Button>

      <Sheet
        open={isHistoryVisible}
        onOpenChange={(state) => {
          setIsHistoryVisible(state);
        }}
      >
        <SheetContent side="left" className="p-3 w-80 bg-muted">
          <SheetHeader>
            <VisuallyHidden.Root>
              <SheetTitle className="text-left">Left bar</SheetTitle>
              <SheetDescription className="text-left">
                {/* {history === undefined ? "loading" : history.length} chats */}
                Site menu
              </SheetDescription>
            </VisuallyHidden.Root>
          </SheetHeader>

          <div className="text-sm flex flex-row items-center justify-between">
            <div className="flex flex-row gap-2">
              <div className="dark:text-zinc-300">Left bar</div>

              <div className="dark:text-zinc-400 text-zinc-500">Site menu</div>
            </div>
          </div>

          {isAdmin ? (
            <Link href={`/${lang}/${MASTER}/${BLOG}/${ARTICLE_ADD}`}>
              Add New Post
            </Link>
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  );
};
