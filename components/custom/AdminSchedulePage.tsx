'use client';

import { useEffect, useState } from 'react';
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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

import { toast } from 'sonner';
import { uk } from 'date-fns/locale';
import { IScheduleEntry } from '@/models/schedule.model';
import {
  AlarmPlusIcon,
  CheckCircle,
  MoreVertical,
  Plus,
  Trash2,
} from 'lucide-react';
import { TSchedule } from '@/db/schema';
import {
  addTimeSlotAction,
  deleteTimeSlotAction,
} from '@/actions/schedule.actions';
import { LoadingAnimated } from '@/svg/LoadingAnimated';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils/utils';
import { getUserTimeZone } from '@/lib/utils/clientDate';
import { groupScheduleByDate } from '@/lib/utils/groupDate';

interface ScheduleAdminPageProps {
  initialSchedule: TSchedule[];
}

// interface ScheduleAdminPageProps {
//   initialSchedule: IScheduleEntry[];
// }

const formatDate = (date: Date) => format(date, 'EE dd MMM', { locale: uk });
const formatTime = (date: Date) => format(date, 'HH:mm');

const timeZone = getUserTimeZone();

const ScheduleAdminPage = ({ initialSchedule }: ScheduleAdminPageProps) => {
  const [schedule, setSchedule] = useState<IScheduleEntry[]>(() => {
    const initScheduleZoned = groupScheduleByDate(initialSchedule, timeZone);
    console.log('🚀 ~ ScheduleAdminPage ~ timeZone:', timeZone);
    console.log(
      '🚀 ~ ScheduleAdminPage ~ initScheduleZoned:',
      JSON.stringify(initScheduleZoned, null, 2)
    );

    return initScheduleZoned;
  });
  const [isAddDateDialogOpen, setAddDateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDateAdded = async (newDate: Date) => {
    setSchedule((prevSchedule) => {
      const updatedSchedule = [
        ...prevSchedule,
        { meetDate: newDate, times: [] },
      ];
      return updatedSchedule.sort(
        (a, b) => a.meetDate.getTime() - b.meetDate.getTime()
      );
    });

    toast.success(`Дату ${formatDate(newDate)} успішно додано.`);
    setAddDateDialogOpen(false);
  };

  const handleTimeSlotAdded = async (date: Date, time: string) => {
    setIsLoading(true);
    try {
      const result = await addTimeSlotAction(date, time, timeZone); // Pass Date object directly

      if (result.success && result.data) {
        setSchedule((prevSchedule) => {
          return prevSchedule.map((daySchedule) => {
            if (
              format(daySchedule.meetDate, 'yyyy-MM-dd') ===
              format(date, 'yyyy-MM-dd')
            ) {
              const newTimesArray: TSchedule[] = [];
              if (result.data) {
                newTimesArray.push(result.data);
              }
              const combinedTimes = newTimesArray.concat(daySchedule.times);
              const sortedTimes = combinedTimes.sort(
                // Sort the combined array
                (a, b) => {
                  if (!a || !b) return 0;
                  return a.meetDate.getTime() - b.meetDate.getTime();
                }
              );
              return {
                ...daySchedule,
                times: sortedTimes, // Assign the newly created and sorted array
              };
            }
            return daySchedule;
          });
        });
        toast.success(`Час ${time} для ${formatDate(date)} успішно додано.`);
      } else {
        toast.error(
          result?.error || 'Не вдалося додати час зустрічі. Спробуйте ще раз.'
        );
      }
    } catch (error) {
      toast.error(`Помилка при додаванні часу зустрічі: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log(
      '🚀 ~ ScheduleAdminPage ~ schedule:',
      JSON.stringify(schedule, null, 2)
    );
  }, [schedule]);

  const handleTimeSlotDeleted = async (date: Date, time: string) => {
    setIsLoading(true);
    try {
      const result = await deleteTimeSlotAction(date, time); // Pass Date object directly

      if (result && result.success) {
        setSchedule((prevSchedule) => {
          const updatedSchedule = prevSchedule
            .map((daySchedule) => {
              if (formatDate(daySchedule.meetDate) === formatDate(date)) {
                const updatedTimeSlots = daySchedule.times.filter(
                  (ts) => formatTime(ts.meetDate) !== time // Compare time strings
                );
                return { ...daySchedule, times: updatedTimeSlots };
              }
              return daySchedule;
            })
            .filter((daySchedule) => daySchedule.times.length > 0);
          return updatedSchedule;
        });
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
      setIsLoading(false);
    }
  };

  return (
    <>
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
                          isLoading={isLoading}
                          date={daySchedule.meetDate}
                          existingTimeSlots={daySchedule.times}
                          onTimeSlotAdded={handleTimeSlotAdded}
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
                            isLoading={isLoading}
                            date={daySchedule.meetDate}
                            timeSlot={timeSlot}
                            onDelete={handleTimeSlotDeleted}
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
                    isLoading={isLoading}
                    date={daySchedule.meetDate}
                    existingTimeSlots={daySchedule.times}
                    onTimeSlotAdded={handleTimeSlotAdded}
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
              <Button onClick={() => setAddDateDialogOpen(true)}>
                Додати Дату
              </Button>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <AddDateDialog
        open={isAddDateDialogOpen}
        onOpenChange={setAddDateDialogOpen}
        onDateAdded={handleDateAdded}
        existingDates={schedule.map((day) => day.meetDate)}
      />
    </>
  );
};

interface AddDateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDateAdded: (date: Date) => void;
  existingDates: Date[];
}

const AddDateDialog = ({
  open,
  onOpenChange,
  onDateAdded,
  existingDates,
}: AddDateDialogProps) => {
  const [date, setDate] = useState<Date>();
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = () => {
    if (!date) {
      setError('Будь ласка, виберіть дату.');
      return;
    }
    const isDateExists = existingDates.some(
      (existingDate) =>
        format(existingDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    if (isDateExists) {
      setError('Ця дата вже існує в графіку.');
      return;
    }

    onDateAdded(date);
    onOpenChange(false);
    setError(null);
    setDate(undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-fit sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Виберіть Дату</DialogTitle>
        </DialogHeader>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          showOutsideDays={false}
          className="rounded-md border"
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            Скасувати
          </Button>
          <Button type="button" onClick={handleConfirm}>
            Підтвердити
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

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
  isLoading: boolean;
  existingTimeSlots: TSchedule[];
  onTimeSlotAdded: (date: Date, time: string) => void;
}

const AddTimeSlotPopover = ({
  date,
  isLoading,
  existingTimeSlots,
  onTimeSlotAdded,
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

  const timeInputValue = watch('timeInput');

  const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Видаляємо всі нечислові символи

    if (value.length >= 2) {
      value = `${value.slice(0, 2)}:${value.slice(2, 4)}`; // Додаємо `:` після двох символів
    }

    setValue('timeInput', value); // Оновлюємо значення в формі
  };

  const onSubmit = (data: TimeSlotFormValues) => {
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

    if (existingTimeSlots.length > 0) {
      const newTimeDate = new Date(date);
      const [newHours, newMinutes] = timeInput.split(':').map(Number);
      newTimeDate.setHours(newHours, newMinutes, 0, 0);

      for (const existingSlot of existingTimeSlots) {
        const existingTimeDate = existingSlot.meetDate;

        const timeDifference = Math.abs(
          newTimeDate.getTime() - existingTimeDate.getTime()
        );
        const thirtyMinutes = 30 * 60 * 1000;

        if (timeDifference < thirtyMinutes) {
          setError('timeInput', {
            type: 'manual',
            message: `Час повинен бути мінімум 30 хвилин від ${formatTime(existingTimeDate)}.`,
          });
          return;
        }
      }
    }

    onTimeSlotAdded(date, timeInput);
    reset({ timeInput: '' }); // Очищаємо поле введення після успішного додавання
  };

  return (
    <Popover>
      <PopoverTrigger asChild className="absolute right-0 bottom-0">
        <Button variant="outline" className="size-7 p-0 bg-transparent">
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
            Додати час Додати час
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};

interface DeleteTimeSlotButtonProps {
  date: Date;
  timeSlot: TSchedule;
  isLoading: boolean;
  onDelete: (date: Date, time: string) => void;
}

const DeleteTimeSlotButton = ({
  date,
  timeSlot,
  isLoading,
  onDelete,
}: DeleteTimeSlotButtonProps) => {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const handleDelete = () => {
    if (timeSlot.email) {
      setIsConfirmationOpen(true); // Open confirmation if email exists
    } else {
      onDelete(date, formatTime(timeSlot.meetDate)); // Directly delete if no email
    }
  };

  const handleConfirmDelete = () => {
    onDelete(date, formatTime(timeSlot.meetDate)); // Delete after confirmation
    setIsConfirmationOpen(false);
  };

  const handleCancelDelete = () => {
    setIsConfirmationOpen(false); // Close confirmation dialog
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

export default ScheduleAdminPage;
