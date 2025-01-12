import { convertToCoreMessages, Message, streamText } from 'ai';
import { z } from 'zod';

import { geminiFlashModel } from '@/ai';
import {
  generateReservationPrice,
  generateSampleFlightSearchResults,
  generateSampleFlightStatus,
  generateSampleSeatSelection,
} from '@/ai/actions';
import {
  createReservation,
  deleteChatById,
  getChatById,
  getReservationById,
  // saveChat,
} from '@/db/queries';
import { generateUUID } from '@/lib/utils/utils';
import { auth } from '@/app/(auth)/auth';

export async function POST(request: Request) {
  const { messages }: { messages: Array<Message> } =
    // const { id, messages }: { id: string; messages: Array<Message> } =
    await request.json();

  // console.log('🚀 ~ POST ~ id:', id);

  // const session = await auth();

  // if (!session) {
  //   return new Response('Unauthorized', { status: 401 });
  // }

  const coreMessages = convertToCoreMessages(messages).filter(
    (message) => message.content.length > 0
  );

  const result = await streamText({
    model: geminiFlashModel,
    system: `
    You are the assistant of our advisor, and you are the assistant who is well known in esoterics, tarot, psychology, human design, sacred geometry, numerology, astrology, angiology, Feng Shui, matrix of destiny and other unconventional sciences. You are very nice and kind in communication with our clients after they ask you questions, you should answer them with patience and like you are a real person. Your goal is to provide helpful information and guide users toward a deeper understanding of these topics. Maintain a warm and welcoming tone, and always be polite and respectful.

After they ask you questions, ask them their name, place, date, and time of birth, so you can check their natal chart, matrix of destiny, numerology, and human design, based on what they are asking to give them some information based on their birth info but don’t give them an open response.
** If the user already gave you the information about their time of birth and name use this information further in chat, DO NOT ask that twice. 
**If a person starts to ask about another person in their life ask about name and birth info about this person for more accurate information. By telling them which information from their chart you use, give small details from their matrix destiny, astrological birth chart, human design, and other tools. 
**After the information you provide after every question, propose they talk with our advisor with this phrase (Detect the user's language (e.g., through website settings) and respond in the same language (English or Ukrainian).
: "Darling, my knowledge is quite extensive, but you can send your request to our advisor this mail info@ezoteric.net ✍🏼, and get a more open answer if you want to book time for a session with the advisor of our platform.☺️" "Любий(-а), мої знання досить обмежені, але ви можете надіслати свій запит нашому консультанту на цей імейл info@ezoteric.net ✍🏼, щоб отримати більш розгорнуту відповідь або, якщо бажаєте, забронювати час для сесії з консультантом нашої платформи.☺️"

*Here are questions that are proposed to our users (in which you should give them responses according to their date of birth and natal chart):
1.Який головний урок я маю засвоїти зараз у своєму житті? (What is the main lesson I need to learn in my life right now?)
2.Що я можу зробити, щоб притягнути у своє життя достаток і щастя? (What can I do to attract abundance and happiness into my life?)
3.Що мене чекає у коханні, кар’єрі чи особистому зростанні? (What is my future in love, career, or personal growth?)
4. Чи є людина, про яку я думаю, моєю спорідненою душею? (Is the person I'm thinking about my soulmate?)
5.Чи зміцниться мій поточний зв'язок, чи краще відпустити? (Will my current relationship grow stronger, or is it time to let go?)
6.З яким знаком зодіаку у мене найбільша сумісність відповідно до моєї дати народження? (Which zodiac sign is most compatible with me based on my date of birth?)

**Important Considerations:**

**Avoid Making Predictions or Guarantees:** Refrain from making definitive predictions or guarantees about the future. Focus on providing information and guidance.
**Respect User Beliefs:** Be respectful of the user's beliefs, even if they differ from your own.
**Maintain Professionalism:** Avoid slang, jargon, or overly casual language. Maintain a professional and helpful demeanor.
**Up-to-date Information:** Ensure the information you provide is current and accurate.
**Seamless Handoff:** If possible, integrate the booking system directly into the chat interface for a seamless transition from conversation to appointment scheduling.

**Multilingual Support:**

1. Detect the user's language (e.g., through website settings) and respond in the same language (English or Ukrainian).
2. Maintain a consistent persona and tone across both languages.

- keep your responses limited to a few sentences.
- DO NOT output lists.
- after every tool call, pretend you're showing the result to the user and keep your response limited to a couple of phrases.

**Initial Greeting:**

Upon a user initiating the chat, greet them with a personalized and context-aware message. Examples:
"Welcome to esoteric.net! 🌟 I'm here to help you explore the fascinating world of esoteric knowledge. What brings you here today?"
"Welcome, dear, to esoteric.net!🤗 I'm here to help you find answers! You can choose the proposed question or be inspired by them!☺️"
"Welcome, dear, to esoteric.net! You can ask me any questions, dear! I'm here to help you explore the fascinating world of esoteric knowledge. Which part of your life bothers you now?"

- today's date is ${new Date().toString()}.
      `,

    messages: coreMessages,

    tools: {
      getWeather: {
        description: 'Get the current weather at a location',
        parameters: z.object({
          latitude: z.number().describe('Latitude coordinate'),
          longitude: z.number().describe('Longitude coordinate'),
        }),
        execute: async ({ latitude, longitude }) => {
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`
          );

          const weatherData = await response.json();
          return weatherData;
        },
      },

      displayFlightStatus: {
        description: 'Display the status of a flight',
        parameters: z.object({
          flightNumber: z.string().describe('Flight number'),
          date: z.string().describe('Date of the flight'),
        }),
        execute: async ({ flightNumber, date }) => {
          const flightStatus = await generateSampleFlightStatus({
            flightNumber,
            date,
          });

          return flightStatus;
        },
      },

      searchFlights: {
        description: 'Search for flights based on the given parameters',
        parameters: z.object({
          origin: z.string().describe('Origin airport or city'),
          destination: z.string().describe('Destination airport or city'),
        }),
        execute: async ({ origin, destination }) => {
          const results = await generateSampleFlightSearchResults({
            origin,
            destination,
          });

          return results;
        },
      },

      selectSeats: {
        description: 'Select seats for a flight',
        parameters: z.object({
          flightNumber: z.string().describe('Flight number'),
        }),
        execute: async ({ flightNumber }) => {
          const seats = await generateSampleSeatSelection({ flightNumber });
          return seats;
        },
      },
      createReservation: {
        description: 'Display pending reservation details',
        parameters: z.object({
          seats: z.string().array().describe('Array of selected seat numbers'),
          flightNumber: z.string().describe('Flight number'),
          departure: z.object({
            cityName: z.string().describe('Name of the departure city'),
            airportCode: z.string().describe('Code of the departure airport'),
            timestamp: z.string().describe('ISO 8601 date of departure'),
            gate: z.string().describe('Departure gate'),
            terminal: z.string().describe('Departure terminal'),
          }),
          arrival: z.object({
            cityName: z.string().describe('Name of the arrival city'),
            airportCode: z.string().describe('Code of the arrival airport'),
            timestamp: z.string().describe('ISO 8601 date of arrival'),
            gate: z.string().describe('Arrival gate'),
            terminal: z.string().describe('Arrival terminal'),
          }),
          passengerName: z.string().describe('Name of the passenger'),
        }),
        execute: async (props) => {
          const { totalPriceInUSD } = await generateReservationPrice(props);
          const session = await auth();

          const id = generateUUID();

          if (session && session.user && session.user.id) {
            await createReservation({
              id,
              userId: session.user.id,
              details: { ...props, totalPriceInUSD },
            });

            return { id, ...props, totalPriceInUSD };
          } else {
            return {
              error: 'User is not signed in to perform this action!',
            };
          }
        },
      },

      authorizePayment: {
        description:
          'User will enter credentials to authorize payment, wait for user to respond when they are done',
        parameters: z.object({
          reservationId: z
            .string()
            .describe('Unique identifier for the reservation'),
        }),
        execute: async ({ reservationId }) => {
          return { reservationId };
        },
      },
      verifyPayment: {
        description: 'Verify payment status',
        parameters: z.object({
          reservationId: z
            .string()
            .describe('Unique identifier for the reservation'),
        }),
        execute: async ({ reservationId }) => {
          const reservation = await getReservationById({ id: reservationId });

          if (reservation.hasCompletedPayment) {
            return { hasCompletedPayment: true };
          } else {
            return { hasCompletedPayment: false };
          }
        },
      },

      displayBoardingPass: {
        description: 'Display a boarding pass',
        parameters: z.object({
          reservationId: z
            .string()
            .describe('Unique identifier for the reservation'),
          passengerName: z
            .string()
            .describe('Name of the passenger, in title case'),
          flightNumber: z.string().describe('Flight number'),
          seat: z.string().describe('Seat number'),
          departure: z.object({
            cityName: z.string().describe('Name of the departure city'),
            airportCode: z.string().describe('Code of the departure airport'),
            airportName: z.string().describe('Name of the departure airport'),
            timestamp: z.string().describe('ISO 8601 date of departure'),
            terminal: z.string().describe('Departure terminal'),
            gate: z.string().describe('Departure gate'),
          }),
          arrival: z.object({
            cityName: z.string().describe('Name of the arrival city'),
            airportCode: z.string().describe('Code of the arrival airport'),
            airportName: z.string().describe('Name of the arrival airport'),
            timestamp: z.string().describe('ISO 8601 date of arrival'),
            terminal: z.string().describe('Arrival terminal'),
            gate: z.string().describe('Arrival gate'),
          }),
        }),
        execute: async (boardingPass) => {
          return boardingPass;
        },
      },
    },

    onFinish: async ({ responseMessages }) => {
      console.log(
        '🚀 ~ onFinish: ~ responseMessages:',
        responseMessages.at(-1)
      );
      // if (session.user && session.user.id) {
      //   try {
      //     await saveChat({
      //       id,
      //       messages: [...coreMessages, ...responseMessages],
      //       userId: session.user.id,
      //     });
      //   } catch (error) {
      //     console.error(
      //       "Failed to save chat. Error Name: ",
      //       (error as Error).name,
      //     );
      //   }
      // }
    },

    experimental_telemetry: {
      isEnabled: true,
      functionId: 'stream-text',
    },
  });

  return result.toDataStreamResponse({});
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Not Found', { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    await deleteChatById({ id });

    return new Response('Chat deleted', { status: 200 });
  } catch (error) {
    return new Response(
      `An error occurred while processing your request. Error Name: ${
        (error as Error).name
      }`,
      {
        status: 500,
      }
    );
  }
}
// - you help users book flights!
//         - keep your responses limited to a sentence.
//         - DO NOT output lists.
//         - after every tool call, pretend you're showing the result to the user and keep your response limited to a phrase.
//         - today's date is ${new Date().toLocaleDateString()}.
//         - ask follow up questions to nudge user into the optimal flow
//         - ask for any details you don't know, like name of passenger, etc.'
//         - C and D are aisle seats, A and F are window seats, B and E are middle seats
//         - assume the most popular airports for the origin and destination
//         - here's the optimal flow
//           - search for flights
//           - choose flight
//           - select seats
//           - create reservation (ask user whether to proceed with payment or change reservation)
//           - authorize payment (requires user consent, wait for user to finish payment and let you know when done)
//           - display boarding pass (DO NOT display boarding pass without verifying payment)
