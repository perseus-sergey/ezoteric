import { TSchedule } from '@/db/schema';
import { z } from 'zod';
import { ELanguage } from './language.model';

const { EN, UA } = ELanguage;

export interface IScheduleEntry {
  meetDate: Date;
  times: TSchedule[];
}

// Zod для валідації форми бронювання
export const appointmentSchema = z.object({
  name: z.string().min(2, { message: "Ім'я має містити мінімум 2 символи" }),
  email: z.string().email({ message: 'Невірний формат email' }),
  question: z.string().min(3, { message: 'Має містити мінімум 3 символи' }),
  selectedTimeSlotId: z.string().min(1, { message: 'Виберіть час прийому' }), // ID обраного часу прийому
});

export type TAppointmentFormValues = z.infer<typeof appointmentSchema>;

export const SCHEDULE_PAGE = {
  titleH1: {
    [UA]: 'Забронювати сеанс',
    [EN]: 'Book an appointment',
  },
  appointmentForm: {
    toastSuccessBooking: {
      title: {
        [UA]: 'Сеанс успішно заброньовано!',
        [EN]: 'Appointment booked successfully!',
      },
      description: {
        [UA]: 'На час',
        [EN]: 'At',
      },
    },
    toastBookingError: {
      title: {
        [UA]: 'Помилка бронювання!',
        [EN]: 'Booking error!',
      },
      description: {
        [UA]: 'Не вдалося забронювати сеанс. Спробуйте ще раз.',
        [EN]: 'Failed to book an appointment. Please try again.',
      },
    },
    toastBookingCriticalError: {
      title: {
        [UA]: 'Критична помилка бронювання!',
        [EN]: 'Critical booking error!',
      },
      description: {
        [UA]: 'Не вдалося забронювати сеанс. Спробуйте зайти пізніше.',
        [EN]: 'Failed to book an appointment. Please try again later.',
      },
    },
    confirmationTimeCaption: {
      [UA]: 'Ви обрали час сеансу:',
      [EN]: 'You selected the appointment time:',
    },
    emptyDateCaption: {
      [UA]: 'Немає доступних годин сеансів на цю дату.',
      [EN]: 'No available appointments on this date.',
    },
    emptyTimesCaption: {
      [UA]: 'Наразі немає доступних годин сеансів.',
      [EN]: 'There are currently no available appointment times.',
    },
    formCaption: {
      [UA]: 'Заповніть необхідні поля, будь ласка.',
      [EN]: 'Fill in all required fields please.',
    },
    nameLabel: {
      [UA]: "Ім'я",
      [EN]: 'Name',
    },
    namePlaceholder: {
      [UA]: "Введіть ваше ім'я",
      [EN]: 'Enter your name',
    },
    questionLabel: {
      [UA]: 'Питання',
      [EN]: 'Question',
    },
    questionPlaceholder: {
      [UA]: 'Кратко опишіть питання яке ви хотіли б обговорити...',
      [EN]: 'Briefly describe the question you want to discuss...',
    },
    submitButton: {
      [UA]: 'Забронювати сеанс',
      [EN]: 'Book an appointment',
    },
    appointmentNotChosen: {
      [UA]: 'Виберіть доступний час сеансу, щоб продовжити бронювання.',
      [EN]: 'Choose an available appointment time to continue booking.',
    },
  },
};
