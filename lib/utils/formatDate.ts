import { toZonedTime } from 'date-fns-tz';
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
