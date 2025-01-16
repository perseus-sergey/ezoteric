'use client';

import { ChatRequestOptions, CreateMessage, Message } from 'ai';
import { motion } from 'framer-motion';
import React, { useRef, useCallback } from 'react';
import { toast } from 'sonner';

import { ArrowUpIcon, StopIcon } from './icons';
import useWindowSize from './use-window-size';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { chatSuggestedActions } from '@/models/chat.model';
import { ELanguage } from '@/models/language.model';

export function MultimodalInput({
  lang,
  input,
  // userName,
  setInput,
  isLoading,
  stop,
  messages,
  append,
  handleSubmit,
}: {
  lang: ELanguage;
  input: string;
  userName?: string | null;
  setInput: (value: string) => void;
  isLoading: boolean;
  stop: () => void;
  messages: Array<Message>;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
  handleSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions
  ) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { width } = useWindowSize();

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    // adjustHeight();
  };

  const submitForm = useCallback(() => {
    handleSubmit();

    if (width && width > 768) {
      textareaRef.current?.focus();
    }
  }, [handleSubmit, width]);

  return (
    <div className="w-full max-h-[70dvh] flex flex-col gap-4 p-1">
      {messages.length === 0 && (
        <div className="grid sm:grid-cols-2 gap-2 sm:gap-4 w-full md:px-0 mx-auto overflow-y-scroll">
          {chatSuggestedActions.map((suggestedAction, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.05 * index }}
              key={index}
              // className={index > 1 ? 'hidden sm:block' : 'block'}
            >
              <button
                role="button"
                onClick={async () => {
                  append({
                    role: 'user',
                    content: suggestedAction.action(lang),
                  });
                }}
                className="border-none bg-muted/50 w-full text-left border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 rounded-lg p-3 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex flex-col"
              >
                {suggestedAction.label && suggestedAction.label[lang] ? (
                  <>
                    <span className="font-medium">
                      {suggestedAction.title[lang]}
                    </span>
                    <span className="text-zinc-500 dark:text-zinc-400">
                      {suggestedAction.label[lang]}
                    </span>
                  </>
                ) : (
                  <span className="font-medium">
                    {suggestedAction.action(lang)}
                  </span>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      )}

      <Textarea
        ref={textareaRef}
        placeholder="Send a message..."
        value={input}
        onChange={handleInput}
        className="overflow-y-scroll pr-9 resize-none text-base bg-muted border-none"
        rows={3}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();

            if (isLoading) {
              toast.error(
                'Please wait for the specialist to finish its response!'
              );
            } else {
              submitForm();
            }
          }
        }}
      />

      {isLoading ? (
        <Button
          className="rounded-full p-1.5 h-fit absolute bottom-2 right-2 m-0.5 text-white"
          onClick={(event) => {
            event.preventDefault();
            stop();
          }}
        >
          <StopIcon />
        </Button>
      ) : (
        <Button
          className="rounded-full p-1.5 h-fit absolute bottom-2 right-2 m-0.5 text-white"
          onClick={(event) => {
            event.preventDefault();
            submitForm();
          }}
          disabled={input.length === 0}
        >
          <ArrowUpIcon />
        </Button>
      )}
    </div>
  );
}
