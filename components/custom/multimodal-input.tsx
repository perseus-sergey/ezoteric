'use client';

import { Attachment, ChatRequestOptions, CreateMessage, Message } from 'ai';
import { motion } from 'framer-motion';
import React, {
  useRef,
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
  ChangeEvent,
} from 'react';
import { toast } from 'sonner';

import { ArrowUpIcon, PaperclipIcon, StopIcon } from './icons';
import { PreviewAttachment } from './preview-attachment';
import useWindowSize from './use-window-size';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { chatSuggestedActions } from '@/models/chat.model';
import { ELanguage } from '@/models/language.model';

export function MultimodalInput({
  lang,
  input,
  userName,
  setInput,
  isLoading,
  stop,
  attachments,
  setAttachments,
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
  attachments: Array<Attachment>;
  setAttachments: Dispatch<SetStateAction<Array<Attachment>>>;
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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([]);

  const submitForm = useCallback(() => {
    handleSubmit(undefined, {
      experimental_attachments: attachments,
    });

    setAttachments([]);

    if (width && width > 768) {
      textareaRef.current?.focus();
    }
  }, [attachments, handleSubmit, setAttachments, width]);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`/api/files/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const { url, pathname, contentType } = data;

        return {
          url,
          name: pathname,
          contentType: contentType,
        };
      } else {
        const { error } = await response.json();
        toast.error(error);
      }
    } catch (error) {
      toast.error(
        `Failed to upload file, please try again! Error Name: ${
          (error as Error).name
        }`
      );
    }
  };

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);

      setUploadQueue(files.map((file) => file.name));

      try {
        const uploadPromises = files.map((file) => uploadFile(file));
        const uploadedAttachments = await Promise.all(uploadPromises);
        const successfullyUploadedAttachments = uploadedAttachments.filter(
          (attachment) => attachment !== undefined
        );

        setAttachments((currentAttachments) => [
          ...currentAttachments,
          ...successfullyUploadedAttachments,
        ]);
      } catch (error) {
        console.error('Error uploading files!', error);
      } finally {
        setUploadQueue([]);
      }
    },
    [setAttachments]
  );

  return (
    <div className="w-full max-h-[70dvh] flex flex-col gap-4 p-1">
      {messages.length === 0 &&
        attachments.length === 0 &&
        uploadQueue.length === 0 && (
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

      <input
        type="file"
        className="fixed -top-4 -left-4 size-0.5 opacity-0 pointer-events-none"
        ref={fileInputRef}
        multiple
        onChange={handleFileChange}
        tabIndex={-1}
      />

      {(attachments.length > 0 || uploadQueue.length > 0) && (
        <div className="flex flex-row gap-2 overflow-x-scroll">
          {attachments.map((attachment) => (
            <PreviewAttachment key={attachment.url} attachment={attachment} />
          ))}

          {uploadQueue.map((filename) => (
            <PreviewAttachment
              key={filename}
              attachment={{
                url: '',
                name: filename,
                contentType: '',
              }}
              isUploading={true}
            />
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
          disabled={input.length === 0 || uploadQueue.length > 0}
        >
          <ArrowUpIcon />
        </Button>
      )}

      {userName && (
        <Button
          className="rounded-full p-1.5 h-fit absolute bottom-10 right-2 m-0.5 dark:border-zinc-700"
          onClick={(event) => {
            event.preventDefault();
            fileInputRef.current?.click();
          }}
          variant="outline"
          disabled={isLoading}
        >
          <PaperclipIcon className="-rotate-45" />
        </Button>
      )}
    </div>
  );
}
