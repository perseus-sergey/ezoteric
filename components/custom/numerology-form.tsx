'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { toast } from 'sonner';

import { ELanguage } from '@/models/language.model';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { SubmitButton } from './submit-button';
import dynamic from 'next/dynamic';
import {
  ENumerologySystem,
  INumerologyResults,
  MODAL_NUMEROLOGY,
  NUMEROLOGY_FORM_MODEL,
  numerologyFormSchema,
  TNumerologySchema,
} from '@/models/meta/numerology.model';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { generateAiNumerology } from '@/controllers/numerology.controller';

const ModalNumerologyResponse = dynamic(
  () => import('./Modals/ModalNumerologyResponse'),
  { ssr: false }
);

const { numerologyForm } = NUMEROLOGY_FORM_MODEL;
const { modalResponseErrors } = MODAL_NUMEROLOGY;

export default function NumerologyForm({ lang }: { lang: ELanguage }) {
  const [numerologyResults, setNumerologyResults] =
    useState<INumerologyResults | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [selectedSystem, setSelectedSystem] = useState<ENumerologySystem>(
  //   ENumerologySystem.Pythagorean
  // );

  const form = useForm<TNumerologySchema>({
    resolver: zodResolver(numerologyFormSchema(lang)),
    defaultValues: {
      username: '',
      birthdate: '',
      numerologySystem: ENumerologySystem.Pythagorean,
    },
  });

  async function onSubmit(data: TNumerologySchema) {
    setIsLoading(true);

    try {
      const generatedRes = await generateAiNumerology(
        data.username,
        data.birthdate,
        lang,
        data.numerologySystem
      );

      setNumerologyResults({
        ...generatedRes,
        formData: {
          username: data.username,
          birthdate: data.birthdate,
          numerologySystem: data.numerologySystem,
        },
      });
      setIsOpen(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      console.log('🚀 ~ onSubmit ~ _error:', _error);
      toast.error(() => (
        <>
          <h2 className="font-semibold">{modalResponseErrors[lang][0]}</h2>
          <p>{modalResponseErrors[lang][1]}</p>
        </>
      ));
    } finally {
      setIsLoading(false);
    }
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
                name="numerologySystem"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="pl-2">
                      {numerologyForm.system.label[lang]}
                    </FormLabel>

                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="space-y-0">
                          <FormControl>
                            <RadioGroupItem
                              value={ENumerologySystem.Pythagorean}
                              id="pythagorean"
                            />
                          </FormControl>

                          <FormLabel
                            htmlFor="pythagorean"
                            className="font-normal pl-2"
                          >
                            {numerologyForm.system.pythagorean[lang]}{' '}
                          </FormLabel>
                        </FormItem>

                        <FormItem className="space-y-0">
                          <FormControl>
                            <RadioGroupItem
                              value={ENumerologySystem.Chaldean}
                              id="chaldean"
                            />
                          </FormControl>

                          <FormLabel
                            htmlFor="chaldean"
                            className="font-normal pl-2"
                          >
                            {numerologyForm.system.chaldean[lang]}{' '}
                            {/* Додайте labels в ваш конфіг форм (i18n) */}
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="pl-2">
                      {numerologyForm.name.label[lang]}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={numerologyForm.name.placeholder[lang]}
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
                      {numerologyForm.birthdate.label[lang]}
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
                submitCaption={numerologyForm.submit.title[lang]}
                pendingCaption={numerologyForm.submit.pending[lang]}
              />
            </CardFooter>
          </Card>
        </form>
      </Form>

      {isOpen && (
        <ModalNumerologyResponse
          lang={lang}
          numerologyResult={numerologyResults}
          setIsOpen={setIsOpen}
          isOpen={isOpen}
        />
      )}
    </>
  );
}
