'use server';

import 'server-only';

import { CoreMessage, Message } from 'ai';
import { genSaltSync, hashSync } from 'bcrypt-ts';
import { eq, sql } from 'drizzle-orm';

import { user, chat, TUser, reservation, TChat } from './schema';
import { getDB } from './root';
import { convertToUIMessages } from '@/lib/utils/utils';

const db = getDB();

// Not used anywhere
export async function getUser(email: string): Promise<Array<TUser>> {
  try {
    return await db.select().from(user).where(eq(user.email, email)).limit(1);
  } catch (error) {
    console.error('Failed to get user from database');
    throw error;
  }
}

// Not used anywhere
export async function createUser(
  email: string,
  password: string,
  name: string | null = null
) {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);

  try {
    const newUser = await db
      .insert(user)
      .values({ email, password: hash, name })
      .returning();
    return newUser[0];
  } catch (error) {
    console.error('Failed to create user in database');
    throw error;
  }
}

export async function saveChat({
  messages,
  email,
}: {
  messages: (Message | CoreMessage)[];
  email: string;
}) {
  try {
    const selectedChats = await db
      .select()
      .from(chat)
      .where(eq(chat.email, email));

    if (selectedChats.length > 0) {
      return await db
        .update(chat)
        .set({
          messages: JSON.stringify(messages),
        })
        .where(eq(chat.email, email));
    }

    return await db.insert(chat).values({
      createdAt: new Date(),
      messages: JSON.stringify(messages),
      email,
    });
  } catch (error) {
    throw error;
  }
}

export async function deleteChatByEmail({ email }: { email: string }) {
  try {
    return await db.delete(chat).where(eq(chat.email, email));
  } catch (error) {
    console.error('Failed to delete chat by email from database');
    throw error;
  }
}

export async function getChatByEmail({ email }: { email: string }) {
  try {
    const [selectedChat] = await db
      .select()
      .from(chat)
      .where(eq(chat.email, email))
      .limit(1);
    return selectedChat;
  } catch (error) {
    console.error(
      `${(error as Error).name}. Failed to get chat by email from database`
    );
    return undefined;
  }
}

export async function getChatListChunk({
  offset,
  perPage,
}: {
  offset: number;
  perPage: number;
}): Promise<{
  totalCount: number | null;
  chatList: TChat[] | null;
}> {
  try {
    const totalCountRes = await db
      .select({
        total_count: sql<number>`COUNT(${chat.id})`.mapWith(Number),
      })
      .from(chat);

    const totalCount = totalCountRes[0]?.total_count || 0;

    const chatListRaw = await db
      .select()
      .from(chat)
      .limit(perPage)
      .offset(offset);

    const chatList: TChat[] = chatListRaw.map((rawChat) => ({
      ...rawChat,
      messages: convertToUIMessages(rawChat.messages as Array<CoreMessage>),
    }));

    return { chatList, totalCount };
  } catch (error) {
    console.error(error);
    return { totalCount: null, chatList: null };
  }
}

export async function createReservation({
  id,
  email,
  details,
}: {
  id: string;
  email: string;
  details: string;
}) {
  return await db.insert(reservation).values({
    id,
    createdAt: new Date(),
    email,
    hasCompletedPayment: false,
    details: JSON.stringify(details),
  });
}

export async function getReservationById({ id }: { id: string }) {
  const [selectedReservation] = await db
    .select()
    .from(reservation)
    .where(eq(reservation.id, id));

  return selectedReservation;
}

export async function updateReservation({
  id,
  hasCompletedPayment,
}: {
  id: string;
  hasCompletedPayment: boolean;
}) {
  return await db
    .update(reservation)
    .set({
      hasCompletedPayment,
    })
    .where(eq(reservation.id, id));
}
