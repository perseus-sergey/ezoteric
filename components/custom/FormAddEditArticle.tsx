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
import { Checkbox } from '../ui/checkbox';
import { useCallback, useEffect, useState } from 'react';
import { Lock, LockOpen, RefreshCcw } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import {
  articleFormSchema,
  newArticleDefaultValues,
  TArticleFormValues,
} from '@/models/editArticle.model';
import {
  aiAddTags,
  aiGenerateMeta,
  aiTranslateArticle,
} from '@/ai/aiTranslateArticle.controller';
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
import { CodeTemplatesForImage } from './CodeTemplatesForImage';

const dirtyValidate = {
  shouldDirty: true,
  shouldValidate: true,
};

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
  const [isMetaGenerating, setIsMetaGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();

  const form = useForm<TArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: article
      ? {
          ...article,
          tags: article.articleTags.map((tagObj) => tagObj.tag.id) ?? [],
          imageSrc: article.imageSrc ?? undefined,
          h1En: article.h1En ?? undefined,
          h1Ua: article.h1Ua ?? undefined,
        }
      : newArticleDefaultValues,
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState,
    setFocus,
  } = form;

  const titleEnValue = watch('titleEn'); // Відстежуємо значення titleEn

  const slugRefreshHandler = useCallback(
    () =>
      setValue('slug', makeSlug(titleEnValue), {
        shouldDirty: true,
        shouldValidate: true,
      }),
    [form, titleEnValue]
  );

  // Оновлюємо slug при зміні titleEn only for new articles
  useEffect(() => {
    if (article) return;

    slugRefreshHandler();
  }, [titleEnValue, form, article, slugRefreshHandler]);

  const slugDisableToggle = () => setSlugDisabled((prevState) => !prevState);

  const handleTranslate = async () => {
    const { textUa } = getValues();

    if (textUa.length < 100) {
      toast.error('Будь ласка, заповніть поле "Text (UA)" перед перекладом.');

      setFocus('textUa');
      return;
    }

    setIsTranslating(true);

    try {
      const aiResponse = await aiTranslateArticle(textUa);

      setValue('textEn', aiResponse.translatedHtml, {
        shouldDirty: true,
        shouldValidate: true,
      });

      toast.success('Статтю успішно перекладено.');
    } catch (error) {
      toast.error(`Помилка перекладу: ${error}`);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleMetaGenerate = async () => {
    const { textUa, titleUa } = getValues();

    // Remove all html-tags
    const rowText = textUa.replace(/<[^>]*>/g, '');

    if (rowText.length < 100) {
      toast.error(
        `ТЕКСТ занадто короткий. ${rowText.length} символів. (< 100)`,
        {
          description:
            'Будь ласка, Спершу відредагуйте поле "Text (UA)" перед генеруванням мета даних.',
        }
      );
      setFocus('textUa');
      return;
    }

    if (titleUa.length < 3) {
      toast.error(
        `Title (UA) занадто короткий. ${titleUa.length} символів. (< 3)`,
        {
          description:
            'Будь ласка, Спершу відредагуйте поле "Title (UA)" перед генеруванням мета даних.',
        }
      );
      setFocus('titleUa');
      return;
    }

    setIsMetaGenerating(true);

    try {
      const generatedMeta = await aiGenerateMeta(titleUa, rowText);

      // Update the form fields with the translated values
      setValue('descriptionUa', generatedMeta.descriptionUa, dirtyValidate);
      setValue('keywordsUa', generatedMeta.keywordsUa, dirtyValidate);
      setValue('titleEn', generatedMeta.titleEn, dirtyValidate);
      setValue('descriptionEn', generatedMeta.descriptionEn, dirtyValidate);
      setValue('keywordsEn', generatedMeta.keywordsEn, dirtyValidate);
      setValue('h1Ua', generatedMeta.h1Ua, dirtyValidate);
      setValue('h1En', generatedMeta.h1En, dirtyValidate);

      toast.success('Successfully generated meta data.');
    } catch (error) {
      toast.error(`Error AI meta generating: ${error}`);
    } finally {
      setIsMetaGenerating(false);
    }
  };

  const handleAiTags = async () => {
    const formTextEn = getValues('textEn');

    if (formTextEn.length < 100) {
      toast.error(
        `Англійський ТЕКСТ занадто короткий. ${formTextEn.length} символів. (< 100)`,
        {
          description:
            'Будь ласка, Спершу відредагуйте поле "Text (EN)" перед підбором тегів.',
        }
      );
      setFocus('textEn');
      return;
    }

    setIsTranslating(true);

    try {
      const { aiTags } = await aiAddTags(availableTags, formTextEn);

      if (aiTags.length === 0) {
        toast('AI не вдалося підібрати жодного тегу до цієі статті.');
      } else {
        toast.success(`AI вдало підібрав ${aiTags.length} тегів до статті.`);
        setValue('tags', aiTags, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
    } catch (error) {
      toast.error('Error selecting AI tags:', {
        description: `${error}`,
      });
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
      toast.error(`${error}`);
    } finally {
      setIsSaving(false);
    }

    if (!article) router.push(`/${DEFAULT_LANG}/${ESegment.BLOG}`);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 bg-tertiary p-6 rounded-md"
      >
        {/* Title UA */}
        <FormField
          control={control}
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

        <CodeTemplatesForImage />

        {/* TinyMCE Editor for textUa */}
        <Controller
          name="textUa"
          control={control}
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
            <LoadingAnimated className="size-5" />
          ) : (
            <GenerateAI className="size-5" />
          )}{' '}
          Перекласти
        </Button>

        {/* TinyMCE Editor for textEn */}
        <Controller
          name="textEn"
          control={control}
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

        <Fieldset legendText="Meta Data" className="p-2 space-y-4">
          {/* Generate Meta Data */}
          <Button
            type="button"
            onClick={handleMetaGenerate}
            disabled={isTranslating || isMetaGenerating}
          >
            {isMetaGenerating ? (
              <LoadingAnimated className="size-5" />
            ) : (
              <GenerateAI className="size-5" />
            )}{' '}
            Генерувати Мета Дані
          </Button>

          {/* Title EN */}
          <FormField
            control={control}
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

          {/* H1 UA */}
          <FormField
            control={control}
            name="h1Ua"
            render={({ field }) => (
              <FormItem>
                <FormLabel>H1 (UA)</FormLabel>
                <FormControl>
                  <Input placeholder="Головна Назва для тегу H1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* H1 EN */}
          <FormField
            control={control}
            name="h1En"
            render={({ field }) => (
              <FormItem>
                <FormLabel>H1 (EN)</FormLabel>
                <FormControl>
                  <Input placeholder="H1 in English" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description UA */}
          <FormField
            control={control}
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
            control={control}
            name="keywordsUa"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Keywords (UA)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ключові слова українською"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description EN */}
          <FormField
            control={control}
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
            control={control}
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
        </Fieldset>

        {/* Tags */}
        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <Fieldset legendText="Tags" className="p-2 space-y-4">
              {field.value?.length > 0 && (
                <FormItem>
                  <FormLabel>Attached Tags</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {field.value.map((tagId) => {
                      const tag = availableTags.find((t) => t.id === tagId);
                      return (
                        <Badge key={tagId} variant="outline">
                          {tag?.nameEn}
                          <button
                            onClick={() => {
                              // Видаляємо тег з масиву
                              field.onChange(
                                field.value.filter((id) => id !== tagId)
                              );
                            }}
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
                    .filter((tag) => !field.value.includes(tag.id))
                    .map((tag) => (
                      <Button
                        key={tag.id}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Додаємо тег до масиву
                          field.onChange([...field.value, tag.id]);
                        }}
                      >
                        {tag.nameEn}
                      </Button>
                    ))}
                </div>
              </FormItem>

              <Button
                type="button"
                onClick={handleAiTags}
                disabled={isTranslating}
              >
                {isTranslating ? (
                  <LoadingAnimated className="size-5" />
                ) : (
                  <GenerateAI className="size-5" />
                )}{' '}
                Підібрати Автоматично
              </Button>
            </Fieldset>
          )}
        />

        {/* Slug */}
        <FormField
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
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
          disabled={isSaving || !formState.isDirty}
          className={clsx(isSaving && 'cursor-progress')}
        >
          {isSaving && <LoadingAnimated className="size-5" />} Зберегти
        </Button>
      </form>
    </Form>
  );
};
