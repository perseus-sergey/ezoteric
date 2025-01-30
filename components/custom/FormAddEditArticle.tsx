'use client';

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
import { useCallback, useEffect, useState } from 'react';
import { Lock, LockOpen, RefreshCcw } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import {
  articleFormSchema,
  IEditArticleTranslate,
  newArticleDefaultValues,
  TArticleFormValues,
} from '@/models/editArticle.model';
import { aiTranslateArticle } from '@/controllers/aiTranslateArticle.controller';
import { toast } from 'sonner';
import { LoadingAnimated } from '@/svg/LoadingAnimated';
import { clsx } from 'clsx';
import { makeSlug } from '@/controllers/articleEdit.controller';
import { GenerateAI } from '@/svg/GenerateAI';
import { Badge } from '../ui/badge';
import { TTag } from '@/db/schema';
import { CloseCancelSmall } from '@/svg/CloseCancelSmall';
import {
  insertNewArticle,
  TArticleWithTagsUpdated,
  updateArticle,
} from '@/db/queriesArticle';
import { zodResolver } from '@hookform/resolvers/zod';
import Fieldset from './Fieldset';
import { Separator } from '../ui/separator';
import { useRouter } from 'next/navigation';
import { DEFAULT_LANG } from '@/models/language.model';
import { ESegment } from '@/models/url.model';

export const FormAddEditArticle = ({
  availableTags,
  editorApiKey,
  article,
}: {
  availableTags: TTag[];
  editorApiKey: string;
  article?: TArticleWithTagsUpdated;
}) => {
  const [slugDisabled, setSlugDisabled] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();

  const form = useForm<TArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: article
      ? {
          ...article,
          tags: article.articleTags.map((tagObj) => tagObj.tag.id) ?? [],
          imageSrc: article.imageSrc ?? undefined,
        }
      : newArticleDefaultValues,
  });

  const selectedTags = form.watch('tags'); // Стежимо за вибраними тегами

  const titleEnValue = form.watch('titleEn'); // Відстежуємо значення titleEn

  const slugRefreshHandler = useCallback(
    () =>
      form.setValue('slug', makeSlug(titleEnValue), { shouldValidate: true }),
    [form, titleEnValue]
  );

  // Оновлюємо slug при зміні titleEn only for new articles
  useEffect(() => {
    if (article) return;

    slugRefreshHandler();
  }, [titleEnValue, form, article, slugRefreshHandler]);

  const addTag = (tagId: number) => {
    form.setValue('tags', [...selectedTags, tagId]); // Додаємо тег
  };

  const removeTag = (tagId: number) => {
    form.setValue(
      'tags',
      selectedTags.filter((id) => id !== tagId)
    ); // Видаляємо тег
  };

  const slugDisableToggle = () => setSlugDisabled((prevState) => !prevState);

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

  const onSubmit = async (values: TArticleFormValues) => {
    setIsSaving(true);

    try {
      const createRes =
        article === undefined
          ? await insertNewArticle(values)
          : await updateArticle(values, article.id);

      toast.success(`Article ${article ? 'updated' : 'created'} successfully`, {
        description: `at ${createRes.updatedAt.toLocaleString()}`,
      });
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsSaving(false);
    }

    router.push(`${DEFAULT_LANG}/${ESegment.BLOG}`);
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
          {isTranslating ? (
            <LoadingAnimated />
          ) : (
            <GenerateAI className="size-5" />
          )}{' '}
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

        {/* Tags */}
        <Fieldset legendText="Tags" className="p-2 space-y-4">
          {selectedTags.length > 0 && (
            <FormItem>
              <FormLabel>Attached Tags</FormLabel>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tagId) => {
                  const tag = availableTags.find((t) => t.id === tagId);
                  return (
                    <Badge key={tagId} variant="outline">
                      {tag?.nameEn}
                      <button
                        onClick={() => removeTag(tagId)}
                        className="ml-2 opacity-50 hover:opacity-30"
                      >
                        <CloseCancelSmall />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            </FormItem>
          )}

          <Separator />

          {/* Available Tags */}
          <FormItem>
            <FormLabel>Available Tags</FormLabel>
            <div className="flex flex-wrap gap-2">
              {availableTags
                .filter((tag) => !selectedTags.includes(tag.id))
                .map((tag) => (
                  <Button
                    key={tag.id}
                    variant="outline"
                    size="sm"
                    onClick={() => addTag(tag.id)}
                  >
                    {tag.nameEn}
                  </Button>
                ))}
            </div>
          </FormItem>
        </Fieldset>

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
