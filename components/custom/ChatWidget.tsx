'use server';

import { CoreMessage } from 'ai';
import { ELanguage } from '@/models/language.model';
import { getChatByEmail } from '@/db/queries';
import { TChat } from '@/db/schema';
import { convertToUIMessages } from '@/lib/utils/utils';
import ChatClient from './ChatClient';

const ChatWidget = async ({
  id,
  lang,
  userName,
  userEmail,
  userImgSrc,
}: {
  id: string;
  lang: ELanguage;
  userName?: string | null;
  userEmail?: string | null;
  userImgSrc?: string | null;
}) => {
  const chatFromDb = userEmail
    ? await getChatByEmail({ email: userEmail })
    : undefined;

  // type casting and converting messages to UI messages
  const chat: TChat | undefined = chatFromDb
    ? {
        ...chatFromDb,
        messages: convertToUIMessages(
          chatFromDb.messages as Array<CoreMessage>
        ),
      }
    : undefined;

  return (
    <ChatClient
      id={chat ? chat.id : id}
      initialMessages={chat ? chat.messages : []}
      lang={lang}
      userImgSrc={userImgSrc}
      userName={userName}
      userEmail={userEmail}
    />
  );
};

export default ChatWidget;
