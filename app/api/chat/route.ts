import { convertToCoreMessages, Message, streamText } from 'ai';
import { z } from 'zod';

import { geminiFlashModel } from '@/ai';
import { generateReservationPrice } from '@/ai/actions';
import {
  createReservation,
  deleteChatByEmail,
  getReservationById,
  saveChat,
} from '@/db/queries';
import { generateUUID } from '@/lib/utils/utils';
import { auth } from '@/app/(auth)/auth';
import { makeLinksForChat } from '@/db/queriesChat';

const siteEmail = process.env.NEXT_PUBLIC_SITE_EMAIL || '';

export async function POST(request: Request) {
  const { messages }: { id: string; messages: Array<Message> } =
    await request.json();

  const session = await auth();

  const coreMessages = convertToCoreMessages(messages).filter(
    (message) => message.content.length > 0
  );

  const links = await makeLinksForChat();
  // console.log('🚀 ~ POST ~ links:', links);

  const system = `
You are our site assistant who is well-versed in esoteric topics, including tarot, psychology, human design, sacred geometry, numerology, astrology, angelology, Feng Shui, matrix of destiny, and other unconventional sciences.  
You are very nice and kind in communication with our clients. After they ask you questions, you should answer them with patience.  
Your goal is to provide helpful information and guide users toward a deeper understanding of these topics. Maintain a warm and welcoming tone, and always be polite and respectful.  

- Detect the user's language and respond in the same language.  

- Use **Markdown** to structure your responses for better readability.  
- **If the user has already provided their birth time and name, use this information throughout the conversation and DO NOT ask for it again.**  
- **To avoid conflicts with our esoteric consultants, smoothly guide the conversation toward suggesting a consultation with our specialists by writing to our email address ${siteEmail} for a more detailed and accurate answer.** Example:  
- Today’s date is ${new Date().toLocaleDateString()}.  

- Guide the user through the optimal conversation flow:  
1. Getting to know the user.  
2. Understanding their mood and desires.  
3. Providing concise but polite answers.  
4. Suggesting a consultation with our specialists.  

- If a user asks a question related to an existing article or test on our website a list of which is given in the json object at the end of the instructions, provide a concise answer and suggest visiting the relevant page for more in-depth information.  
- Always prioritize sharing relevant internal links over providing a lengthy explanation.  
- Do NOT encourage the user to visit external resources. All suggestions should be limited to our website.  
**Existing articles and tests on our website:**
${JSON.stringify(links)}
`;
  // console.log('🚀 ~ POST ~ system:', system);

  const result = await streamText({
    model: geminiFlashModel,
    system,

    messages: coreMessages,

    tools: {
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

          if (session && session.user && session.user.email) {
            await createReservation({
              id,
              email: session.user.email,
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
    },

    onFinish: async ({ responseMessages }) => {
      if (session && session.user && session.user.email) {
        try {
          await saveChat({
            messages: [...coreMessages, ...responseMessages],
            email: session.user.email,
          });
        } catch (error) {
          console.error(
            `${(error as Error).name}. Failed to save chat. Error Name: `
          );
        }
      }
    },

    experimental_telemetry: {
      isEnabled: true,
      functionId: 'stream-text',
    },
  });

  return result.toDataStreamResponse({});
}

export async function DELETE() {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { email } = session.user;

  try {
    await deleteChatByEmail({ email });

    return new Response('Chat deleted', { status: 200 });
  } catch (error) {
    return new Response(
      `${(error as Error).name}. An error occurred while processing your request.`,
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
