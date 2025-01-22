'use server';

import 'server-only';

import { CoreMessage, Message } from 'ai';
import { genSaltSync, hashSync } from 'bcrypt-ts';
import { eq } from 'drizzle-orm';

import { user, chat, TUser, reservation } from './schema';
import { getDB } from './root';

const db = getDB();

export async function getUser(email: string): Promise<Array<TUser>> {
  try {
    return await db.select().from(user).where(eq(user.email, email)).limit(1);
  } catch (error) {
    console.error('Failed to get user from database');
    throw error;
  }
}

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

// export async function getChatListChunk({
//   offset,
//   perPage,
// }: {
//   offset: number;
//   perPage: number;
// }): Promise<{
//   totalCount: number | null;
//   chatList: TChat[] | null;
// }> {
//   try {
//     const [selectedChat] = await db
//       .select()
//       .from(chat)
//     return selectedChat;
//   } catch (error) {
//     console.error(
//       `${(error as Error).name}. Failed to get chat by email from database`
//     );
//     return undefined;
//   }
// }

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
