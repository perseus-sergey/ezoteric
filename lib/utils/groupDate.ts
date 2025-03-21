import { TSchedule } from '@/db/schema';
import { IScheduleEntry } from '@/models/schedule.model';
import { format, startOfDay } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export const groupScheduleByDate = (
  scheduleData: TSchedule[],
  timeZone: string // Add timeZone as an argument
): IScheduleEntry[] => {
  const groupedScheduleMap: Map<string, IScheduleEntry> = new Map();

  for (const scheduleItem of scheduleData) {
    // Convert meetDate to the specified timeZone
    const zonedMeetDate = toZonedTime(scheduleItem.meetDate, timeZone);
    const dayStartInTimeZone = startOfDay(zonedMeetDate);

    const dateKey = format(dayStartInTimeZone, 'yyyy-MM-dd');

    if (groupedScheduleMap.has(dateKey)) {
      groupedScheduleMap.get(dateKey)?.times.push(scheduleItem);
    } else {
      groupedScheduleMap.set(dateKey, {
        meetDate: dayStartInTimeZone, // Store the start of the day in timeZone
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
    entry.times.sort((timeA, timeB) => {
      // Convert timeA.meetDate and timeB.meetDate to the specified timeZone for comparison
      const zonedTimeA = toZonedTime(timeA.meetDate, timeZone);
      const zonedTimeB = toZonedTime(timeB.meetDate, timeZone);
      return zonedTimeA.getTime() - zonedTimeB.getTime();
    });
  });

  return groupedScheduleArray;
};
