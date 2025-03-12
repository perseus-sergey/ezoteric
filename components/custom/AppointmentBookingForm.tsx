'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  TAppointmentFormValues,
  appointmentSchema,
  IScheduleEntry,
  SCHEDULE_PAGE,
} from '@/models/schedule.model';
import { TSchedule } from '@/db/schema';
import { LoadingAnimated } from '@/svg/LoadingAnimated';
import { CalendarPlus } from 'lucide-react';
import { bookAppointmentAction } from '@/actions/schedule.actions';
import { ELanguage } from '@/models/language.model';
import { formatDateLocal, formatTimeLocal } from '@/lib/utils/formatDate';

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
    questionPlaceholder,
    submitButton,
    appointmentNotChosen,
    confirmationTimeCaption,
  },
} = SCHEDULE_PAGE;

interface AppointmentBookingFormProps {
  initialSchedule: IScheduleEntry[];
  userEmail: string;
  lang: ELanguage;
}

// const formatDate = (date: Date, lang: ELanguage) =>
//   format(date, 'EEEE dd MMMM', { locale: lang === ELanguage.UA ? uk : enUS });
// const formatTime = (date: Date) => format(date, 'HH:mm');

const AppointmentBookingForm = ({
  initialSchedule,
  userEmail,
  lang,
}: AppointmentBookingFormProps) => {
  const [schedule, setSchedule] = useState<IScheduleEntry[]>(initialSchedule);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TSchedule | null>(
    null
  ); // Стан для обраного часу сеансів

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    clearErrors,
  } = useForm<TAppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      name: '',
      email: userEmail,
      question: '',
      selectedTimeSlotId: '',
    },
    mode: 'onSubmit',
  });

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

  // const onSubmit = async (data: TAppointmentFormValues) => {
  //   setIsLoading(true);
  //   try {
  //     clearErrors();
  //     const bookingResult = await bookAppointmentAction(data, lang);

  //     if (bookingResult.success) {
  //       toast.success(toastSuccessBooking.title[lang], {
  //         description: `${toastSuccessBooking.description[lang]} ${formatTime(selectedTimeSlot!.meetDate)} ${formatDate(selectedTimeSlot!.meetDate, lang)}.`,
  //       });
  //       reset();
  //       setSelectedTimeSlot(null);

  //       setSchedule((prevSchedule) => {
  //         return prevSchedule.map((daySchedule) => {
  //           if (
  //             formatDate(daySchedule.meetDate, lang) ===
  //             formatDate(selectedTimeSlot!.meetDate, lang)
  //           ) {
  //             return {
  //               ...daySchedule,
  //               times: daySchedule.times.filter(
  //                 (time) => time.id !== selectedTimeSlot!.id
  //               ),
  //             };
  //           }
  //           return daySchedule;
  //         });
  //       });
  //     } else {
  //       toast.error(toastBookingError.title[lang], {
  //         description:
  //           bookingResult.error || toastBookingError.description[lang],
  //       });
  //     }
  //   } catch (error) {
  //     toast.error(toastBookingCriticalError.title[lang], {
  //       description: toastBookingCriticalError.description[lang],
  //     });
  //     console.error('Помилка при бронюванні сеансу:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const onSubmit = async (data: TAppointmentFormValues) => {
    setIsLoading(true);
    try {
      clearErrors();
      const bookingResult = await bookAppointmentAction(data, lang);

      if (bookingResult.success) {
        toast.success(toastSuccessBooking.title[lang], {
          description: `${toastSuccessBooking.description[lang]} ${formatTimeLocal(
            selectedTimeSlot!.meetDate
          )} ${formatDateLocal(selectedTimeSlot!.meetDate, lang)}.`,
        });

        setSchedule((prevSchedule) =>
          prevSchedule.map((daySchedule) => {
            if (
              formatDateLocal(daySchedule.meetDate, lang) ===
              formatDateLocal(selectedTimeSlot!.meetDate, lang)
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
    setValue('selectedTimeSlotId', timeSlot.id); // Встановлюємо ID обраного часу в поле форми
    clearErrors('selectedTimeSlotId'); // Очищаємо помилку вибору часу, якщо вона була
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Доступні часи сеансів:</h2>
        <ScrollArea className="h-[300px] w-full rounded-md border bg-tertiary">
          <div className="p-2 sm:p-6 space-y-4">
            {schedule.map((daySchedule) => {
              const formattedDate = formatDateLocal(daySchedule.meetDate, lang);

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
                        {formatTimeLocal(timeSlot.meetDate)}
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
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-4 justify-center"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{nameLabel[lang]}</Label>
                <Input
                  id="name"
                  placeholder={namePlaceholder[lang]}
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  readOnly
                  disabled
                  type="email"
                  id="email"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="question">{questionLabel[lang]}</Label>
              <Textarea
                id="question"
                placeholder={questionPlaceholder[lang]}
                {...register('question')}
              />
              {errors.question && (
                <p className="text-red-500 text-sm">
                  {errors.question.message}
                </p>
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              {confirmationTimeCaption[lang]}{' '}
              {formatTimeLocal(selectedTimeSlot.meetDate)}{' '}
              {formatDateLocal(selectedTimeSlot.meetDate, lang)}
            </p>

            <Button type="submit" className="w-full md:w-fit">
              {submitButton[lang]}
              {isLoading ? (
                <LoadingAnimated className="size-5 mr-4" />
              ) : (
                <CalendarPlus className="size-5 mr-4" />
              )}
            </Button>
          </form>
        </>
      )}

      {!selectedTimeSlot && schedule.length > 0 && (
        <p className="text-center italic text-muted-foreground mt-4">
          {appointmentNotChosen[lang]}
        </p>
      )}
    </div>
  );
};

export default AppointmentBookingForm;
