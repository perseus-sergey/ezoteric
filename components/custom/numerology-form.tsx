'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ELanguage } from '@/models/language.model';
import {
  BIRTH_DATE_FORMAT,
  IModalAiResponseProps,
  MAIN_TEXT,
  numerologyFormSchema,
  TNumerologySchema,
} from '@/models/meta/home.model';
import { generateAiNumerology } from '@/controllers/numerology.controller';
import { useState } from 'react';
import { ModalNumerologyResponse } from './Modals/ModalNumerologyResponse';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { SubmitButton } from './submit-button';

const {
  numerForm: { form: numerForm },
} = MAIN_TEXT;

export default function NumerologyForm({ lang }: { lang: ELanguage }) {
  const [aiResult, setAiResult] = useState<IModalAiResponseProps | null>(null);
  const [hasResult, setHasResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<TNumerologySchema>>({
    resolver: zodResolver(numerologyFormSchema(lang)),
    defaultValues: {
      username: '',
      birthdate: '',
    },
  });

  async function onSubmit(data: z.infer<TNumerologySchema>) {
    setIsLoading(true);
    const result = await generateAiNumerology(
      data.username,
      data.birthdate,
      lang
    );
    setAiResult({
      aiResponse: result,
      formData: {
        username: data.username,
        birthdate: format(data.birthdate, BIRTH_DATE_FORMAT),
      },
    });
    setHasResult(true);
    setIsLoading(false);
  }

  return (
    <>
      <Form {...form}>
        <form
          aria-label="Numerology Form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full sm:w-96 shrink-0"
        >
          <Card>
            <CardContent className="pt-4 space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="pl-2">
                      {numerForm.name.label[lang]}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={numerForm.name.placeholder[lang]}
                        {...field}
                        className="dark:border-stone-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthdate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="pl-2">
                      {numerForm.birthdate.label[lang]}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        className="dark:border-stone-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <SubmitButton
                pending={isLoading}
                submitCaption={numerForm.submit.title[lang]}
                pendingCaption={numerForm.submit.pending[lang]}
              />
            </CardFooter>
          </Card>
        </form>
      </Form>

      <ModalNumerologyResponse
        lang={lang}
        aiResult={aiResult}
        openDialogFn={setHasResult}
        isOpen={hasResult}
      />
    </>
  );
}
