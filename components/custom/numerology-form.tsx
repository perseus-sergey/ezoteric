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
import { generateAiNumerology } from '@/ai/numerology.controller';
import { cn } from '@/lib/utils/utils';
import ButtonBorderGlowing from './ButtonBorderGlowing';
import { Button } from '../ui/button';
import { LoadingAnimated } from '@/svg/LoadingAnimated';
import { CheckCircle } from 'lucide-react';
import { NumerologyPictogram } from '@/svg/NumerologyPictogram';

const ModalNumerologyResponse = dynamic(
  () => import('./Modals/ModalNumerologyResponse'),
  { ssr: false }
);

const { numerologyForm } = NUMEROLOGY_FORM_MODEL;
const { modalResponseErrors } = MODAL_NUMEROLOGY;

interface IProps extends React.HTMLAttributes<HTMLElement> {
  lang: ELanguage;
}

export default function NumerologyForm({ lang, className }: IProps) {
  const [numerologyResults, setNumerologyResults] =
    useState<INumerologyResults | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
          className={cn('space-y-4 w-full', className)}
        >
          <Card className="relative py-8 max-w-2xl mx-auto bg-gradient-to-l from-secondary to-transparent rounded-xl shadow-xl">
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="numerologySystem"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="pl-2 text-xl">
                      {numerologyForm.system.label[lang]}
                    </FormLabel>

                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col sm:flex-row sm:gap-6 gap-4 pl-4"
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

            <CardFooter className="w-full flex justify-center p-0 pt-8">
              <Button
                asChild
                type={isLoading ? 'button' : 'submit'}
                aria-disabled={isLoading}
                disabled={isLoading}
              >
                <ButtonBorderGlowing>
                  {isLoading
                    ? numerologyForm.submit.pending[lang]
                    : numerologyForm.submit.title[lang]}
                  {isLoading ? (
                    <LoadingAnimated />
                  ) : (
                    <CheckCircle className="opacity-80" />
                  )}
                </ButtonBorderGlowing>
              </Button>
            </CardFooter>

            <NumerologyPictogram
              className="shrink-0 size-16 absolute top-4 right-4 text-foreground/40"
              lang={lang}
            />
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
