import { z } from 'zod';

export const articleFormSchema = z.object({
  tags: z.array(z.number()).default([]),

  slug: z.string().min(1, { message: 'Slug is required.' }),
  titleUa: z
    .string()
    .min(2, { message: 'Заголовок занадто короткий' })
    .max(255, { message: 'Title is too long.' })
    .trim(),
  titleEn: z
    .string()
    .min(2, { message: 'Title is too short' })
    .max(255, { message: 'Title is too long.' })
    .trim(),
  descriptionUa: z
    .string()
    .max(640, { message: 'Description is too long.' })
    .min(10, { message: 'Опис занадто короткий' })
    .trim(),
  descriptionEn: z
    .string()
    .max(640, { message: 'Description is too long.' })
    .min(10, { message: 'Description is too short' })
    .trim(),
  keywordsUa: z
    .string()
    .max(255, { message: 'Keywords are too long.' })
    .min(10, { message: 'Keywords is too short' })
    .trim(),
  keywordsEn: z
    .string()
    .max(255, { message: 'Keywords are too long.' })
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
  h1Ua: string;
  h1En: string;
}

export interface IAiTranslatedHtml {
  translatedHtml: string;
}

export interface IAiTags {
  aiTags: number[];
}

// =================================================================
// TESTS
// =================================================================

export const testFormSchema = z.object({
  slug: z.string().min(1, { message: 'Slug is required.' }),
  titleUa: z
    .string()
    .min(2, { message: 'Заголовок занадто короткий' })
    .max(255, { message: 'Title is too long.' })
    .trim(),
  titleEn: z
    .string()
    .min(2, { message: 'Title is too short' })
    .max(255, { message: 'Title is too long.' })
    .trim(),
  h1En: z
    .string()
    .min(2, { message: 'H1 is too short' })
    .max(255, { message: 'H1 is too long.' })
    .trim(),
  h1Ua: z
    .string()
    .min(2, { message: 'H1 is too short' })
    .max(255, { message: 'H1 is too long.' })
    .trim(),
  descriptionUa: z
    .string()
    .max(640, { message: 'Description is too long.' })
    .min(10, { message: 'Опис занадто короткий' })
    .trim(),
  descriptionEn: z
    .string()
    .max(640, { message: 'Description is too long.' })
    .min(10, { message: 'Description is too short' })
    .trim(),
  keywordsUa: z
    .string()
    .max(255, { message: 'Keywords are too long.' })
    .min(10, { message: 'Keywords is too short' })
    .trim(),
  keywordsEn: z
    .string()
    .max(255, { message: 'Keywords are too long.' })
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

  questions: z
    .array(
      z.object({
        titleUa: z.string().min(1, "Питання є обов'язковим"),
        titleEn: z.string().min(1, 'Question is required'),
        answers: z
          .array(
            z.object({
              textUa: z.string().min(1, "Відповідь є обов'язковою"),
              textEn: z.string().min(1, 'Answer is required'),
              rating: z.coerce
                .number()
                .min(0)
                .max(1000, 'Рейтинг від 0 до 1000'),
            })
          )
          .min(2, { message: 'Повинна бути хоча б одна відповідь' }),
      })
    )
    .min(1, 'Повинно бути хоча б одне запитання'),

  conclusions: z
    .array(
      z
        .object({
          minRank: z.coerce
            .number()
            .min(0, 'Мінімальний рейтинг має бути 0 або більше')
            .int(),
          maxRank: z.coerce.number().int(),
          descriptionUa: z
            .string()
            .min(10, { message: 'Опис занадто короткий' }),
          descriptionEn: z
            .string()
            .min(10, { message: 'Description is too short' }),
        })
        .refine((data) => data.minRank <= data.maxRank, {
          message:
            'Максимальний рейтинг має бути більшим або рівним мінімальному',
          path: ['maxRank'], //вказуємо на поле з помилкою
        })
    )
    .min(1, { message: 'Повинен бути хоча б один висновок' }),

  categoryId: z
    .number()
    .min(1, { message: 'Тест повинен відноситись до однієї з категорій' }),
});

export type TTestFormValues = z.infer<typeof testFormSchema>;
