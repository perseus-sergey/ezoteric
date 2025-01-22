'use client';

import { Attachment, ToolInvocation, Message } from 'ai';
import { motion } from 'motion/react';
import { clsx } from 'clsx';
import { ReactNode } from 'react';

import { UserIcon } from './icons';
import { Markdown } from './markdown';
import { Weather } from './weather';
import { AuthorizePayment } from '../flights/authorize-payment';
import { DisplayBoardingPass } from '../flights/boarding-pass';
import { CreateReservation } from '../flights/create-reservation';
import { FlightStatus } from '../flights/flight-status';
import { ListFlights } from '../flights/list-flights';
import { SelectSeats } from '../flights/select-seats';
import { VerifyPayment } from '../flights/verify-payment';
import { Meditation } from '@/svg/Meditation';
import Image from 'next/image';
import { PreviewUploaded } from './PreviewUploaded';

export const PreviewMessage = ({
  chatId,
  role,
  content,
  toolInvocations,
  attachments,
  userName,
  userImgSrc,
}: {
  chatId: string;
  role: Message['role'];
  content: string | ReactNode;
  toolInvocations: Array<ToolInvocation> | undefined;
  attachments?: Array<Attachment>;
  userName?: string | null;
  userImgSrc?: string | null;
}) => {
  return (
    <motion.div
      className={`flex flex-row gap-1 w-full first-of-type:pt-4`}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="size-10 flex flex-col justify-center items-center shrink-0 rounded-full bg-tertiary/70 text-tertiary-foreground/80">
        {role === 'assistant' ? (
          <Meditation />
        ) : userImgSrc ? (
          <Image
            src={userImgSrc}
            width={24}
            height={24}
            alt={`${userName}'s avatar`}
            className="rounded-full"
          />
        ) : (
          <UserIcon />
        )}
      </div>

      <div className="flex flex-col gap-2 w-full">
        {content && typeof content === 'string' && (
          <div
            className={clsx(
              'text-zinc-800 dark:text-zinc-300 flex flex-col gap-4',
              role !== 'assistant' && 'rounded-sm bg-muted p-2'
            )}
          >
            <Markdown>{content}</Markdown>
          </div>
        )}

        {toolInvocations && (
          <div className="flex flex-col gap-4">
            {toolInvocations.map((toolInvocation) => {
              const { toolName, toolCallId, state } = toolInvocation;

              if (state === 'result') {
                const { result } = toolInvocation;

                return (
                  <div key={toolCallId}>
                    {toolName === 'getWeather' ? (
                      <Weather weatherAtLocation={result} />
                    ) : toolName === 'displayFlightStatus' ? (
                      <FlightStatus flightStatus={result} />
                    ) : toolName === 'searchFlights' ? (
                      <ListFlights chatId={chatId} results={result} />
                    ) : toolName === 'selectSeats' ? (
                      <SelectSeats chatId={chatId} availability={result} />
                    ) : toolName === 'createReservation' ? (
                      Object.keys(result).includes('error') ? null : (
                        <CreateReservation reservation={result} />
                      )
                    ) : toolName === 'authorizePayment' ? (
                      <AuthorizePayment intent={result} />
                    ) : toolName === 'displayBoardingPass' ? (
                      <DisplayBoardingPass boardingPass={result} />
                    ) : toolName === 'verifyPayment' ? (
                      <VerifyPayment result={result} />
                    ) : (
                      <div>{JSON.stringify(result, null, 2)}</div>
                    )}
                  </div>
                );
              } else {
                return (
                  <div key={toolCallId} className="skeleton">
                    {toolName === 'getWeather' ? (
                      <Weather />
                    ) : toolName === 'displayFlightStatus' ? (
                      <FlightStatus />
                    ) : toolName === 'searchFlights' ? (
                      <ListFlights chatId={chatId} />
                    ) : toolName === 'selectSeats' ? (
                      <SelectSeats chatId={chatId} />
                    ) : toolName === 'createReservation' ? (
                      <CreateReservation />
                    ) : toolName === 'authorizePayment' ? (
                      <AuthorizePayment />
                    ) : toolName === 'displayBoardingPass' ? (
                      <DisplayBoardingPass />
                    ) : null}
                  </div>
                );
              }
            })}
          </div>
        )}

        {attachments && (
          <div className="flex flex-row gap-2">
            {attachments.map((attachment) => (
              <PreviewUploaded key={attachment.url} uploadFile={attachment} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
