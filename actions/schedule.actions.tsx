'use server';

import { appointmentSchedule, TSchedule } from '@/db/schema'; // Шлях до вашої схеми appointmentSchedule
import { revalidateTag } from 'next/cache';
import { TAppointmentFormValues } from '@/models/schedule.model';
import { eq, isNull } from 'drizzle-orm';
import { getDB } from '@/db/root';
import { ESegment } from '@/models/url.model';
import {
  MailMeetBookToUser,
  MailMeetBookAdmin,
} from '@/lib/mail/templates/ReactEmailTemplates';
import { render } from '@react-email/components';
import { ELanguage } from '@/models/language.model';
import { sendMail } from '@/lib/mail/sendMail';
import { fromZonedTime, toDate } from 'date-fns-tz';
import {
  BOOK_APPOINTMENT_ACTION,
  SCHEDULE_EMAIL,
} from '@/models/scheduleEmail.model';
import { format } from 'date-fns';

const db = getDB();
const { MASTER } = ESegment;

const {
  timeBooked,
  timeNotFound,
  errorDbBooked,
  errorSendMailToAdmin,
  errorSendMailToUser,
  bookingConsoleError,
  bookingError,
} = BOOK_APPOINTMENT_ACTION;

export const getScheduleAction = async (
  withReserved = true
): Promise<{
  success: boolean;
  data?: TSchedule[];
  error?: string;
}> => {
  const reservedCondition = withReserved
    ? undefined
    : isNull(appointmentSchedule.reservedAt);

  try {
    const allAppointments = await db
      .select()
      .from(appointmentSchedule)
      .where(reservedCondition);

    console.log('🚀 ~ getScheduleAction ~ allAppointments:', allAppointments);

    return { success: true, data: allAppointments };
  } catch (error) {
    console.error('Помилка отримання графіку:', error);
    return {
      success: false,
      error: 'Не вдалося завантажити графік зустрічей з Бази Даних.',
    };
  }
};

// export const addTimeSlotAction = async (
//   date: Date,
//   time: string,
//   timeZone: string
// ): Promise<{
//   success: boolean;
//   error?: string;
//   data?: typeof appointmentSchedule.$inferSelect;
// }> => {
//   try {
//     const [hours, minutes] = time.split(':').map(Number);
//     const meetDateTime = new Date(date); // Клонуємо дату, щоб уникнути мутації
//     meetDateTime.setHours(hours, minutes, 0, 0); // Встановлюємо час для дати

//     // Перетворюємо meetDateTime в UTC, враховуючи часовий пояс
//     const utcMeetDateTime = fromZonedTime(meetDateTime, timeZone);

//     // Перевірка, чи час сеансу вже існує для цієї дати і часу
//     const existingTimeSlot = await db.query.appointmentSchedule.findFirst({
//       where: eq(appointmentSchedule.meetDate, utcMeetDateTime),
//     });

//     if (existingTimeSlot) {
//       return { success: false, error: 'Час сеансу вже існує для цієї дати.' };
//     }

//     // Додавання часу сеансу
//     const insertedTimeSlots = await db
//       .insert(appointmentSchedule)
//       .values({ meetDate: utcMeetDateTime })
//       .returning(); // Отримуємо вставлені дані

//     if (!insertedTimeSlots || insertedTimeSlots.length === 0) {
//       return {
//         success: false,
//         error: 'Не вдалося додати час сеансу до бази даних.',
//       };
//     }

//     revalidateTag(MASTER);

//     const data = {
//       ...insertedTimeSlots[0],
//       meetDate: toZonedTime(insertedTimeSlots[0].meetDate, timeZone),
//     };
//     console.log('🚀 ~ addTimeSlotAction ~ data:', data);

//     return {
//       success: true,
//       data,
//     }; // Повертаємо дані вставленого запису з урахуванням timeZone користувача
//   } catch (error) {
//     console.error('Помилка додавання часу сеансу:', error);
//     return { success: false, error: 'Не вдалося додати час сеансу.' };
//   }
// };

export const addTimeSlotAction = async (
  date: Date,
  time: string,
  timeZone: string
): Promise<{
  success: boolean;
  error?: string;
  data?: typeof appointmentSchedule.$inferSelect;
}> => {
  try {
    // const zonedDate = new Date(date);
    // zonedDate.setHours(
    //   parseInt(time.split(':')[0], 10),
    //   parseInt(time.split(':')[1], 10),
    //   0,
    //   0
    // );

    // // Конвертуємо в UTC для зберігання в базі даних
    // const utcMeetDateTime = fromZonedTime(zonedDate, timeZone);

    // Format the date part of the Date object to yyyy-MM-dd in local time
    const datePart = format(date, 'yyyy-MM-dd');
    const dateTimeString = `${datePart}T${time}:00`; // Combine date and time strings

    console.log(
      '🚀 ~ addTimeSlotAction ~ dateTimeString (local):',
      dateTimeString
    );

    // Parse the combined date-time string in the user's timezone using toDate from date-fns-tz
    const zonedDate = toDate(dateTimeString, { timeZone: timeZone });
    const utcMeetDateTime = fromZonedTime(zonedDate, timeZone);

    console.log(
      '🚀 ~ addTimeSlotAction ~ zonedDate (local Date object):',
      zonedDate
    );
    console.log(
      '🚀 ~ addTimeSlotAction ~ zonedDate.toISOString() (UTC representation of zonedDate):',
      zonedDate.toISOString()
    );

    // Перевірка, чи час сеансу вже існує для цієї дати і часу (використовуємо utcMeetDateTime для порівняння)
    const existingTimeSlot = await db.query.appointmentSchedule.findFirst({
      where: eq(appointmentSchedule.meetDate, utcMeetDateTime),
    });

    if (existingTimeSlot) {
      return { success: false, error: 'Час сеансу вже існує для цієї дати.' };
    }

    // Додавання часу сеансу
    const insertedTimeSlots = await db
      .insert(appointmentSchedule)
      .values({ meetDate: utcMeetDateTime })
      .returning();

    if (!insertedTimeSlots || insertedTimeSlots.length === 0) {
      return {
        success: false,
        error: 'Не вдалося додати час сеансу до бази даних.',
      };
    }

    revalidateTag(MASTER);

    console.log(
      '🚀 ~ addTimeSlotAction ~ insertedTimeSlots[0] after db:',
      insertedTimeSlots[0]
    );

    return {
      success: true,
      data: insertedTimeSlots[0],
    };
  } catch (error) {
    console.error('Помилка додавання часу сеансу:', error);
    return { success: false, error: 'Не вдалося додати час сеансу.' };
  }
};

