'use state';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TinyEditor } from './TinyEditor';
import { CodeBlock } from './CodeBlock';
import { Checkbox } from '../ui/checkbox';
import { useState } from 'react';
import { Lock, LockOpen, RefreshCcw } from 'lucide-react';
import { Controller, UseFormReturn } from 'react-hook-form';
import {
  IEditArticleTranslate,
  TArticleFormValues,
} from '@/models/editArticle.model';
import { aiTranslateArticle } from '@/controllers/aiTranslateArticle.controller';
import { toast } from 'sonner';
import { LoadingAnimated } from '@/svg/LoadingAnimated';
import clsx from 'clsx';
import { makeSlug } from '@/controllers/articleEdit.controller';

export const FormAddEditArticle = ({
  editorApiKey,
  onSubmit,
  isSaving,
  form,
}: {
  editorApiKey: string;
  isSaving: boolean;
  onSubmit: (values: TArticleFormValues) => Promise<void>;
  form: UseFormReturn<TArticleFormValues>;
}) => {
  const [slugDisabled, setSlugDisabled] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);

  const slugDisableToggle = () => setSlugDisabled((prevState) => !prevState);

  const slugRefreshHandler = () =>
    form.setValue('slug', makeSlug(form.getValues().titleEn));

  const handleTranslate = async () => {
    const { titleUa, descriptionUa, keywordsUa, textUa } = form.getValues();

    if (!titleUa || !descriptionUa || !keywordsUa || !textUa) {
      toast.error(
        'Будь ласка, заповніть всі українські поля перед перекладом.'
      );
      return;
    }

    setIsTranslating(true);

    try {
      const translatedData: IEditArticleTranslate = await aiTranslateArticle(
        titleUa,
        descriptionUa,
        keywordsUa,
        textUa
      );

      // Update the form fields with the translated values
      form.setValue('titleEn', translatedData.titleEn);
      form.setValue('descriptionEn', translatedData.descriptionEn);
      form.setValue('keywordsEn', translatedData.keywordsEn);
      form.setValue('textEn', translatedData.contentEn);
    } catch (error) {
      toast.error(`Помилка перекладу: ${error}`);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 bg-tertiary p-6 rounded-md"
      >
        {/* Title UA */}
        <FormField
          control={form.control}
          name="titleUa"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title (UA)</FormLabel>
              <FormControl>
                <Input placeholder="Заголовок українською" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description UA */}
        <FormField
          control={form.control}
          name="descriptionUa"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (UA)</FormLabel>
              <FormControl>
                <Textarea placeholder="Опис українською" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Keywords UA */}
        <FormField
          control={form.control}
          name="keywordsUa"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keywords (UA)</FormLabel>
              <FormControl>
                <Textarea placeholder="Ключові слова українською" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center">
          <CodeBlock code={`class="section-image__wrapper"`} />

          <div className="flex items-center gap-2 w-fit px-2 py-1 bg-muted-foreground rounded-md">
            <div className="bg-muted rounded-md size-6" />
            <div className="space-y-1">
              <div className="bg-muted rounded-md h-2 w-24" />
              <div className="bg-muted rounded-md h-2 w-24" />
            </div>
          </div>
        </div>

        {/* TinyMCE Editor for textUa */}
        <Controller
          name="textUa"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Text (UA)</FormLabel>
              <TinyEditor
                onEditorChange={field.onChange}
                id="textUa"
                editorApiKey={editorApiKey}
                value={field.value}
              />
              {fieldState.error && (
                <FormMessage>{fieldState.error.message}</FormMessage>
              )}
            </FormItem>
          )}
        />

        <Button
          type="button"
          onClick={handleTranslate}
          disabled={isTranslating}
        >
          {isTranslating && <LoadingAnimated />}{' '}
          {isTranslating ? 'Перекладається...' : 'Перекласти'}
        </Button>

        {/* Title EN */}
        <FormField
          control={form.control}
          name="titleEn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title (EN)</FormLabel>
              <FormControl>
                <Input placeholder="Title in English" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description EN */}
        <FormField
          control={form.control}
          name="descriptionEn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (EN)</FormLabel>
              <FormControl>
                <Textarea placeholder="Description in English" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Keywords EN */}
        <FormField
          control={form.control}
          name="keywordsEn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keywords (EN)</FormLabel>
              <FormControl>
                <Textarea placeholder="Keywords in English" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* TinyMCE Editor for textEn */}
        <Controller
          name="textEn"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Text (EN)</FormLabel>
              <TinyEditor
                onEditorChange={field.onChange}
                id="textEn"
                editorApiKey={editorApiKey}
                value={field.value}
                // editorRef={editorEnRef}
              />
              {fieldState.error && (
                <FormMessage>{fieldState.error.message}</FormMessage>
              )}
            </FormItem>
          )}
        />

        {/* Slug */}
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <div className="w-full flex items-center gap-4">
                <div className="relative text-muted-foreground flex-1">
                  <FormControl>
                    <Input
                      {...field}
                      className="pr-8"
                      placeholder="article-slug"
                      disabled={slugDisabled}
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={slugDisableToggle}
                    className="absolute right-2 bottom-1/2 translate-y-1/2"
                  >
                    {!slugDisabled ? (
                      <LockOpen className="size-5" />
                    ) : (
                      <Lock className="size-5" />
                    )}
                  </button>
                </div>
                <Button
                  title="Update Slug"
                  type="button"
                  onClick={slugRefreshHandler}
                  className=""
                  disabled={slugDisabled}
                  variant="outline"
                >
                  <RefreshCcw className="size-5" />
                </Button>
              </div>
              <FormDescription>
                {`Унікальний ідентифікатор статті. Складається автоматично із поля "Title (EN)" на етапі додавання статті. ⚠ Не бажано змінювати вручну.`}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image Name */}
        <FormField
          control={form.control}
          name="imageSrc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image Source</FormLabel>
              <FormControl>
                <Input placeholder="imageSrc.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Spotify */}
        <FormField
          control={form.control}
          name="spotifyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Spotify track ID</FormLabel>
              <FormControl>
                <Input
                  placeholder="6pnwfWyaWjQiHCKTiZLItr"
                  {...field}
                  value={field.value || ''} // Перетворюємо null на порожній рядок
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Published */}
        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start w-fit space-x-3 space-y-0 rounded-md border p-4 shadow">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Is Article published</FormLabel>
                <FormDescription>
                  If you uncheck it, the article will not be displayed on the
                  site.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSaving}
          className={clsx(isSaving && 'cursor-progress')}
        >
          {isSaving && <LoadingAnimated />} {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </form>
    </Form>
  );
};
