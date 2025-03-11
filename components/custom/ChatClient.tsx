'use client';

import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';
import { Message } from 'ai';
import { useChat } from 'ai/react';
import { Overview } from './overview';
import { PreviewMessage } from '@/components/custom/message';
import { MultimodalInput } from './multimodal-input';
import useWindowSize from './use-window-size';
import { ELanguage } from '@/models/language.model';
import {
  CHAT_MODEL,
  LS_CHAT_MAX_MESSAGES,
  LS_CHAT_NAME,
} from '@/models/chat.model';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import { removeChatFromDb, saveChatToDb } from '@/actions/chat.action';
import { toast } from 'sonner';
import { MessageIcon } from '@/svg/MessageIcon';
import { DialogEyes } from '@/svg/DialogEyes';

const { chatTitle, chatBtn, closeBtn } = CHAT_MODEL;

const parseMessages = (storedMessages: string | null): Message[] => {
  try {
    return JSON.parse(storedMessages || '[]');
  } catch (error) {
    console.error('Error parsing messages:', error);
    return [];
  }
};

const ChatClient = ({
  id,
  initialMessages: serverInitialMessages,
  lang,
  userName,
  userEmail,
  userImgSrc,
}: {
  id: string;
  initialMessages: Array<Message>;
  lang: ELanguage;
  userName?: string | null;
  userEmail?: string | null;
  userImgSrc?: string | null;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [initialMessages, setInitialMessages] = useState<Message[]>([]);

  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    isLoading,
  } = useChat({
    id,
    body: { id },
    initialMessages,
    maxSteps: 10,
  });

  // якщо користувач не авторизован - setInitialMessages із localStorage
  // якщо користувач авторизован - setInitialMessages із бд (serverInitialMessages)
  // якщо користувач був не авторизован, спілкувався в чаті і входить в акаунт - переносимо initialMessages із localStorage в бд і очищуємо localStorage
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const storedMessages = localStorage.getItem(LS_CHAT_NAME);
        const parsedMessages = parseMessages(storedMessages);

        if (!userEmail) {
          setInitialMessages(parsedMessages);
        } else {
          if (storedMessages) {
            try {
              await saveChatToDb(parsedMessages, userEmail);
              localStorage.removeItem(LS_CHAT_NAME);
              setInitialMessages(parsedMessages);
            } catch (dbError) {
              console.error('Error saving messages to database:', dbError);
              setInitialMessages(
                storedMessages ? parsedMessages : serverInitialMessages
              );
              // TODO: Повідомити користувача про помилку?
            }
          } else setInitialMessages(serverInitialMessages);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
        localStorage.removeItem(LS_CHAT_NAME);
        if (userEmail) {
          setInitialMessages(serverInitialMessages);
        }
      }
    };

    loadMessages();
  }, [userEmail, serverInitialMessages]);

  useEffect(() => {
    // if user is not logged in save last LS_CHAT_MAX_MESSAGES messages to LS at each messages change
    if (!messages.length || userEmail) return;

    localStorage.setItem(
      LS_CHAT_NAME,
      JSON.stringify(messages.slice(-LS_CHAT_MAX_MESSAGES))
    );
  }, [messages, userEmail]);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Прокрутка донизу при додаванні нових повідомлень
    if (messagesContainerRef.current && isOpen) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const clearChat = async () => {
    setMessages([]);
    setInitialMessages([]);

    if (userEmail) {
      try {
        await removeChatFromDb(userEmail);
      } catch (error) {
        toast.error(
          `${(error as Error).name}. Failed to remove chat from database.`
        );
      }
    } else {
      try {
        localStorage.removeItem(LS_CHAT_NAME);
      } catch (error) {
        toast.error(`${(error as Error).name}. Failed to remove chat.`);
      }
    }
  };

  const toggleChat = () => setIsOpen(!isOpen);
  const { height } = useWindowSize();

  return (
    <div
      className={clsx(
        'flex flex-col max-h-full shadow-lg fixed z-50 overflow-hidden',
        isOpen
          ? 'md:bottom-4 md:right-4 bottom-0 right-0 bg-background h-fit w-dvw md:w-96 rounded-lg'
          : 'md:bottom-8 md:right-8 bottom-4 right-4 bg-primary size-14 hover:scale-110 transition-transform duration-200 font-georgia rounded-full'
      )}
    >
      {isOpen && (
        <>
          <nav className="flex justify-between items-center px-4 sm:py-2 bg-primary">
            <div className="flex items-center gap-2">
              <MessageIcon className="size-4 opacity-50" />
              <span className="font-bold">{chatTitle[lang]}</span>
            </div>
            <Button onClick={toggleChat}>
              <X className="scale-125" />
              <span className="sr-only">{closeBtn.ariaLabel[lang]}</span>
            </Button>
          </nav>

          <section
            className={clsx(
              'flex flex-col grow overflow-y-auto',
              height && height < 580 ? 'max-h-[50dvh]' : 'max-h-[70dvh]'
            )}
            // className="flex flex-col max-h-[70dvh] grow overflow-y-auto"
            ref={messagesContainerRef}
          >
            {messages.length === 0 && height && height > 450 ? (
              <Overview lang={lang} />
            ) : (
              <>
                <div
                  className={clsx(
                    'flex flex-col gap-4 items-center',
                    messages.length > 0 && 'p-2'
                  )}
                >
                  {messages.map((message) => (
                    <PreviewMessage
                      key={message.id}
                      chatId={id}
                      role={message.role}
                      content={message.content}
                      attachments={message.experimental_attachments}
                      toolInvocations={message.toolInvocations}
                      userName={userName}
                      userImgSrc={userImgSrc}
                    />
                  ))}
                </div>

                {isLoading && (
                  <div className="flex space-x-4 px-2">
                    <Skeleton className="size-6 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  </div>
                )}

                <div className="shrink-0 min-w-[24px] min-h-[24px]" />
              </>
            )}
          </section>

          <form className="w-full max-h-[90dvh]">
            <MultimodalInput
              lang={lang}
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              messages={messages}
              append={append}
              clearChat={clearChat}
            />
          </form>
        </>
      )}

      {!isOpen && (
        <button
          onClick={toggleChat}
          className="size-full flex items-center justify-center text-white"
          aria-label={chatBtn.ariaLabel[lang]}
        >
          <DialogEyes className="size-10" />
        </button>
      )}
    </div>
  );
};

export default ChatClient;
