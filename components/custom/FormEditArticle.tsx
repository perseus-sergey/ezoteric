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
import { updateArticle } from '@/db/queriesArticle';
import { TArticle } from '@/db/schema';
import { toast } from 'sonner';
import { TinyEditor } from './TinyEditor';

export const FormEditArticle = ({
  article,
  editorApiKey,
}: {
  article: TArticle;
  editorApiKey: string;
}) => {
  const form = useForm<TArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      ...article,
      imageName: article.imageName ?? undefined,
    },
  });

  const onSubmit = async (values: TArticleFormValues) => {
    const updatedArticle = {
      ...values,
      updatedAt: new Date(),
    };

    // console.log('🚀 ~ onSubmit ~ updatedArticle:', updatedArticle);

    const updateRes = await updateArticle(updatedArticle, article.id);
    // const updateRes = updatedArticle.updatedAt;

    if (updateRes instanceof Error) {
      toast.error(updateRes.message);
    } else {
      toast.success(
        `Article updated successfully at ${updatedArticle.updatedAt.toLocaleDateString()}`
      );
      // router.refresh();
    }

    // router.push('/admin/articles');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Text (UA)</FormLabel>
              <TinyEditor
                onEditorChange={field.onChange}
                id="textUa"
                editorApiKey={editorApiKey}
                value={field.value}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* TinyMCE Editor for textEn */}
        <Controller
          name="textEn"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Text (EN)</FormLabel>
              <TinyEditor
                onEditorChange={field.onChange}
                id="textEn"
                editorApiKey={editorApiKey}
                value={field.value}
                // editorRef={editorEnRef}
              />
              <FormMessage />
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
                <Textarea placeholder="imageName.jpg" {...field} />
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

        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
};
