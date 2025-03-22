import { TSchedule } from '@/db/schema';
import { IScheduleEntry } from '@/models/schedule.model';
import { format, startOfDay } from 'date-fns';
// import { toZonedTime } from 'date-fns-tz';

// export const groupScheduleByDate = (
//   scheduleData: TSchedule[],
//   timeZone: string
// ): IScheduleEntry[] => {
//   const groupedScheduleMap: Map<string, IScheduleEntry> = new Map();

//   for (const scheduleItem of scheduleData) {
//     // Convert meetDate to the specified timeZone
//     const zonedMeetDate = toZonedTime(scheduleItem.meetDate, timeZone);
//     const dayStartInTimeZone = startOfDay(zonedMeetDate);

//     const dateKey = format(dayStartInTimeZone, 'yyyy-MM-dd');

//     if (groupedScheduleMap.has(dateKey)) {
//       groupedScheduleMap.get(dateKey)?.times.push(scheduleItem);
//     } else {
//       groupedScheduleMap.set(dateKey, {
//         meetDate: dayStartInTimeZone, // Store the start of the day in timeZone
//         times: [scheduleItem],
//       });
//     }
//   }

//   const groupedScheduleArray: IScheduleEntry[] = Array.from(
//     groupedScheduleMap.values()
//   );

//   // Сортуємо дати
//   groupedScheduleArray.sort(
//     (a, b) => a.meetDate.getTime() - b.meetDate.getTime()
//   );

//   // Сортуємо часи всередині дня
//   groupedScheduleArray.forEach((entry) => {
//     entry.times.sort((timeA, timeB) => {
//       // Convert timeA.meetDate and timeB.meetDate to the specified timeZone for comparison
//       const zonedTimeA = toZonedTime(timeA.meetDate, timeZone);
//       const zonedTimeB = toZonedTime(timeB.meetDate, timeZone);
//       return zonedTimeA.getTime() - zonedTimeB.getTime();
//     });
//   });

//   return groupedScheduleArray;
// };

export const groupScheduleByDate = (
  scheduleData: TSchedule[],
  timeZone?: string
): IScheduleEntry[] => {
  console.log('🚀 ~ timeZone:', timeZone);
  const groupedScheduleMap: Map<string, IScheduleEntry> = new Map();

  for (const scheduleItem of scheduleData) {
    const meetDateUTC = scheduleItem.meetDate; // **Використовуємо UTC дату без конвертації на початку**
    const dayStartUTC = startOfDay(meetDateUTC); // **Початок дня в UTC**

    const dateKey = format(dayStartUTC, 'yyyy-MM-dd'); // **Форматуємо початок дня UTC для ключа**

    if (groupedScheduleMap.has(dateKey)) {
      groupedScheduleMap.get(dateKey)?.times.push(scheduleItem);
    } else {
      groupedScheduleMap.set(dateKey, {
        meetDate: dayStartUTC, // Store the start of the day in UTC **Зберігаємо початок дня в UTC**
        times: [scheduleItem],
      });
    }
  }

  const groupedScheduleArray: IScheduleEntry[] = Array.from(
    groupedScheduleMap.values()
  );

  groupedScheduleArray.sort(
    (a, b) => a.meetDate.getTime() - b.meetDate.getTime() // **Сортуємо за UTC датою**
  );
  groupedScheduleArray.forEach((entry) => {
    entry.times.sort((timeA, timeB) => {
      return timeA.meetDate.getTime() - timeB.meetDate.getTime(); // **Сортуємо час також за UTC**
    });
  });

  return groupedScheduleArray;
};
