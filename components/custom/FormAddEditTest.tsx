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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { useCallback, useEffect, useState } from 'react';
import {
  Check,
  ChevronsUpDown,
  Lock,
  LockOpen,
  RefreshCcw,
  SaveAll,
} from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import {
  IGenerateArticleMeta,
  TTestFormValues,
  testFormSchema,
} from '@/models/editArticle.model';
import {
  aiGenerateMeta,
  aiTranslateArticle,
} from '@/controllers/aiTranslateArticle.controller';
import { toast } from 'sonner';
import { LoadingAnimated } from '@/svg/LoadingAnimated';
import { clsx } from 'clsx';
import { makeSlug } from '@/controllers/articleEdit.controller';
import { GenerateAI } from '@/svg/GenerateAI';
import { TestWithRelations, TTestCategory } from '@/db/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import Fieldset from './Fieldset';
import { useRouter } from 'next/navigation';
import { DEFAULT_LANG } from '@/models/language.model';
import { ESegment } from '@/models/url.model';
import { insertNewTest, updateTest } from '@/db/queriesTestEdit';
import { cn } from '@/lib/utils/utils';
import { ConclusionsBlock, QuestionsBlock } from './DndElements';
import { TinyEditor } from './TinyEditor';

const dirtyValidate = {
  shouldDirty: true,
  shouldValidate: true,
};

export const testDefaultValues = {
  slug: '',
  titleUa: '',
  titleEn: '',
  h1Ua: '',
  h1En: '',
  descriptionUa: '',
  descriptionEn: '',
  textUa: '',
  textEn: '',
  keywordsUa: '',
  keywordsEn: '',
  published: true,
  imageSrc: '',
  spotifyId: null,
  categoryId: 0, // Set a default category ID or make it dynamic based on your needs
  questions: [
    {
      titleUa: '',
      titleEn: '',
      answers: [
        { textUa: '', textEn: '', rating: 0 },
        { textUa: '', textEn: '', rating: 0 }, // Add at least two default answers
      ],
    },
  ],
  conclusions: [
    {
      minRank: 0,
      maxRank: 10,
      descriptionUa: '',
      descriptionEn: '',
    },
  ],
};

