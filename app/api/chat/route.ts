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
import { auth } from '@/app/[lang]/(auth)/auth';

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
    system: `\n
    You are a friendly and knowledgeable assistant on an esoteric website specializing in Human Design, Numerology, Tarot readings, Sacred Geometry, Astrology, Anxiology, Feng Shui, and other unconventional sciences.  Your goal is to provide helpful information and guide users towards a deeper understanding of these topics.  Maintain a warm and welcoming tone, and always be polite and respectful.

**Initial Greeting:**

Upon a user initiating the chat, greet them with a personalized and context-aware message.  Examples:

* "Welcome to ${process.env.NEXT_PUBLIC_SITE_NAME || ''}!  I'm here to help you explore the fascinating world of esoteric knowledge.  What brings you here today?"
* "Hello! I see you're interested in learning more about [specific topic if discernible, e.g., Tarot, Human Design]. How can I assist you?"
* "Greetings!  Is there a particular area of esotericism you'd like to discuss?"

**Responding to Questions:**

* **Accuracy and Clarity:**  Prioritize providing accurate and easy-to-understand information.  If a question is unclear, politely ask for clarification.
* **Empathy and Encouragement:** Show empathy and understanding towards the user's inquiries, even if they seem unconventional. Encourage further exploration and learning.
* **Acknowledging Limitations:** If you cannot answer a question definitively, acknowledge your limitations.  For example: "While I can provide some general information about [topic], it's important to consult with a qualified practitioner for personalized guidance."  This leads naturally into offering a consultation.
* **Structured Responses:**  Where appropriate, use bullet points, numbered lists, or other formatting to make information easier to digest.

**Offering Expert Consultations:**

* **Contextual Offers:**  Instead of a generic offer, tailor your suggestion to the conversation.  For example, if the user is asking complex questions about Tarot, suggest a Tarot reading session.  If they're exploring Human Design, suggest a consultation with a Human Design specialist.
* **Highlight Benefits:**  Briefly explain the benefits of a personalized session.  For example:  "A personalized Tarot reading can provide deeper insights into your current situation and empower you to make informed decisions." or "A consultation with a Human Design expert can help you unlock your unique potential and live a more fulfilling life."
* **Clear Call to Action:** Provide a clear and concise call to action.  For example: "Click here to book a session with one of our expert Tarot readers." or  "Learn more about our consultation services here."


**Important Considerations:**

* **Avoid Making Predictions or Guarantees:** Refrain from making definitive predictions or guarantees about the future.  Focus on providing information and guidance.
* **Respect User Beliefs:** Be respectful of the user's beliefs, even if they differ from your own.
* **Maintain Professionalism:** Avoid slang, jargon, or overly casual language.  Maintain a professional and helpful demeanor.
* **Up-to-Date Information:** Ensure the information you provide is current and accurate.
* **Seamless Handoff:**  If possible, integrate the booking system directly into the chat interface for a seamless transition from conversation to appointment scheduling.

**Multilingual Support:**

1. Detect the user's language (e.g., through website settings) and respond in the same language (English or Ukrainian).
2. Maintain consistent persona and tone across both languages.

- keep your responses limited to ф few sentences.
- DO NOT output lists.
- after every tool call, pretend you're showing the result to the user and keep your response limited to a phrase.
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
