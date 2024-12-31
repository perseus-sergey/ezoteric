import { z } from 'zod';

export const articleFormSchema = z.object({
  slug: z.string().min(1, { message: 'Slug is required.' }),
  titleUa: z
    .string()
    .min(2, { message: 'Заголовок занадто короткий' })
    .max(255, { message: 'Title (UA) is too long.' }),
  titleEn: z
    .string()
    .min(2, { message: 'Title is too short' })
    .max(255, { message: 'Title (EN) is too long.' }),
  descriptionUa: z
    .string()
    .max(640, { message: 'Description (UA) is too long.' })
    .min(10, { message: 'Опис занадто короткий' }),
  descriptionEn: z
    .string()
    .max(640, { message: 'Description (EN) is too long.' })
    .min(10, { message: 'Description is too short' }),
  keywordsUa: z
    .string()
    .max(255, { message: 'Keywords (UA) are too long.' })
    .min(10, { message: 'Keywords is too short' }),
  keywordsEn: z
    .string()
    .max(255, { message: 'Keywords (EN) are too long.' })
    .min(10, { message: 'Keywords is too short' }),
  textUa: z.string().min(20, { message: 'Текст занадто короткий' }),
  textEn: z.string().min(20, { message: 'Text is too short' }),
  imageName: z.string().optional(),
});

export type TArticleFormValues = z.infer<typeof articleFormSchema>;
