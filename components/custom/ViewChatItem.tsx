'use client';

import { TChat } from '@/db/schema';
import { Button } from '../ui/button';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { PreviewMessage } from './message';

export const ViewChatItem = ({ chat }: { chat: TChat }) => {
  const { createdAt, messages, email, id } = chat;
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <li>
      <Button variant="ghost" onClick={() => setModalOpen(true)}>
        {email}{' '}
        <span className="opacity-50">
          ({createdAt.toLocaleDateString('en-CA')})
        </span>
      </Button>

      <AlertDialog open={modalOpen} onOpenChange={setModalOpen}>
        <AlertDialogContent className="overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl">
              Chat
            </AlertDialogTitle>
            <AlertDialogDescription className="flex gap-4 justify-between w-full">
              {email}
              <span>{createdAt.toLocaleDateString('en-CA')}</span>
            </AlertDialogDescription>

            <div className="max-h-[50dvh] space-y-4 overflow-y-auto">
              {messages.map((message) => (
                <PreviewMessage
                  key={message.id}
                  chatId={id}
                  role={message.role}
                  content={message.content}
                  attachments={message.experimental_attachments}
                  toolInvocations={message.toolInvocations}
                />
              ))}
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </li>
  );
};
