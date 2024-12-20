"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { Attachment, Message } from "ai";
import { useChat } from "ai/react";
import { Overview } from "./overview";
import { PreviewMessage } from "@/components/custom/message";
import { MultimodalInput } from "./multimodal-input";
import useWindowSize from "./use-window-size";
import { ELanguage } from "@/models/language.model";
import { CHAT_LANG_MODEL } from "@/models/meta/chat.model";

const { chatTitle, overviewTexts } = CHAT_LANG_MODEL;

const ChatWidget = ({
  id,
  initialMessages,
  lang,
}: {
  id: string;
  initialMessages: Array<Message>;
  lang: ELanguage;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  const { messages, handleSubmit, input, setInput, append, isLoading } =
    useChat({
      id,
      body: { id },
      initialMessages,
      maxSteps: 10,
      //   onFinish: () => {
      //     window.history.replaceState({}, "", `${lang}/chat/${id}`);
      //   },
    });

  //   const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Прокрутка донизу при додаванні нових повідомлень
    if (messagesContainerRef.current && isOpen) {
      // if (messagesEndRef.current && messagesContainerRef.current && isOpen) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const toggleChat = () => setIsOpen(!isOpen);
  const { width, height } = useWindowSize();

  const isSmallScreen = width && width < 400;

  const chatVariants = {
    open: {
      width: "300px",
      height: "fit-content",
      opacity: 1,
    },
    openSm: {
      width: "100dvw",
      height: "fit-content",
      opacity: 1,
      bottom: 0,
      right: 0,
    },
    closed: {
      width: "50px",
      height: "50px",
      opacity: 0.9,
    },
  };

  const determineAnimationVariant = () => {
    if (isSmallScreen) {
      return isOpen ? "openSm" : "closed";
    } else {
      return isOpen ? "open" : "closed";
    }
  };

  return (
    <motion.div
      className={clsx(
        "flex flex-col shadow-lg fixed bottom-4 right-4 z-50 md:bottom-8 md:right-8 overflow-hidden",
        isOpen
          ? "bg-background rounded-lg"
          : "bg-primary rounded-full text-white",
      )}
      variants={chatVariants}
      animate={determineAnimationVariant()}
      transition={{ duration: 0.3 }}
      style={{ originX: 1, originY: 1 }}
    >
      {isOpen && (
        <>
          <nav className="flex justify-between items-center px-4 py-2 bg-primary">
            <p className="font-bold">{chatTitle[lang]}</p>
            <button onClick={toggleChat}>
              <X className="size-4" />
              <span className="sr-only"></span>
            </button>
          </nav>

          <section
            className={clsx(
              "flex flex-col grow overflow-y-auto",
              height && height < 580 ? "max-h-[50dvh]" : "max-h-[70dvh]",
            )}
            // className="flex flex-col max-h-[70dvh] grow overflow-y-auto"
            ref={messagesContainerRef}
          >
            {messages.length === 0 && height && height > 450 ? (
              <Overview texts={overviewTexts[lang]} />
            ) : (
              <>
                <div
                  className={clsx(
                    "flex flex-col gap-4 items-center",
                    messages.length > 0 && "p-2",
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
                    />
                  ))}
                </div>

                <div
                  //   ref={messagesEndRef}
                  className="shrink-0 min-w-[24px] min-h-[24px]"
                />
              </>
            )}
          </section>

          <form className="flex flex-row gap-2 relative items-end w-full">
            <MultimodalInput
              lang={lang}
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              stop={stop}
              attachments={attachments}
              setAttachments={setAttachments}
              messages={messages}
              append={append}
            />
          </form>
        </>
      )}

      {!isOpen && (
        <button
          onClick={toggleChat}
          className="size-full flex items-center justify-center"
        >
          Chat
        </button>
      )}
    </motion.div>
  );
};

export default ChatWidget;
