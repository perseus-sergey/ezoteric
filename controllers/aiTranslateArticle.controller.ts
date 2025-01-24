'use server';

import { geminiFlashModel } from '@/ai';
import { IEditArticleTranslate } from '@/models/editArticle.model';
import { generateText } from 'ai';

export const aiTranslateArticle = async (
  titleUa: string,
  descriptionUa: string,
  keywordsUa: string,
  contentUa: string
) => {
  const { text } = await generateText({
    model: geminiFlashModel,
    system: `
    Translate the following Ukrainian content into English.
    Ensure that only the text content inside the tags and the relevant attribute values (e.g., alt, aria-label) are translated, leaving the tags and structure unchanged.
    Return the result in the specified JSON format.

    Input data:
    {
      "title-ua": "<Ukrainian title>",
      "description-ua": "<Ukrainian meta description>",
      "keywords-ua": "<Ukrainian meta keywords>",
      "content-ua": "<Ukrainian HTML content with tags>"
    }

    Translate the fields as follows:

    "title-ua" → "title-en": Provide an English translation of the title.
    "description-ua" → "description-en": Provide an English translation of the meta description.
    "keywords-ua" → "keywords-en": Translate the keywords to English, preserving their comma-separated structure.
    "content-ua" → "content-en": Translate the text content while keeping all HTML tags and formatting as is. Translate any text inside alt attributes of images.

    Return the result in this format:
    {
      "titleEn": "<English title>",
      "descriptionEn": "<English meta description>",
      "keywordsEn": "<English meta keywords>",
      "contentEn": "<English HTML content with preserved tags>"
    }
`,
    prompt: JSON.stringify({
      'title-ua': titleUa,
      'description-ua': descriptionUa,
      'keywords-ua': keywordsUa,
      'content-ua': contentUa,
    }),
  });

  const cleanResult = text.replace(/```json|```/g, '');

  return (await JSON.parse(cleanResult)) as IEditArticleTranslate;
};
