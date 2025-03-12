'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import {
  TAppointmentFormValues,
  appointmentSchema,
  IScheduleEntry,
  SCHEDULE_PAGE,
  DEFAULT_QUESTIONS,
} from '@/models/schedule.model';
import { TSchedule } from '@/db/schema';
import { LoadingAnimated } from '@/svg/LoadingAnimated';
import { CalendarPlus, Check, ChevronsUpDown } from 'lucide-react';
import { bookAppointmentAction } from '@/actions/schedule.actions';
import { ELanguage } from '@/models/language.model';
import { formatDateLocal, formatTimeLocal } from '@/lib/utils/formatDate';
import { cn } from '@/lib/utils/utils';

const {
  appointmentForm: {
    toastBookingCriticalError,
    toastBookingError,
    toastSuccessBooking,
    emptyDateCaption,
    emptyTimesCaption,
    formCaption,
    nameLabel,
    namePlaceholder,
    questionLabel,
    questionDropPlaceholder,
    submitButton,
    appointmentNotChosen,
    confirmationTimeCaption,
    questionDropNotFound,
    searchPlaceholder,
    forEmail,
    availableSlotsCaption,
  },
} = SCHEDULE_PAGE;

interface AppointmentBookingFormProps {
  initialSchedule: IScheduleEntry[];
  userEmail: string;
  lang: ELanguage;
}

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const dirtyValidate = {
  shouldDirty: true,
  shouldValidate: true,
};

const AppointmentBookingForm = ({
  initialSchedule,
  userEmail,
  lang,
}: AppointmentBookingFormProps) => {
  const [schedule, setSchedule] = useState<IScheduleEntry[]>(initialSchedule);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TSchedule | null>(
    null
  ); // Стан для обраного часу сеансів

  const form = useForm<TAppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      name: '',
      email: userEmail,
      question: '',
      selectedTimeSlotId: '',
    },
    mode: 'onSubmit',
  });

  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    clearErrors,
    control,
  } = form;

  const bookFormTitleRef = useRef<HTMLHeadingElement>(null);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedTimeSlot && bookFormTitleRef.current) {
      bookFormTitleRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [selectedTimeSlot]);

  const onSubmit = async (data: TAppointmentFormValues) => {
    setIsLoading(true);
    try {
      clearErrors();
      const bookingResult = await bookAppointmentAction(data, lang, timeZone);

      if (bookingResult.success) {
        toast.success(toastSuccessBooking.title[lang], {
          description: `${toastSuccessBooking.description[lang]} ${formatTimeLocal(
            selectedTimeSlot!.meetDate,
            timeZone
          )} ${formatDateLocal(selectedTimeSlot!.meetDate, lang, timeZone)}.`,
        });

        setSchedule((prevSchedule) =>
          prevSchedule.map((daySchedule) => {
            if (
              formatDateLocal(daySchedule.meetDate, lang, timeZone) ===
              formatDateLocal(selectedTimeSlot!.meetDate, lang, timeZone)
            ) {
              return {
                ...daySchedule,
                times: daySchedule.times.filter(
                  (time) => time.id !== selectedTimeSlot!.id
                ),
              };
            }
            return daySchedule;
          })
        );

        setSelectedTimeSlot(null);
        reset();
      } else {
        toast.error(toastBookingError.title[lang], {
          description: bookingResult.error,
        });
      }
    } catch (error) {
      console.error('Помилка при бронюванні сеансу:', error);
      toast.error(toastBookingCriticalError.title[lang], {
        description: toastBookingCriticalError.description[lang],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeSlotSelect = (timeSlot: TSchedule) => {
    setSelectedTimeSlot(timeSlot);
    setValue('selectedTimeSlotId', timeSlot.id, dirtyValidate); // Встановлюємо ID обраного часу в поле форми
    clearErrors('selectedTimeSlotId'); // Очищаємо помилку вибору часу, якщо вона була
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-6 justify-center"
      >
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">
            {availableSlotsCaption[lang]}
          </h2>
          <ScrollArea className="h-[300px] w-full rounded-md border bg-tertiary">
            <div className="p-2 sm:p-6 space-y-4">
              {schedule.map((daySchedule) => {
                const formattedDate = formatDateLocal(
                  daySchedule.meetDate,
                  lang,
                  timeZone
                );

                return (
                  <div key={formattedDate}>
                    <h3 className="font-semibold">{formattedDate}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {daySchedule.times.map((timeSlot) => (
                        <Button
                          type="button"
                          key={timeSlot.id}
                          variant="outline"
                          size="sm"
                          className={`justify-center ${selectedTimeSlot?.id === timeSlot.id ? 'bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground' : ''}`}
                          onClick={() => handleTimeSlotSelect(timeSlot)}
                        >
                          {formatTimeLocal(timeSlot.meetDate, timeZone)}
                        </Button>
                      ))}
                      {daySchedule.times.length === 0 && (
                        <p className="col-span-full text-sm italic text-muted-foreground">
                          {emptyDateCaption[lang]}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
              {schedule.length === 0 && (
                <p className="text-center italic text-muted-foreground">
                  {emptyTimesCaption[lang]}
                </p>
              )}
            </div>
          </ScrollArea>
          {errors.selectedTimeSlotId && (
            <p className="text-red-500 text-sm mt-1">
              {errors.selectedTimeSlotId.message}
            </p>
          )}
        </div>

        {selectedTimeSlot && (
          <>
            <h2
              id="book-form"
              className="text-xl font-semibold text-center py-4"
              ref={bookFormTitleRef}
            >
              {formCaption[lang]}
            </h2>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{nameLabel[lang]}</FormLabel>
                  <FormControl>
                    <Input placeholder={namePlaceholder[lang]} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="question"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="w-fit">{questionLabel[lang]}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'w-full justify-between',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value
                            ? DEFAULT_QUESTIONS[lang].find(
                                (question) => question === field.value
                              )
                            : questionDropPlaceholder[lang]}
                          <ChevronsUpDown className="opacity-50 size-4" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>

                    <PopoverContent className="w-full min-w-72 p-0">
                      <Command>
                        <CommandInput
                          placeholder={searchPlaceholder[lang]}
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>
                            {questionDropNotFound[lang]}
                          </CommandEmpty>
                          <CommandGroup>
                            {DEFAULT_QUESTIONS[lang].map((question) => (
                              <CommandItem
                                value={question}
                                key={question}
                                onSelect={() => {
                                  setValue('question', question, dirtyValidate);
                                }}
                              >
                                {question}
                                <Check
                                  className={cn(
                                    'ml-auto',
                                    question === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full md:w-fit"
              disabled={!form.formState.isDirty}
            >
              {submitButton[lang]}
              {isLoading ? (
                <LoadingAnimated className="size-5 mr-4" />
              ) : (
                <CalendarPlus className="size-5 mr-4" />
              )}
            </Button>

            <FormDescription>
              {confirmationTimeCaption[lang]}{' '}
              <b>
                {formatTimeLocal(selectedTimeSlot.meetDate, timeZone)}{' '}
                {formatDateLocal(selectedTimeSlot.meetDate, lang, timeZone)}
              </b>
              <br />
              {forEmail[lang]} <b>{userEmail}</b>
            </FormDescription>
          </>
        )}

        {!selectedTimeSlot && schedule.length > 0 && (
          <p className="text-center italic text-muted-foreground mt-4">
            {appointmentNotChosen[lang]}
          </p>
        )}
      </form>
    </Form>
  );
};

export default AppointmentBookingForm;
