'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
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
import {
  articleFormSchema,
  TArticleFormValues,
} from '@/lib/schemas/articleFormSchema';
import { insertNewArticle } from '@/db/queriesArticle';
import { toast } from 'sonner';
import { TinyEditor } from './TinyEditor';
import { useEffect } from 'react';

export const FormAddArticle = ({ editorApiKey }: { editorApiKey: string }) => {
  const form = useForm<TArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      slug: '',
      titleUa: '',
      titleEn: '',
      descriptionUa: '',
      descriptionEn: '',
      keywordsUa: '',
      keywordsEn: '',
      textUa: '',
      textEn: '',
      imageName: '',
    },
  });

  // Відстежуємо значення titleEn
  const titleEnValue = form.watch('titleEn');

  // Генерація slug
  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Замінюємо всі небажані символи на "-"
      .replace(/^-+|-+$/g, ''); // Видаляємо зайві дефіси на початку та в кінці

  // Оновлюємо slug при зміні titleEn
  useEffect(() => {
    const slug = generateSlug(titleEnValue);
    form.setValue('slug', slug, { shouldValidate: true });
  }, [titleEnValue, form]);

  const onSubmit = async (values: TArticleFormValues) => {
    const createdArticle = {
      ...values,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // console.log('🚀 ~ onSubmit ~ createdArticle:', createdArticle);

    const createRes = await insertNewArticle(createdArticle);
    // const createRes = createdArticle.updatedAt;

    if (createRes instanceof Error) {
      toast.error(createRes.message);
    } else {
      toast.success(
        `Article successfully created at ${createdArticle.updatedAt.toLocaleDateString()}`
      );
      // router.refresh();
    }

    // router.push('/admin/articles');
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 bg-tertiary p-6 rounded-md"
      >
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

        {/* Slug */}
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="article-slug" {...field} />
              </FormControl>
              <FormDescription>
                Унікальний ідентифікатор статті.
              </FormDescription>
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

        {/* Image Name */}
        <FormField
          control={form.control}
          name="imageName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image Name</FormLabel>
              <FormControl>
                <Input placeholder="imageName.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
};
