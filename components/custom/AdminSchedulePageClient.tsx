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
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { useMemo, useState } from 'react';
import { Calendar } from '../ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { DialogDescription } from '@radix-ui/react-dialog';

const formatDate = (date: Date) =>
  formatDateLocal(date, ELanguage.UA, timeZone);
const formatTime = (date: Date) => formatTimeLocal(date, timeZone);

const timeZone = getUserTimeZone();

export const ScheduleAdminTable = ({
  initialSchedule,
}: {
  initialSchedule: TSchedule[];
}) => {
  const schedule = groupScheduleByDate(initialSchedule, timeZone);
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
                      <DeleteTimeSlotButton
                        date={daySchedule.meetDate}
                        timeSlot={timeSlot}
                      />
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
  existingDates: Date[]; // UTC dates
}

const addDateSchema = z.object({
  date: z.date({
    required_error: 'Будь ласка, виберіть дату.',
  }),
});

type AddDateFormValues = z.infer<typeof addDateSchema>;

export const AddDateDialog = ({ existingDates }: AddDateDialogProps) => {
  const [open, setOpen] = useState(false);

  const form = useForm<AddDateFormValues>({
    resolver: zodResolver(addDateSchema),
    defaultValues: {
      date: undefined,
    },
    mode: 'onSubmit',
  });

  const formattedExistingDates = useMemo(
    () => existingDates.map((date) => format(date, 'yyyy-MM-dd')),
    [existingDates]
  );

  const onSubmit = async (values: AddDateFormValues) => {
    const { date } = values;

    const isDateExists = formattedExistingDates.includes(
      format(date, 'yyyy-MM-dd')
    );
    if (isDateExists) {
      form.setError('date', {
        type: 'manual',
        message: 'Ця дата вже існує в графіку.',
      });
      return;
    }

    const newTimeDate = new Date(date);
    newTimeDate.setHours(newTimeDate.getHours() + 12); // Assuming you still need to adjust the time

    try {
      const result = await addTimeSlotAction(newTimeDate);

      if (typeof result === 'string') {
        toast.error(result);
      } else {
        toast.success(`Дату ${formatDate(date)} успішно додано.`);
      }
      setOpen(false);
      form.reset();
    } catch (error) {
      toast.error('Не вдалося додати дату.');
      console.error('Помилка додавання дати:', error);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>Додати Дату</PopoverTrigger>
      <PopoverContent className="w-fit sm:max-w-[425px] space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Виберіть дату</FormLabel>
                  <FormControl>
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      showOutsideDays={false}
                      className="rounded-md border"
                      disabled={(date) => {
                        const currentDateFormatted = format(date, 'yyyy-MM-dd');
                        return (
                          date < new Date() ||
                          formattedExistingDates.includes(currentDateFormatted)
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={form.formState.isSubmitting}>
              Підтвердити
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
};

interface AddTimeSlotPopoverProps {
  date: Date;
  existingTimeSlots: TSchedule[];
}

const timeSlotSchema = z.object({
  timeInput: z
    .string()
    .min(1, { message: 'Введіть час прийому' })
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: 'Невірний формат часу. Використовуйте HH:mm (наприклад, 14:00)',
    }),
});

type TimeSlotFormValues = z.infer<typeof timeSlotSchema>;

export const AddTimeSlotPopover = ({
  date,
  existingTimeSlots,
}: AddTimeSlotPopoverProps) => {
  const [open, setOpen] = useState(false);
  const timeZone = getUserTimeZone();
  const formatDate = (date: Date) =>
    formatDateLocal(date, ELanguage.UA, timeZone);
  const formatTime = (date: Date) => formatTimeLocal(date, timeZone);

  const form = useForm<TimeSlotFormValues>({
    resolver: zodResolver(timeSlotSchema),
    defaultValues: {
      timeInput: '',
    },
    mode: 'onSubmit',
  });

  const handleTimeInputChange = (inputValue: string) => {
    let value = inputValue.replace(/\D/g, '');
    if (value.length >= 2) {
      value = `${value.slice(0, 2)}:${value.slice(2, 4)}`;
    }
    form.setValue('timeInput', value);
  };

  const onSubmit = async (values: TimeSlotFormValues) => {
    const { timeInput } = values;

    const isTimeSlotExists = existingTimeSlots.some(
      (slot) => formatTime(slot.meetDate) === timeInput
    );
    if (isTimeSlotExists) {
      form.setError('timeInput', {
        type: 'manual',
        message: 'Цей час вже додано для цієї дати.',
      });
      return;
    }

    const [newHours, newMinutes] = timeInput.split(':').map(Number);
    const minutes = newHours * 60 + newMinutes;

    const newTimeDate = new Date(date);
    newTimeDate.setMinutes(newTimeDate.getMinutes() + minutes);

    if (existingTimeSlots.length > 0) {
      for (const existingSlot of existingTimeSlots) {
        const existingTimeDate = existingSlot.meetDate;

        const timeDifference = Math.abs(
          newTimeDate.getTime() - existingTimeDate.getTime()
        );
        const thirtyMinutes = 30 * 60 * 1000;

        if (timeDifference < thirtyMinutes) {
          form.setError('timeInput', {
            type: 'manual',
            message: `Час повинен бути мінімум 30 хвилин від ${formatTime(
              existingTimeDate
            )}.`,
          });
          return;
        }
      }
    }

    try {
      const result = await addTimeSlotAction(newTimeDate);

      if (typeof result === 'string') {
        toast.error(
          result || 'Не вдалося додати час зустрічі. Спробуйте ще раз.'
        );
      } else {
        toast.success(
          `Час ${timeInput} для ${formatDate(date)} успішно додано.`
        );
      }
      form.reset();
      setOpen(false);
    } catch (error) {
      toast.error('Не вдалося додати час зустрічі. Спробуйте ще раз.');
      console.error('Помилка додавання часу сеансу:', error);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="absolute right-0 bottom-0">
        <Button
          variant="outline"
          className="size-7 p-0 bg-transparent"
          disabled={form.formState.isSubmitting}
        >
          <Plus className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Додати час зустрічі</h4>
              <p className="text-sm text-muted-foreground">
                Введіть час у форматі HH:mm (наприклад, 09:30)
              </p>
            </div>
            <FormField
              control={form.control}
              name="timeInput"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Час</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="HH:mm"
                      maxLength={5}
                      {...field}
                      onChange={(e) => {
                        handleTimeInputChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="mt-4 w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <LoadingAnimated className="size-5 mr-4" />
              ) : (
                <AlarmPlusIcon className="size-5 mr-4" />
              )}
              Додати час
            </Button>
          </form>
        </Form>
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
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleDelete = async () => {
    setPopoverOpen(false);

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

      const [hours, minutes] = time.split(':').map(Number);
      const allMinutes = hours * 60 + minutes;

      const deletedTimeDate = new Date(date);
      deletedTimeDate.setMinutes(deletedTimeDate.getMinutes() + allMinutes);

      const result = await deleteTimeSlotAction(deletedTimeDate);

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

  return (
    <>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger className="flex items-center w-full justify-between">
          {formatTime(timeSlot.meetDate)}
          <MoreVertical className="size-4 opacity-40" />
        </PopoverTrigger>
        <PopoverContent className="w-fit">
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
        </PopoverContent>
      </Popover>

      <ConfirmationDialog
        open={isConfirmationOpen}
        onOpenChange={setIsConfirmationOpen}
        onConfirm={handleConfirmDelete}
        message="Ви впевнені, що хочете видалити цей час прийому? Для цього часу вже є запис."
      />
    </>
  );
};

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  message: string;
}

const ConfirmationDialog = ({
  open,
  onOpenChange,
  onConfirm,
  message,
}: ConfirmationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Підтвердження видалення</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Скасувати
            </Button>
          </DialogClose>
          <Button type="button" variant="destructive" onClick={onConfirm}>
            Підтвердити видалення
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
