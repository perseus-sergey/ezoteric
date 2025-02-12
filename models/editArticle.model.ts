import { z } from 'zod';

export const articleFormSchema = z.object({
  tags: z.array(z.number()).default([]),

  slug: z.string().min(1, { message: 'Slug is required.' }),
  titleUa: z
    .string()
    .min(2, { message: 'Заголовок занадто короткий' })
    .max(255, { message: 'Title (UA) is too long.' })
    .trim(),
  titleEn: z
    .string()
    .min(2, { message: 'Title is too short' })
    .max(255, { message: 'Title (EN) is too long.' })
    .trim(),
  descriptionUa: z
    .string()
    .max(640, { message: 'Description (UA) is too long.' })
    .min(10, { message: 'Опис занадто короткий' })
    .trim(),
  descriptionEn: z
    .string()
    .max(640, { message: 'Description (EN) is too long.' })
    .min(10, { message: 'Description is too short' })
    .trim(),
  keywordsUa: z
    .string()
    .max(255, { message: 'Keywords (UA) are too long.' })
    .min(10, { message: 'Keywords is too short' })
    .trim(),
  keywordsEn: z
    .string()
    .max(255, { message: 'Keywords (EN) are too long.' })
    .min(10, { message: 'Keywords is too short' })
    .trim(),
  textUa: z.string().min(20, { message: 'Текст занадто короткий' }).trim(),
  textEn: z.string().min(20, { message: 'Text is too short' }).trim(),

  published: z.boolean().default(true),

  imageSrc: z
    .string()
    .transform((val) => val.trim())
    .refine(
      (val) => {
        // Якщо значення не порожнє, перевіряємо, чи починається з 'https://'
        return val === '' || val.startsWith('https://');
      },
      {
        message: 'Image Source must start with "https://" if provided',
      }
    ),

  spotifyId: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => {
        // Якщо значення не порожнє або null, перевіряємо його формат
        return !val || /^[a-zA-Z0-9]{22}$/.test(val); // ID має бути 22 символи
      },
      {
        message: 'Spotify ID must be a valid 22-character string',
      }
    ),
});

export const newArticleDefaultValues = {
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
  published: false,
  tags: [],
};

export type TArticleFormValues = z.infer<typeof articleFormSchema>;

export interface IGenerateArticleMeta {
  titleEn: string;
  descriptionEn: string;
  keywordsEn: string;
  descriptionUa: string;
  keywordsUa: string;
}

export interface IAiTranslatedHtml {
  translatedHtml: string;
}

export interface IAiTags {
  aiTags: number[];
}
