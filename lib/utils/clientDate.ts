'use client';

export const getUserTimeZone = () =>
  Intl.DateTimeFormat().resolvedOptions().timeZone;

export const getAvailableTimeZones = () => Intl.supportedValuesOf('timeZone'); // Отримуємо список часових поясів
