import { format } from 'date-fns';
import { uk, enUS } from 'date-fns/locale';
import { TAppointmentFormValues } from '@/models/schedule.model';
import { TSchedule } from '@/db/schema';
import { sendMail } from '../sendMail';
import { ESegment, MAIN_URL } from '@/models/url.model';
import { DEFAULT_LANG, ELanguage } from '@/models/language.model';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || MAIN_URL;
const { MASTER, SCHEDULE } = ESegment;

const formatDate = (date: Date, lang: ELanguage) =>
  format(date, 'EEEE dd MMMM', { locale: lang === ELanguage.UA ? uk : enUS });
const formatTime = (date: Date) => format(date, 'HH:mm');

const adminEmail = process.env.ADMIN_EMAIL;
if (!adminEmail) {
  console.error('Змінна середовища ADMIN_EMAIL не встановлена.');
  throw new Error(
    'Admin email configuration is missing in environment variables.'
  );
}

export const sendBookingConfirmationEmailToUser = async (
  formData: TAppointmentFormValues,
  timeSlot: TSchedule,
  lang: ELanguage
) => {
  const { name, email, question } = formData;
  const meetDateFormatted = formatDate(timeSlot.meetDate, lang);
  const meetTimeFormatted = formatTime(timeSlot.meetDate);

  const mailOptions = {
    to: email,
    subject: 'Підтвердження бронювання сеансу на ezoteric.net',
    body: `
            <p>Привіт, ${name}!</p>
            <p>Ваш сеанс на ezoteric.net успішно заброньовано.</p>
            <p><b>Дата:</b> ${meetDateFormatted}</p>
            <p><b>Час:</b> ${meetTimeFormatted}</p>
            ${question ? `<p><b>Ваше питання:</b> ${question}</p>` : ''}
            <p>До зустрічі!</p>
            <p>З повагою,<br>Команда ezoteric.net</p>
        `,
  };

  try {
    await sendMail(mailOptions);
    console.log(
      `Email підтвердження бронювання відправлено користувачу: ${email}`
    );
  } catch (error) {
    console.error('Помилка відправлення email користувачу:', error);
    throw new Error('Не вдалося відправити email підтвердження користувачу.');
  }
};

// Функція для надсилання email адміністратору
export const sendBookingConfirmationEmailToAdmin = async (
  formData: TAppointmentFormValues,
  timeSlot: TSchedule,
  lang: ELanguage
) => {
  const { name, email, question } = formData;
  const meetDateFormatted = formatDate(timeSlot.meetDate, lang);
  const meetTimeFormatted = formatTime(timeSlot.meetDate);

  const mailOptions = {
    to: adminEmail, // Email адміністратора
    subject: 'Нове бронювання сеансу на ezoteric.net',
    body: `
            <p>Нове бронювання сеансу на ezoteric.net!</p>
            <p><b>Ім'я користувача:</b> ${name}</p>
            <p><b>Email користувача:</b> ${email}</p>
            <p><b>Дата:</b> ${meetDateFormatted}</p>
            <p><b>Час:</b> ${meetTimeFormatted}</p>
            ${question ? `<p><b>Питання користувача:</b> ${question}</p>` : ''}
            <p>Перевірте <a href="${[baseUrl, DEFAULT_LANG, MASTER, SCHEDULE].join('/')}">розклад адміністратора</a> для деталей.</p>
            <p>З повагою,<br>Система сповіщень ezoteric.net</p>
        `,
  };

  try {
    await sendMail(mailOptions);
    console.log(
      `Email сповіщення про бронювання відправлено адміністратору: ${adminEmail}`
    );
  } catch (error) {
    console.error('Помилка відправлення email адміністратору:', error);
    // Адміністратору важливо знати про бронювання, але помилка тут не повинна зупиняти процес для користувача
    // Можна розглянути варіант логування помилки або відправки сповіщення іншим способом, якщо це критично
  }
};
