'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { insertNewArticle } from '@/db/queriesArticle';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { FormAddEditArticle } from './FormAddEditArticle';
import { useForm } from 'react-hook-form';
import {
  articleFormSchema,
  TArticleFormValues,
} from '@/models/editArticle.model';
import { makeSlug } from '@/controllers/articleEdit.controller';

export const FormAddArticle = ({ editorApiKey }: { editorApiKey: string }) => {
  const [isSaving, setIsSaving] = useState(false);

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
      imageSrc: '',
      published: true,
    },
  });

  // Відстежуємо значення titleEn
  const titleEnValue = form.watch('titleEn');

  // Оновлюємо slug при зміні titleEn
  useEffect(() => {
    const slug = makeSlug(titleEnValue);

    form.setValue('slug', slug, { shouldValidate: true });
  }, [titleEnValue, form]);

  const onSubmit = async (values: TArticleFormValues) => {
    setIsSaving(true);

    const createRes = await insertNewArticle(values);

    if (createRes instanceof Error) {
      toast.error(createRes.message);
    } else {
      toast.success(`Article successfully created`);
    }
    setIsSaving(false);
    // router.push('/admin/articles');
  };

  return (
    <FormAddEditArticle
      form={form}
      onSubmit={onSubmit}
      editorApiKey={editorApiKey}
      isSaving={isSaving}
    />
  );
};
