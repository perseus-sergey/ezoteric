import { convertToCoreMessages, Message, streamText } from "ai";
import { z } from "zod";

import { geminiFlashModel } from "@/ai";
import {
  generateReservationPrice,
  generateSampleFlightSearchResults,
  generateSampleFlightStatus,
  generateSampleSeatSelection,
} from "@/ai/actions";
import {
  createReservation,
  deleteChatById,
  getChatById,
  getReservationById,
  saveChat,
} from "@/db/queries";
import { generateUUID } from "@/lib/utils/utils";
import { auth } from "@/app/[lang]/(auth)/auth";

export async function POST(request: Request) {
  const { id, messages }: { id: string; messages: Array<Message> } =
    await request.json();

  const session = await auth();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const coreMessages = convertToCoreMessages(messages).filter(
    (message) => message.content.length > 0,
  );

  const result = await streamText({
    model: geminiFlashModel,
    system: `\n
   **Persona:** You are an expert in esoteric practices like numerology and Tarot reading, passionate about helping people understand themselves and their paths.  You are warm, empathetic, and genuinely interested in their well-being.  While knowledgeable, you also understand the limits of these practices and encourage critical thinking.  You are representing the esoteric.net website and are there to guide users through its services.

**Initial Interaction:**

1. Greet the user warmly and personalize the greeting if possible (e.g., using their name if provided through website integration).  Examples:
    * "Welcome to esoteric.net! I'm here to guide you on your journey of self-discovery.  How can I assist you today?"
    * "Hello [user name]!  Welcome back to esoteric.net.  Is there anything specific you'd like to explore today?"

**Responding to Questions:**

1. Answer user questions accurately and thoroughly to the best of your ability within the domains of numerology, Tarot, and other esoteric practices offered on the website.
2. Provide context and nuance to your answers. Avoid overly simplistic or deterministic interpretations.  Acknowledge the complexity and multifaceted nature of these practices.
3. If a question falls outside your expertise or delves into sensitive personal matters requiring professional advice (e.g., medical, legal, financial), politely deflect and suggest seeking help from a qualified professional in the relevant field.
4. If the user's query is unclear or ambiguous, ask clarifying questions to better understand their needs.

**Offering Expert Sessions:**

1. After answering a user's initial questions, subtly introduce the option of a paid session with a human expert.  Frame it as an opportunity for deeper personalized guidance and insights.  Examples:
    * "Based on what you've shared, a personalized Tarot reading could provide valuable insights into your current situation.  We offer expert sessions with experienced readers. Would you be interested in learning more?"
    * "If you'd like to explore your numerology chart in greater detail and understand its implications for your life path, a session with one of our experts can be incredibly beneficial.  Are you open to exploring that option?"
2.  Provide clear and concise information on how to book a session, including pricing, scheduling, and the expertise of the available specialists.  Link to the relevant page on the website.
3.  Be respectful and avoid being pushy.  Let the user decide if a paid session is right for them.

**Multilingual Support:**

1. Detect the user's language (e.g., through website settings) and respond in the same language (English or Ukrainian).
2. Maintain consistent persona and tone across both languages.

- keep your responses limited to a sentence.
- DO NOT output lists.
- after every tool call, pretend you're showing the result to the user and keep your response limited to a phrase.
- today's date is ${new Date().toString()}.

**Example Interactions (English):**

* **User:** "I'm interested in learning about my life path number."
* **Chatbot:** "That's wonderful!  Your life path number can reveal much about your inherent talents and challenges.  To calculate it, I'll need your full date of birth.  Alternatively, you can explore our numerology page [link] for more information. Would you like me to calculate it for you?"


* **User:** "Can Tarot predict the future?"
* **Chatbot:** "Tarot isn't about predicting the future in a fixed sense.  It's a tool for exploring potential outcomes and gaining insights into your current situation to empower you to make informed decisions.  A reading can offer guidance, but it's ultimately up to you to shape your destiny.  Would you like to learn more about our Tarot readings?"
      `,
    messages: coreMessages,
    tools: {
      getWeather: {
        description: "Get the current weather at a location",
        parameters: z.object({
          latitude: z.number().describe("Latitude coordinate"),
          longitude: z.number().describe("Longitude coordinate"),
        }),
        execute: async ({ latitude, longitude }) => {
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`,
          );

          const weatherData = await response.json();
          return weatherData;
        },
      },
      displayFlightStatus: {
        description: "Display the status of a flight",
        parameters: z.object({
          flightNumber: z.string().describe("Flight number"),
          date: z.string().describe("Date of the flight"),
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
        description: "Search for flights based on the given parameters",
        parameters: z.object({
          origin: z.string().describe("Origin airport or city"),
          destination: z.string().describe("Destination airport or city"),
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
        description: "Select seats for a flight",
        parameters: z.object({
          flightNumber: z.string().describe("Flight number"),
        }),
        execute: async ({ flightNumber }) => {
          const seats = await generateSampleSeatSelection({ flightNumber });
          return seats;
        },
      },
      createReservation: {
        description: "Display pending reservation details",
        parameters: z.object({
          seats: z.string().array().describe("Array of selected seat numbers"),
          flightNumber: z.string().describe("Flight number"),
          departure: z.object({
            cityName: z.string().describe("Name of the departure city"),
            airportCode: z.string().describe("Code of the departure airport"),
            timestamp: z.string().describe("ISO 8601 date of departure"),
            gate: z.string().describe("Departure gate"),
            terminal: z.string().describe("Departure terminal"),
          }),
          arrival: z.object({
            cityName: z.string().describe("Name of the arrival city"),
            airportCode: z.string().describe("Code of the arrival airport"),
            timestamp: z.string().describe("ISO 8601 date of arrival"),
            gate: z.string().describe("Arrival gate"),
            terminal: z.string().describe("Arrival terminal"),
          }),
          passengerName: z.string().describe("Name of the passenger"),
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
              error: "User is not signed in to perform this action!",
            };
          }
        },
      },
      authorizePayment: {
        description:
          "User will enter credentials to authorize payment, wait for user to respond when they are done",
        parameters: z.object({
          reservationId: z
            .string()
            .describe("Unique identifier for the reservation"),
        }),
        execute: async ({ reservationId }) => {
          return { reservationId };
        },
      },
      verifyPayment: {
        description: "Verify payment status",
        parameters: z.object({
          reservationId: z
            .string()
            .describe("Unique identifier for the reservation"),
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
        description: "Display a boarding pass",
        parameters: z.object({
          reservationId: z
            .string()
            .describe("Unique identifier for the reservation"),
          passengerName: z
            .string()
            .describe("Name of the passenger, in title case"),
          flightNumber: z.string().describe("Flight number"),
          seat: z.string().describe("Seat number"),
          departure: z.object({
            cityName: z.string().describe("Name of the departure city"),
            airportCode: z.string().describe("Code of the departure airport"),
            airportName: z.string().describe("Name of the departure airport"),
            timestamp: z.string().describe("ISO 8601 date of departure"),
            terminal: z.string().describe("Departure terminal"),
            gate: z.string().describe("Departure gate"),
          }),
          arrival: z.object({
            cityName: z.string().describe("Name of the arrival city"),
            airportCode: z.string().describe("Code of the arrival airport"),
            airportName: z.string().describe("Name of the arrival airport"),
            timestamp: z.string().describe("ISO 8601 date of arrival"),
            terminal: z.string().describe("Arrival terminal"),
            gate: z.string().describe("Arrival gate"),
          }),
        }),
        execute: async (boardingPass) => {
          return boardingPass;
        },
      },
    },
    onFinish: async ({ responseMessages }) => {
      if (session.user && session.user.id) {
        try {
          await saveChat({
            id,
            messages: [...coreMessages, ...responseMessages],
            userId: session.user.id,
          });
        } catch (error) {
          console.error(
            "Failed to save chat. Error Name: ",
            (error as Error).name,
          );
        }
      }
    },
    experimental_telemetry: {
      isEnabled: true,
      functionId: "stream-text",
    },
  });

  return result.toDataStreamResponse({});
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Not Found", { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    await deleteChatById({ id });

    return new Response("Chat deleted", { status: 200 });
  } catch (error) {
    return new Response(
      `An error occurred while processing your request. Error Name: ${
        (error as Error).name
      }`,
      {
        status: 500,
      },
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
