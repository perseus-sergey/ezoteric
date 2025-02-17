'use client';

import { EUrlSearchParam } from '@/models/url.model';
import { Button } from '../ui/button';
import { Loader2, Search, SearchCheckIcon, X } from 'lucide-react';
import { Input } from '../ui/input';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ELanguage } from '@/models/language.model';
import { Separator } from '../ui/separator';

const errorMessages = {
  searchQuery: {
    [ELanguage.UA]: 'Щонайменш 3 символи, або залиште порожнім',
    [ELanguage.EN]: 'Minimum 3 characters, or leave blank',
  },
};

export const getSearchFormSchema = (lang: ELanguage) =>
  z.object({
    searchQuery: z
      .string()
      .trim()
      .refine(
        (val) => {
          return val === '' || val.length > 2;
        },
        {
          message: errorMessages.searchQuery[lang],
        }
      ),
  });

interface IFilterProps {
  startUrl: string;
  placeholder: string;
  inputAriaLabel: string;
  submitAriaLabel: string;
  searchQueryTitle: EUrlSearchParam;
  cancelAriaLabel: string;
  lang: ELanguage;
}

export default function SearchInput({
  startUrl,
  placeholder,
  inputAriaLabel,
  cancelAriaLabel,
  submitAriaLabel,
  searchQueryTitle,
  lang,
}: IFilterProps) {
  const searchParams = useSearchParams();
  const { push } = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [prevUrl, setPrevUrl] = useState(searchParams.toString());

  const initialQuery = searchParams.get(searchQueryTitle) || '';

  const form = useForm({
    resolver: zodResolver(getSearchFormSchema(lang)),
    defaultValues: {
      searchQuery: searchParams.get(searchQueryTitle)?.toString() || '',
    },
    mode: 'onChange', // 🔹 Миттєва валідація на кожному символі
  });

  const { handleSubmit, control, setValue, watch, formState } = form;

  const { errors } = formState;
  const searchValue = watch('searchQuery'); // Відстежуємо зміни в полі
  const isDirty = searchValue.trim() !== initialQuery; // Чи змінився запит?
  const isInvalid = !!errors.searchQuery; // Чи є помилки валідації?

  useEffect(() => {
    if (!searchParams.get(searchQueryTitle)) {
      setValue('searchQuery', '');
    } else {
      setValue('searchQuery', searchParams.get(searchQueryTitle)!);
    }
  }, [searchParams]);

  useEffect(() => {
    const currentUrl = searchParams.toString();
    if (prevUrl !== currentUrl) {
      setIsLoading(false); // Якщо URL змінився, вимикаємо завантаження
      setPrevUrl(currentUrl);
    }

    form.setFocus('searchQuery');
  }, [searchParams]);

  const handleSearch = () => {
    setIsLoading(true);

    const term = searchValue.trim();
    const params = new URLSearchParams(searchParams.toString());

    const page = params.get(EUrlSearchParam.PAGE);

    // Якщо сторінка не перша, скидаємо її на першу
    if (page && page !== '1') params.set(EUrlSearchParam.PAGE, '1');

    if (term) {
      params.set(searchQueryTitle, term);
    } else {
      // eslint-disable-next-line drizzle/enforce-delete-with-where
      params.delete(searchQueryTitle);
    }

    push(`${startUrl}?${params.toString()}`);
  };

  const cancelClickHandler = () => {
    setValue('searchQuery', '');
    form.setFocus('searchQuery');
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(handleSearch)} className="w-fit relative">
        <FormField
          control={control}
          name="searchQuery"
          render={({ field }) => (
            <div className="relative w-full max-w-md mx-auto">
              <FormItem className="space-y-0">
                <FormLabel htmlFor="search-input" className="sr-only">
                  {inputAriaLabel}
                </FormLabel>

                <FormControl>
                  <Input
                    id="search-input"
                    {...field}
                    placeholder={placeholder}
                    aria-label={inputAriaLabel}
                    className="pr-12 pl-9"
                  />
                </FormControl>

                <FormMessage className="absolute bottom-0 translate-y-[110%] /70 p-1" />
              </FormItem>

              {field.value && (
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute left-1 top-1/2 -translate-y-1/2 hover:bg-primary/20 size-7 p-0 rounded-full"
                  onClick={cancelClickHandler}
                  aria-label={cancelAriaLabel}
                >
                  <X className="size-4 text-muted-foreground" />
                </Button>
              )}
            </div>
          )}
        />

        <Button
          type="submit"
          disabled={isLoading || !isDirty || isInvalid}
          aria-label={submitAriaLabel}
          size="icon"
          variant="ghost"
          className="absolute right-1 top-1/2 -translate-y-1/2 hover:bg-transparent rounded-full"
        >
          <Separator orientation="vertical" />

          {isLoading ? (
            <Loader2 className="animate-spin text-muted-foreground" />
          ) : isDirty && !isInvalid ? (
            <SearchCheckIcon className="text-muted-foreground" />
          ) : (
            <Search className="opacity-70" />
          )}
        </Button>
      </form>
    </Form>
  );
}