export const deleteTimeSlotAction = async (
  date: Date,
  time: string,
  timeZone: string = 'Europe/Kiev'
): Promise<{ success: boolean; error?: string }> => {
  try {
    const [hours, minutes] = time.split(':').map(Number);
    const meetDateTime = new Date(date); // Клонуємо дату, щоб уникнути мутації
    meetDateTime.setHours(hours, minutes, 0, 0); // Встановлюємо час для дати

    // Перетворюємо meetDateTime в UTC, враховуючи часовий пояс
    const utcMeetDateTime = fromZonedTime(meetDateTime, timeZone);

    // Видалення часу сеансу з бази даних
    const deletedRows = await db
      .delete(appointmentSchedule)
      .where(eq(appointmentSchedule.meetDate, utcMeetDateTime))
      .returning();

    if (deletedRows.length === 0) {
      return {
        success: false,
        error: 'Час сеансу не знайдено для видалення.',
      };
    }

    revalidateTag(MASTER);
    return { success: true };
  } catch (error) {
    console.error('Помилка видалення часу сеансу:', error);
    return {
      success: false,
      error: 'Не вдалося видалити час сеансу з Бази Даних.',
    };
  }
};

const sendBookingEmail = async (
  lang: ELanguage,
  meetData: TSchedule,
  sendTo: 'admin' | 'user',
  timeZone: string
) => {
  const adminEmail = process.env.ADMIN_EMAIL || '';
  const userEmail = meetData.email || '';

  if (sendTo === 'user' && !userEmail) {
    console.log(
      `🚀 ~ Error! Can't send email to user. User Email is not defined:`,
      userEmail
    );

    return;
  }

  if (sendTo === 'admin' && !adminEmail) {
    console.log(
      `🚀 ~ Error! Can't send email to admin. Admin Email is not defined:`,
      adminEmail
    );

    return;
  }

  const subject = SCHEDULE_EMAIL.subject[lang];

  const body = await render(
    sendTo === 'user' ? (
      <MailMeetBookToUser
        lang={lang}
        meetData={meetData}
        subject={subject}
        timeZone={timeZone}
      />
    ) : (
      <MailMeetBookAdmin
        lang={lang}
        meetData={meetData}
        subject={subject}
        timeZone={timeZone}
      />
    )
  );

  await sendMail({
    to: sendTo === 'user' ? userEmail : adminEmail,
    subject,
    body,
  });
};

export const bookAppointmentAction = async (
  formData: TAppointmentFormValues,
  lang: ELanguage,
  timeZone: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { name, email, question, selectedTimeSlotId } = formData;

    // Використовуємо транзакцію
    const transactionRes = await db.transaction(async (tx) => {
      // 1. Find the time slot by ID
      const timeSlotToBook = await tx.query.appointmentSchedule.findFirst({
        where: eq(appointmentSchedule.id, selectedTimeSlotId),
      });

      if (!timeSlotToBook) {
        return timeNotFound[lang];
      }

      // 2. Check if the time slot is already booked
      if (timeSlotToBook.reservedAt) {
        return timeBooked[lang];
      }

      // 3. Update the time slot with booking information
      const updatedTimeSlots = await tx
        .update(appointmentSchedule)
        .set({
          reservedAt: new Date(),
          email: email,
          userName: name,
          question: question,
        })
        .where(eq(appointmentSchedule.id, selectedTimeSlotId))
        .returning();

      if (!updatedTimeSlots || updatedTimeSlots.length === 0) {
        return errorDbBooked[lang];
      }

      return updatedTimeSlots[0];
    });

    if (typeof transactionRes === 'string')
      return {
        success: false,
        error: transactionRes,
      };

    // Відправляємо email підтвердження користувачу
    try {
      await sendBookingEmail(lang, transactionRes, 'user', timeZone);
    } catch (emailError) {
      console.error(errorSendMailToUser[lang], emailError);
      // Важливо вирішити, чи хочете ви вважати бронювання успішним, навіть якщо email не вдалося відправити.
      // Наразі ми просто логуємо помилку і продовжуємо вважати бронювання успішним з точки зору користувача.
      // Можливо, потрібно розглянути інші стратегії обробки помилок email, наприклад, повторну спробу відправки.
    }

    // Відправляємо email сповіщення адміністратору
    try {
      await sendBookingEmail(lang, transactionRes, 'admin', timeZone);
    } catch (adminEmailError) {
      console.error(errorSendMailToAdmin[lang], adminEmailError);
      // Тут можна розглянути різні стратегії обробки помилок, наприклад, спробувати відправити email пізніше або повідомити адміністратора іншим способом.
    }

    revalidateTag(MASTER);

    return { success: true };
  } catch (error) {
    console.error(bookingConsoleError[lang], error);
    return {
      success: false,
      error: bookingError[lang],
    };
  }
};
