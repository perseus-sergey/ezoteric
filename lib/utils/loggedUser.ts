'use server';

import { auth } from '@/app/(auth)/auth';
import { Session } from 'next-auth';
import { cache } from 'react';

export const isAdminAuth = cache(async (session?: Session) => {
  const userSession = session || (await auth());
  const adminEmail = process.env.ADMIN_EMAIL || '';
  const adminEmailOlena = process.env.ADMIN_EMAIL_OLENA || '';

  return userSession &&
    userSession.user &&
    userSession.user.email &&
    [adminEmail, adminEmailOlena].includes(userSession.user.email)
    ? true
    : false;
});
