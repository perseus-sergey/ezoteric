'use server';

import { auth } from '@/app/(auth)/auth';
import { Session } from 'next-auth';
import { cache } from 'react';

export const isAdminAuth = cache(async (session?: Session) => {
  const userSession = session || (await auth());
  const adminEmail = process.env.ADMIN_EMAIL;

  return userSession &&
    userSession.user &&
    adminEmail &&
    userSession.user.email === adminEmail
    ? true
    : false;
});
