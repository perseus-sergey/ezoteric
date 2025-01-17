'use server';

import { saveChat } from '@/db/queries';
import { Message } from 'ai';

export const saveChatToDb = async (
  messages: Message[],
  id: string,
  email: string
) => {
  await saveChat({
    id,
    messages,
    email,
  });
};