export default function FormAddEditTest({
  availableCategories,
  editorApiKey,
  test,
}: {
  availableCategories: TTestCategory[];
  editorApiKey: string;
  test?: TestWithRelations;
}) {
  const [slugDisabled, setSlugDisabled] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isMetaGenerating, setIsMetaGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [jsonQuestions, setJsonQuestions] = useState('');
  const [jsonConclusions, setJsonConclusions] = useState('');

  const router = useRouter();

  const form = useForm<TTestFormValues>({
    resolver: zodResolver(testFormSchema),
    defaultValues: test
      ? {
          ...test,
          imageSrc: test.imageSrc ?? undefined,
        }
      : testDefaultValues,
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

  const questions = watch('questions');
  useEffect(() => {
    setJsonQuestions(JSON.stringify(questions, null, 2));
  }, [JSON.stringify(questions)]);

  const handleJsonQuestionsChange = (value: string) => {
    setJsonQuestions(value);
  };

  const generateQuestionsFromJson = () => {
    try {
      const parsedQuestions = JSON.parse(jsonQuestions);

      // Validate parsed data against a simplified schema:
      testFormSchema.shape.questions.parse(parsedQuestions);

      setValue('questions', parsedQuestions, dirtyValidate);

      toast.success('Questions successfully generated');
    } catch (error) {
      toast.error(`Invalid JSON format: ${error}`);
    }
  };

  const conclusions = watch('conclusions');
  useEffect(() => {
    setJsonConclusions(JSON.stringify(conclusions, null, 2));
  }, [JSON.stringify(conclusions)]);

  const handleJsonConclusionsChange = (value: string) => {
    setJsonConclusions(value);
  };

  const generateConclusionsFromJson = () => {
    try {
      const parsedConclusions = JSON.parse(jsonConclusions);

      // Validate parsed data against a simplified schema:
      testFormSchema.shape.conclusions.parse(parsedConclusions);

      setValue('conclusions', parsedConclusions, dirtyValidate);

      toast.success('Conclusions successfully generated');
    } catch (error) {
      toast.error(`Invalid JSON format: ${error}`);
    }
  };

  const titleEnValue = watch('titleEn'); // Відстежуємо значення titleEn

  const slugRefreshHandler = useCallback(
    () => setValue('slug', makeSlug(titleEnValue), dirtyValidate),
    [form, titleEnValue]
  );

  // Оновлюємо slug при зміні titleEn only for new articles
  useEffect(() => {
    if (test) return;

    slugRefreshHandler();
  }, [titleEnValue, form, test, slugRefreshHandler]);

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

      setValue('textEn', aiResponse.translatedHtml, dirtyValidate);

      toast.success('Текст успішно перекладено.');
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
      const generatedMeta: IGenerateArticleMeta = await aiGenerateMeta(
        titleUa,
        rowText
      );

      // Update the form fields with the generated values
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

  const onSubmit = async (values: TTestFormValues) => {
    setIsSaving(true);

    try {
      const createRes =
        test === undefined
          ? await insertNewTest(values)
          : await updateTest(values, test.id);

      toast.success(`Test ${test ? 'updated' : 'created'} successfully`, {
        description: `at ${createRes.updatedAt.toLocaleString()}`,
      });
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setIsSaving(false);
    }

    if (!test) router.push(`/${DEFAULT_LANG}/${ESegment.TESTS}`);
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
          Перекласти
        </Button>

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

        <Fieldset legendText="Meta Data" className="p-2 space-y-4">
          {/* Generate Meta Data */}
          <Button
            type="button"
            onClick={handleMetaGenerate}
            disabled={isTranslating || isMetaGenerating}
          >
            {isMetaGenerating ? (
              <LoadingAnimated />
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
                        placeholder="test-slug"
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
                  {`Унікальний ідентифікатор статті. Складається автоматично із поля "Title (EN)" на етапі додавання статті.`}
                  <br />⚠ Не бажано змінювати вручну.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </Fieldset>

        {/* Questions */}
        <Fieldset legendText="Questions" className="p-2 space-y-4">
          {/* JSON Output */}
          <FormItem>
            <FormLabel>JSON Questions Representation</FormLabel>
            <FormControl>
              <Textarea
                value={jsonQuestions}
                onChange={(e) => handleJsonQuestionsChange(e.target.value)}
                rows={10}
                placeholder="Enter questions in JSON format"
              />
            </FormControl>
            <FormDescription>
              This field displays the current structure of the questions and
              answers in JSON format.
            </FormDescription>
          </FormItem>

          <Button type="button" onClick={generateQuestionsFromJson}>
            Generate from JSON
          </Button>

          <QuestionsBlock control={control} />
        </Fieldset>

        {/* Conclusions */}
        <Fieldset legendText="Conclusions" className="p-2 space-y-4">
          {/* JSON Output */}
          <FormItem>
            <FormLabel>JSON Conclusion Representation</FormLabel>
            <FormControl>
              <Textarea
                value={jsonConclusions}
                onChange={(e) => handleJsonConclusionsChange(e.target.value)}
                rows={10}
                placeholder="Enter Conclusions in JSON format"
              />
            </FormControl>
            <FormDescription>
              This field displays the current structure of the Conclusions in
              JSON format.
            </FormDescription>
          </FormItem>

          <Button type="button" onClick={generateConclusionsFromJson}>
            Generate from JSON
          </Button>

          <ConclusionsBlock control={control} />
        </Fieldset>

        {/* Categories */}
        <FormField
          control={control}
          name="categoryId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Category</FormLabel>
              <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={categoryOpen}
                    className={cn(
                      'w-72 justify-between',
                      !field.value && 'text-muted-foreground'
                    )}
                  >
                    {field.value
                      ? availableCategories.find(
                          (cat) => cat.id === field.value
                        )?.nameUa
                      : 'Select category...'}
                    <ChevronsUpDown className="opacity-50 size-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search categories..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No categories found.</CommandEmpty>
                      <CommandGroup>
                        {availableCategories.map((cat) => (
                          <CommandItem
                            key={cat.id}
                            value={cat.id.toString()}
                            onSelect={() => {
                              setValue('categoryId', cat.id, dirtyValidate);
                              setCategoryOpen(false);
                            }}
                          >
                            {cat.nameUa}
                            <Check
                              className={cn(
                                'ml-auto',
                                field.value === cat.id
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Категорія, в якій буде знаходитись даний тест.
              </FormDescription>
              <FormMessage className="w-fit" />
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
                <FormLabel>Is Test published</FormLabel>
                <FormDescription>
                  If you uncheck it, the test will not be displayed on the site.
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
          {isSaving ? <LoadingAnimated /> : <SaveAll className="opacity-50" />}{' '}
          Save Test
        </Button>
      </form>
    </Form>
  );
}
