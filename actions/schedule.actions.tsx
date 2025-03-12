'use server';

import { appointmentSchedule, TSchedule } from '@/db/schema'; // Шлях до вашої схеми appointmentSchedule
import { revalidateTag } from 'next/cache';
import { format, startOfDay } from 'date-fns';
import {
  IScheduleEntry,
  TAppointmentFormValues,
} from '@/models/schedule.model';
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
import { DEFAULT_META_OG } from '@/models/root.model';
import { fromZonedTime } from 'date-fns-tz';

const db = getDB();
const { MASTER } = ESegment;

const groupScheduleByDate = (scheduleData: TSchedule[]): IScheduleEntry[] => {
  const groupedScheduleMap: Map<string, IScheduleEntry> = new Map();

  for (const scheduleItem of scheduleData) {
    const meetDate = scheduleItem.meetDate;
    const dayStart = startOfDay(meetDate);

    const dateKey = format(dayStart, 'yyyy-MM-dd');

    if (groupedScheduleMap.has(dateKey)) {
      groupedScheduleMap.get(dateKey)?.times.push(scheduleItem);
    } else {
      groupedScheduleMap.set(dateKey, {
        meetDate: dayStart,
        times: [scheduleItem],
      });
    }
  }

  const groupedScheduleArray: IScheduleEntry[] = Array.from(
    groupedScheduleMap.values()
  );

  groupedScheduleArray.sort(
    (a, b) => a.meetDate.getTime() - b.meetDate.getTime()
  );
  groupedScheduleArray.forEach((entry) => {
    entry.times.sort(
      (timeA, timeB) => timeA.meetDate.getTime() - timeB.meetDate.getTime()
    );
  });

  return groupedScheduleArray;
};

export const getScheduleAction = async (
  withReserved = true
): Promise<{
  success: boolean;
  data?: IScheduleEntry[];
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

    return { success: true, data: groupScheduleByDate(allAppointments) };
  } catch (error) {
    console.error('Помилка отримання графіку:', error);
    return {
      success: false,
      error: 'Не вдалося завантажити графік зустрічей з Бази Даних.',
    };
  }
};

export const addTimeSlotAction = async (
  date: Date, // Приймаємо Date об'єкт напряму
  time: string,
  timeZone: string = 'Europe/Kiev' // За замовчуванням 'Europe/Kiev', можна передати іншу часову зону
): Promise<{
  success: boolean;
  error?: string;
  data?: typeof appointmentSchedule.$inferSelect;
}> => {
  try {
    const [hours, minutes] = time.split(':').map(Number);
    const meetDateTime = new Date(date); // Клонуємо дату, щоб уникнути мутації
    meetDateTime.setHours(hours, minutes, 0, 0); // Встановлюємо час для дати

    // Перетворюємо meetDateTime в UTC, враховуючи часовий пояс
    const utcMeetDateTime = fromZonedTime(meetDateTime, timeZone);

    // Перевірка, чи час прийому вже існує для цієї дати і часу
    const existingTimeSlot = await db.query.appointmentSchedule.findFirst({
      where: eq(appointmentSchedule.meetDate, utcMeetDateTime),
    });

    if (existingTimeSlot) {
      return { success: false, error: 'Час прийому вже існує для цієї дати.' };
    }

    // Додавання часу прийому
    const insertedTimeSlots = await db
      .insert(appointmentSchedule)
      .values({ meetDate: utcMeetDateTime })
      .returning(); // Отримуємо вставлені дані

    if (!insertedTimeSlots || insertedTimeSlots.length === 0) {
      return {
        success: false,
        error: 'Не вдалося додати час прийому до бази даних.',
      };
    }

    revalidateTag(MASTER);
    return { success: true, data: insertedTimeSlots[0] }; // Повертаємо дані вставленого запису
  } catch (error) {
    console.error('Помилка додавання часу прийому:', error);
    return { success: false, error: 'Не вдалося додати час прийому.' };
  }
};

export const deleteTimeSlotAction = async (
  date: Date,
  time: string,
  timeZone: string = 'Europe/Kiev' // За замовчуванням 'Europe/Kiev'
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Розділяємо час на години та хвилини
    const [hours, minutes] = time.split(':').map(Number);
    const meetDateTime = new Date(date); // Клонуємо дату, щоб уникнути мутації
    meetDateTime.setHours(hours, minutes, 0, 0); // Встановлюємо час для дати

    // Перетворюємо meetDateTime в UTC, враховуючи часовий пояс
    const utcMeetDateTime = fromZonedTime(meetDateTime, timeZone);

    // Видалення часу прийому з бази даних
    const deletedRows = await db
      .delete(appointmentSchedule)
      .where(eq(appointmentSchedule.meetDate, utcMeetDateTime))
      .returning();

    if (deletedRows.length === 0) {
      return {
        success: false,
        error: 'Час прийому не знайдено для видалення.',
      };
    }

    revalidateTag(MASTER);
    return { success: true };
  } catch (error) {
    console.error('Помилка видалення часу прийому:', error);
    return {
      success: false,
      error: 'Не вдалося видалити час прийому з Бази Даних.',
    };
  }
};

const sendBookingEmail = async (
  lang: ELanguage,
  meetData: TSchedule,
  sendTo: 'admin' | 'user'
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

  const subject = `Підтвердження бронювання сеансу на ${DEFAULT_META_OG.siteName}`;

  const body = await render(
    sendTo === 'user' ? (
      <MailMeetBookToUser lang={lang} meetData={meetData} subject={subject} />
    ) : (
      <MailMeetBookAdmin lang={lang} meetData={meetData} subject={subject} />
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
  lang: ELanguage
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
        return 'Обраний час прийому не знайдено.';
      }

      // 2. Check if the time slot is already booked
      if (timeSlotToBook.reservedAt) {
        return 'Обраний час прийому вже заброньовано.';
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
        return 'Не вдалося забронювати час прийому в базі даних.';
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
      await sendBookingEmail(lang, transactionRes, 'user');
    } catch (emailError) {
      console.error(
        'Помилка відправлення email користувачу, але бронювання збережено:',
        emailError
      );
      // Важливо вирішити, чи хочете ви вважати бронювання успішним, навіть якщо email не вдалося відправити.
      // Наразі ми просто логуємо помилку і продовжуємо вважати бронювання успішним з точки зору користувача.
      // Можливо, потрібно розглянути інші стратегії обробки помилок email, наприклад, повторну спробу відправки.
    }

    // Відправляємо email сповіщення адміністратору
    try {
      await sendBookingEmail(lang, transactionRes, 'admin');
    } catch (adminEmailError) {
      console.error(
        'Помилка відправлення email адміністратору:',
        adminEmailError
      );
      // Тут можна розглянути різні стратегії обробки помилок, наприклад, спробувати відправити email пізніше або повідомити адміністратора іншим способом.
    }

    revalidateTag(MASTER);

    return { success: true };
  } catch (error) {
    console.error('Помилка бронювання сеансу:', error);
    return {
      success: false,
      error: 'Не вдалося забронювати сеанс. Спробуйте ще раз.',
    };
  }
};
