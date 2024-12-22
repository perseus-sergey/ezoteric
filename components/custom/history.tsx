'use client';

import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { User } from 'next-auth';
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

export const History = ({ user }: { user: User | undefined }) => {
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

              <div className="dark:text-zinc-400 text-zinc-500">
                {/* {history === undefined ? "loading" : history.length} chats */}
                Site menu
              </div>
            </div>
          </div>

          {user && user.email ? (
            <div className="text-sm flex flex-row items-center justify-between">
              <div className="flex flex-row gap-2">
                <div className="dark:text-zinc-300">Logged in as</div>

                <div className="dark:text-zinc-400 text-zinc-500">
                  {/* {history === undefined ? "loading" : history.length} chats */}
                  {user.email} {user.id}
                </div>
              </div>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  );
};
