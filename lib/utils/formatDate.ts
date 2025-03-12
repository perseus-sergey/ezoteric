import { ELanguage } from '@/models/language.model';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { enUS, uk } from 'date-fns/locale';

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const formatDateLocal = (date: Date, lang: ELanguage) => {
  const zonedDate = toZonedTime(date, timeZone); // Конвертуємо в локальний час
  return format(zonedDate, 'EEEE dd MMMM', {
    locale: lang === ELanguage.UA ? uk : enUS,
  });
};

export const formatTimeLocal = (date: Date) => {
  const zonedDate = toZonedTime(date, timeZone); // Конвертуємо в локальний час
  return format(zonedDate, 'HH:mm');
};
