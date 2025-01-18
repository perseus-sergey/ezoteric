'use server';

import { deleteChatByEmail, saveChat } from '@/db/queries';
import { Message } from 'ai';

export const saveChatToDb = async (messages: Message[], email: string) => {
  await saveChat({ messages, email });
};

export const removeChatFromDb = async (email: string) => {
  await deleteChatByEmail({ email });
};
