'use client';

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from '@/components/ui/table';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  CheckCircle,
  MoreVertical,
  AlarmPlusIcon,
  Plus,
  Trash2,
} from 'lucide-react';
import { TSchedule } from '@/db/schema';
import { cn } from '@/lib/utils/utils';
import { groupScheduleByDate } from '@/lib/utils/groupDate';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

import { toast } from 'sonner';
import {
  addTimeSlotAction,
  deleteTimeSlotAction,
} from '@/actions/schedule.actions';
import { LoadingAnimated } from '@/svg/LoadingAnimated';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getUserTimeZone } from '@/lib/utils/clientDate';
import { formatDateLocal, formatTimeLocal } from '@/lib/utils/formatDate';
import { ELanguage } from '@/models/language.model';
import { useState } from 'react';

const formatDate = (date: Date) =>
  formatDateLocal(date, ELanguage.UA, timeZone);
const formatTime = (date: Date) => formatTimeLocal(date, timeZone);

const timeZone = getUserTimeZone();

export const ScheduleAdminTable = ({
  initialSchedule,
}: {
  initialSchedule: TSchedule[];
}) => {
  console.log(
    '🚀 ~ initialSchedule:',
    JSON.stringify(initialSchedule, null, 2)
  );
  const schedule = groupScheduleByDate(initialSchedule, timeZone);
  console.log('🚀 ~ schedule:', JSON.stringify(schedule, null, 2));

  return (
    <>
      timeZone: {timeZone}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Paid</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {schedule.map((daySchedule) => {
            const formattedDate = formatDate(daySchedule.meetDate);

            return daySchedule.times.length > 0 ? (
              daySchedule.times.map((timeSlot, index) => {
                const formattedTime = formatTime(timeSlot.meetDate);

                return (
                  <TableRow
                    key={timeSlot.id}
                    className={cn(
                      index === 0 && '!border-t-2 !border-t-tertiary-foreground'
                    )}
                  >
                    {index === 0 && (
                      <TableCell
                        className="font-medium relative"
                        rowSpan={daySchedule.times.length}
                      >
                        {formattedDate}

                        <AddTimeSlotPopover
                          date={daySchedule.meetDate}
                          existingTimeSlots={daySchedule.times}
                        />
                      </TableCell>
                    )}
                    <TableCell className="w-20">
                      <Popover>
                        <PopoverTrigger className="flex items-center w-full justify-between">
                          {formattedTime}
                          <MoreVertical className="size-4 opacity-40" />
                        </PopoverTrigger>
                        <PopoverContent className="w-fit">
                          <DeleteTimeSlotButton
                            date={daySchedule.meetDate}
                            timeSlot={timeSlot}
                          />
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                    <TableCell>
                      {timeSlot.userName && (
                        <Popover>
                          <PopoverTrigger className="flex items-center gap-2">
                            {timeSlot.userName}
                            <MoreVertical className="size-4 opacity-40" />
                          </PopoverTrigger>
                          <PopoverContent>
                            <p>
                              <span className="font-bold">Name: </span>
                              {timeSlot.userName}
                            </p>
                            <p>
                              <span className="font-bold">Email: </span>
                              {timeSlot.email}
                            </p>
                            <p>
                              <span className="font-bold">Question: </span>
                              {timeSlot.question}
                            </p>
                            <p>
                              <span className="font-bold">Reserved At: </span>
                              {timeSlot.reservedAt?.toLocaleString()}
                            </p>
                          </PopoverContent>
                        </Popover>
                      )}
                    </TableCell>
                    <TableCell>
                      {timeSlot.hasCompletedPayment && (
                        <CheckCircle className="text-green-600" />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow
                key={formattedDate}
                className="!border-t-2 !border-t-tertiary-foreground"
              >
                <TableCell className="font-medium relative">
                  {formattedDate}

                  <AddTimeSlotPopover
                    date={daySchedule.meetDate}
                    existingTimeSlots={daySchedule.times}
                  />
                </TableCell>
                <TableCell />
                <TableCell />
                <TableCell />
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              <AddDateDialog
                existingDates={schedule.map((day) => day.meetDate)}
              />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
};

interface AddDateDialogProps {
  existingDates: Date[];
}

export const AddDateDialog = ({ existingDates }: AddDateDialogProps) => {
  const [dateString, setDateString] = useState<string>(''); // Змінено стан на string для Input type="date"
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setError(null);

    if (!dateString) {
      setError('Будь ласка, виберіть дату.');
      return;
    }

    // Перетворюємо рядок дати в об'єкт Date перед відправкою в action
    const date = new Date(dateString);
    console.log(
      'AddDateDialog - date before action (from dateString):',
      date.toISOString()
    ); // Додаємо лог для перевірки

    const isDateExists = existingDates.some(
      (existingDate) =>
        format(existingDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    if (isDateExists) {
      setError('Ця дата вже існує в графіку.');
      return;
    }

    setIsLoading(true);

    const result = await addTimeSlotAction(date, '12:00', timeZone); // Передаємо об'єкт Date

    if (typeof result === 'string') {
      toast.error(result);
    } else {
      toast.success(
        `Дату ${formatDateLocal(date, ELanguage.UA, timeZone)} успішно додано.`
      );
    }

    setOpen(false);
    setError(null);
    setDateString(''); // Очищаємо рядок дати
    setIsLoading(false);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateString(e.target.value); // Зберігаємо значення Input type="date" як рядок
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>Додати Дату</DialogTrigger>
      <DialogContent className="w-fit sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Виберіть Дату</DialogTitle>
        </DialogHeader>
        {/* Замінено Calendar на Input type="date" */}
        <Input
          type="date"
          value={dateString}
          onChange={handleDateChange}
          className="rounded-md border"
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <DialogFooter>
          <Button type="button" onClick={handleConfirm} disabled={isLoading}>
            Підтвердити
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// export const AddDateDialog = ({ existingDates }: AddDateDialogProps) => {
//   const [date, setDate] = useState<Date>();
//   const [error, setError] = useState<string | null>(null);
//   const [open, setOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleConfirm = async () => {
//     if (!date) {
//       setError('Будь ласка, виберіть дату.');
//       return;
//     }

//     console.log(
//       '🚀 ~ AddDateDialog ~ date after selection:',
//       date.toISOString()
//     );

//     const isDateExists = existingDates.some(
//       (existingDate) =>
//         format(existingDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
//     );
//     if (isDateExists) {
//       setError('Ця дата вже існує в графіку.');
//       return;
//     }

//     setIsLoading(true);

//     const result = await addTimeSlotAction(date, '12:00', timeZone); // Pass Date object directly

//     if (typeof result === 'string') {
//       toast.error(result);
//     } else {
//       toast.success(`Дату ${formatDate(date)} успішно додано.`);
//     }

//     setOpen(false);
//     setError(null);
//     setDate(undefined);
//     setIsLoading(false);
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger>Додати Дату</DialogTrigger>
//       <DialogContent className="w-fit sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Виберіть Дату</DialogTitle>
//         </DialogHeader>
//         <Calendar
//           mode="single"
//           selected={date}
//           onSelect={setDate}
//           showOutsideDays={false}
//           className="rounded-md border"
//         />
//         {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
//         <DialogFooter>
//           <Button type="button" onClick={handleConfirm} disabled={isLoading}>
//             Підтвердити
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

const timeSlotSchema = z.object({
  timeInput: z
    .string()
    .min(1, { message: 'Введіть час прийому' })
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: 'Невірний формат часу. Використовуйте HH:mm (наприклад, 14:00)',
    }),
});

type TimeSlotFormValues = z.infer<typeof timeSlotSchema>;

interface AddTimeSlotPopoverProps {
  date: Date;
  existingTimeSlots: TSchedule[];
}

export const AddTimeSlotPopover = ({
  date,
  existingTimeSlots,
}: AddTimeSlotPopoverProps) => {
  const {
    handleSubmit,
    reset,
    formState: { errors },
    setError,
    clearErrors,
    setValue,
    watch,
  } = useForm<TimeSlotFormValues>({
    resolver: zodResolver(timeSlotSchema),
    defaultValues: {
      timeInput: '',
    },
    mode: 'onSubmit', // Валідація при спробі відправки форми
  });

  const [isLoading, setIsLoading] = useState(false);

  const timeInputValue = watch('timeInput');

  const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Видаляємо всі нечислові символи

    if (value.length >= 2) {
      value = `${value.slice(0, 2)}:${value.slice(2, 4)}`; // Додаємо `:` після двох символів
    }

    setValue('timeInput', value); // Оновлюємо значення в формі
  };

  const onSubmit = async (data: TimeSlotFormValues) => {
    console.log('🚀 AddTimeSlotPopover ~ date:', date);
    console.log('🚀 AddTimeSlotPopover ~ dateISO:', date.toISOString());
    const timeInput = data.timeInput;
    clearErrors('timeInput');

    const isTimeSlotExists = existingTimeSlots.some(
      (slot) => formatTime(slot.meetDate) === timeInput
    );
    if (isTimeSlotExists) {
      setError('timeInput', {
        type: 'manual',
        message: 'Цей час вже додано для цієї дати.',
      });
      return;
    }

    const [newHours, newMinutes] = timeInput.split(':').map(Number);

    // Get year, month, day from the 'date' object (which is start of day in UTC)
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth(); // getUTCMonth() returns month index (0-11)
    const day = date.getDate();
    console.log('🚀 ~ onSubmit ~ day:', day);

    // Create newTimeDate using individual components (local time interpretation assumed)
    const newTimeDate = new Date(year, month, day, newHours, newMinutes);

    if (existingTimeSlots.length > 0) {
      for (const existingSlot of existingTimeSlots) {
        const existingTimeDate = existingSlot.meetDate;

        const timeDifference = Math.abs(
          newTimeDate.getTime() - existingTimeDate.getTime()
        );
        const thirtyMinutes = 30 * 60 * 1000;

        if (timeDifference < thirtyMinutes) {
          setError('timeInput', {
            type: 'manual',
            message: `Час повинен бути мінімум 30 хвилин від ${formatTime(
              existingTimeDate
            )}.`,
          });
          return;
        }
      }
    }

    setIsLoading(true);

    console.log(
      'AddTimeSlotPopover - newTimeDate (before action):',
      date.toISOString()
    ); // Log newTimeDate

    // Use newTimeDate (constructed with individual components)
    const result = await addTimeSlotAction(date, timeInput, timeZone);

    if (typeof result === 'string') {
      toast.error(
        result || 'Не вдалося додати час зустрічі. Спробуйте ще раз.'
      );
    } else {
      toast.success(`Час ${timeInput} для ${formatDate(date)} успішно додано.`);
    }

    setIsLoading(false);
    reset({ timeInput: '' });
  };

  // const onSubmit = async (data: TimeSlotFormValues) => {
  //   const timeInput = data.timeInput;
  //   clearErrors('timeInput');

  //   const isTimeSlotExists = existingTimeSlots.some(
  //     (slot) => formatTime(slot.meetDate) === timeInput
  //   );
  //   if (isTimeSlotExists) {
  //     setError('timeInput', {
  //       type: 'manual',
  //       message: 'Цей час вже додано для цієї дати.',
  //     });
  //     return;
  //   }

  //   const [newHours, newMinutes] = timeInput.split(':').map(Number);

  //   // Construct date string in 'YYYY-MM-DDTHH:mm:ss' format using the *intended* date and time
  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  //   const day = String(date.getDate()).padStart(2, '0');
  //   const hour = String(newHours).padStart(2, '0');
  //   const minute = String(newMinutes).padStart(2, '0');
  //   const dateTimeString = `${year}-${month}-${day}T${hour}:${minute}:00`;

  //   const newTimeDate = new Date(dateTimeString); // Create Date from string - hopefully local time

  //   if (existingTimeSlots.length > 0) {
  //     for (const existingSlot of existingTimeSlots) {
  //       const existingTimeDate = existingSlot.meetDate;

  //       const timeDifference = Math.abs(
  //         newTimeDate.getTime() - existingTimeDate.getTime()
  //       );
  //       const thirtyMinutes = 30 * 60 * 1000;

  //       if (timeDifference < thirtyMinutes) {
  //         setError('timeInput', {
  //           type: 'manual',
  //           message: `Час повинен бути мінімум 30 хвилин від ${formatTime(
  //             existingTimeDate
  //           )}.`,
  //         });
  //         return;
  //       }
  //     }
  //   }

  //   setIsLoading(true);

  //   console.log(
  //     'AddTimeSlotPopover - newTimeDate (before action):',
  //     newTimeDate.toISOString()
  //   ); // Log newTimeDate

  //   // ✅ Use newTimeDate (which should now represent local time correctly)
  //   const result = await addTimeSlotAction(newTimeDate, timeInput, timeZone);

  //   if (typeof result === 'string') {
  //     toast.error(
  //       result || 'Не вдалося додати час зустрічі. Спробуйте ще раз.'
  //     );
  //   } else {
  //     toast.success(`Час ${timeInput} для ${formatDate(date)} успішно додано.`);
  //   }

  //   setIsLoading(false);
  //   reset({ timeInput: '' });
  // };

  return (
    <Popover>
      <PopoverTrigger asChild className="absolute right-0 bottom-0">
        <Button
          variant="outline"
          className="size-7 p-0 bg-transparent"
          disabled={isLoading}
        >
          <Plus className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Додати час зустрічі</h4>
            <p className="text-sm text-muted-foreground">
              Введіть час у форматі HH:mm (наприклад, 09:30)
            </p>
          </div>
          <div className="grid gap-2">
            <Input
              type="text"
              placeholder="HH:mm"
              value={timeInputValue}
              maxLength={5}
              onChange={handleTimeInputChange}
            />
            {errors.timeInput && (
              <p className="text-red-500 text-sm">{errors.timeInput.message}</p>
            )}
          </div>
          <Button type="submit" className="mt-4 w-full">
            {isLoading ? (
              <LoadingAnimated className="size-5 mr-4" />
            ) : (
              <AlarmPlusIcon className="size-5 mr-4" />
            )}
            Додати час
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};

interface DeleteTimeSlotButtonProps {
  date: Date;
  timeSlot: TSchedule;
}

export const DeleteTimeSlotButton = ({
  date,
  timeSlot,
}: DeleteTimeSlotButtonProps) => {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (timeSlot.email) {
      setIsConfirmationOpen(true); // Open confirmation if email exists
    } else {
      await handleConfirmDelete();
    }
  };

  const handleConfirmDelete = async () => {
    const time = formatTime(timeSlot.meetDate);
    try {
      setIsLoading(true);
      const result = await deleteTimeSlotAction(date, time);

      if (result && result.success) {
        toast.success('Час зустрічі видалено!', {
          description: `Час ${time} для ${formatDate(date)} успішно видалено.`,
        });
      } else {
        toast.error('Помилка видалення часу', {
          description:
            result?.error ||
            'Не вдалося видалити час зустрічі. Спробуйте ще раз.',
        });
      }
    } catch (error) {
      toast.error('Критична помилка', {
        description: `Неочікувана помилка: ${error}`,
      });
      console.error('Помилка при видаленні часу зустрічі:', error);
    } finally {
      setIsConfirmationOpen(false);
      setIsLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmationOpen(false);
  };

  return (
    <>
      <Button
        variant="destructive"
        className="flex items-center gap-4 w-fit"
        onClick={handleDelete}
        disabled={isLoading}
      >
        Видалити час
        <Trash2 className="size-4" />
        <span className="sr-only">Видалити</span>
      </Button>

      <ConfirmationDialog
        open={isConfirmationOpen}
        onOpenChange={setIsConfirmationOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        message="Ви впевнені, що хочете видалити цей час прийому? Для цього часу вже є запис."
      />
    </>
  );
};

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
}

const ConfirmationDialog = ({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  message,
}: ConfirmationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Підтвердження видалення</DialogTitle>
        </DialogHeader>
        <div>
          <p className="mb-4">{message}</p>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Скасувати
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm}>
            Підтвердити видалення
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
