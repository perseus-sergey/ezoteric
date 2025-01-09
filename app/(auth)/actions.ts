'use server';

import { signIn, signOut } from './auth';

export const logout = async (redirectTo: string) =>
  await signOut({ redirectTo });

export const restProviderLinksAction = async (providerId: string) =>
  await signIn(providerId);
