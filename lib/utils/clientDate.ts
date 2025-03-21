'use client';

export const getUserTimeZone = () =>
  Intl.DateTimeFormat().resolvedOptions().timeZone;
