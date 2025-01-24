'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { updateArticle } from '@/db/queriesArticle';
import { TArticle } from '@/db/schema';
import { toast } from 'sonner';
import { FormAddEditArticle } from './FormAddEditArticle';
import { useState } from 'react';
import {
  articleFormSchema,
  TArticleFormValues,
} from '@/models/editArticle.model';

export const FormEditArticle = ({
  article,
  editorApiKey,
}: {
  article: TArticle;
  editorApiKey: string;
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const form = useForm<TArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      ...article,
      imageSrc: article.imageSrc ?? undefined,
    },
  });

  const onSubmit = async (values: TArticleFormValues) => {
    setIsSaving(true);

    const updateRes = await updateArticle(values, article.id);

    if (updateRes instanceof Error) {
      toast.error(updateRes.message);
    } else {
      toast.success(`Article updated successfully`);
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
