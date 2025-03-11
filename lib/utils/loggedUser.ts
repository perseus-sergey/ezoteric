'use server';

import { auth } from '@/app/(auth)/auth';
import { Session } from 'next-auth';
import { cache } from 'react';

export const isAdminAuth = cache(async (session?: Session) => {
  const userSession = session === undefined ? await auth() : session;

  const adminEmail = process.env.ADMIN_EMAIL || '';
  const adminEmailOlena = process.env.ADMIN_EMAIL_OLENA || '';

  return userSession &&
    userSession.user &&
    userSession.user.email &&
    [adminEmail, adminEmailOlena].includes(userSession.user.email)
    ? true
    : false;
});

export const isAuthorized = cache(async (session?: Session | null) => {
  const userSession = session === undefined ? await auth() : session;

  return userSession && userSession.user && userSession.user.email
    ? true
    : false;
});
