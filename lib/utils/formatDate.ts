import { getTimezoneOffset, toZonedTime } from 'date-fns-tz';
import { format } from 'date-fns';
import { uk, enUS } from 'date-fns/locale';
import { ELanguage } from '@/models/language.model';

export const formatDateLocal = (
  date: Date,
  lang: ELanguage,
  timeZone: string
) => {
  const zonedDate = toZonedTime(date, timeZone); // Конвертуємо в локальний час
  return format(zonedDate, 'EEEE dd MMMM', {
    locale: lang === ELanguage.UA ? uk : enUS,
  });
};

export const formatTimeLocal = (date: Date, timeZone: string) => {
  const zonedDate = toZonedTime(date, timeZone); // Конвертуємо в локальний час
  return format(zonedDate, 'HH:mm');
};

export const getTimezoneWithOffsetStr = (timeZone: string) => {
  const offsetMs = getTimezoneOffset(timeZone);
  const offsetMinutes = Math.abs(offsetMs / 60000);
  const hours = Math.floor(offsetMinutes / 60);
  const minutes = offsetMinutes % 60;
  const sign = offsetMs >= 0 ? '+' : '-';
  const offset = `GMT${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

  return `${timeZone} (${offset})`;
};
