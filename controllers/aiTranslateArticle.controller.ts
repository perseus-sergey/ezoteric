'use server';

import { geminiFlashModel } from '@/ai';
import { TTag } from '@/db/schema';
import {
  IAiTags,
  IAiTranslatedHtml,
  IGenerateArticleMeta,
} from '@/models/editArticle.model';
import { generateText } from 'ai';

export const aiTranslateArticle = async (contentUa: string) => {
  try {
    const { text } = await generateText({
      model: geminiFlashModel,
      system: `
      Translate the following Ukrainian content into English.
      Ensure that only the text content inside the tags and the relevant attribute values (e.g., alt, aria-label) are translated, leaving the tags and structure unchanged.
      Return the result in the specified JSON format.
  
      Input data: "<Ukrainian HTML content with tags>
  
      Translate the text content while keeping all HTML tags and formatting as is. Translate any text inside alt attributes of images.

      🔹 **Output data format (JSON, no explanations)**:
        {
          "translatedHtml": "<English HTML content with preserved tags>"
        }

        Respond **only in JSON format**, without explanations or comments.
      `,
      prompt: contentUa,
    });

    const cleanResult = text.replace(/```json|```/g, '');

    return (await JSON.parse(cleanResult)) as IAiTranslatedHtml;
  } catch (error) {
    throw new Error(`AI Translation Error: ${error}`);
  }
};

export const aiGenerateMeta = async (titleUa: string, contentUa: string) => {
  try {
    const { text } = await generateText({
      model: geminiFlashModel,
      system: `
        You are an SEO expert and content marketing specialist.
        Your task is to generate high-quality SEO-optimized meta data for search engines (Google, Bing, etc.).

        🔹 **What to do?**
        - Generate an **SEO title** in English (titleEn) based on "title-ua".  
          🔸 It should be **relevant**, **optimized for search queries**  
          🔸 It can be **slightly modified for better SEO**  
        - Create a **short and attractive meta description** in Ukrainian (descriptionUa)  
          🔸 It should **clearly convey the essence of the article** and **motivate clicks**  
        - Generate **relevant keywords** in Ukrainian (keywordsUa)  
          🔸 Use **popular search queries** that match the article's topic  
        - Do the same for English (descriptionEn, keywordsEn)  
          🔸 English meta data should match SEO trends and be attractive for clicks  

        🔹 **Input data format (JSON)**:
        {
          "title-ua": "<Ukrainian title>",
          "content-ua": "<Ukrainian HTML content with tags>"
        }

        🔹 **Output data format (JSON, no explanations)**:
        {
          "titleEn": "<English SEO title>",
          "descriptionUa": "<SEO description in Ukrainian>",
          "keywordsUa": "<SEO keywords in Ukrainian>",
          "descriptionEn": "<SEO description in English>",
          "keywordsEn": "<SEO keywords in English>"
        }

        Respond **only in JSON format**, without explanations or comments.
      `,
      prompt: JSON.stringify({
        'title-ua': titleUa,
        'content-ua': contentUa,
      }),
    });

    const cleanResult = text.replace(/```json|```/g, '');

    return (await JSON.parse(cleanResult)) as IGenerateArticleMeta;
  } catch (error) {
    throw new Error(`AI Meta Generation Error: ${error}`);
  }
};

export const aiAddTags = async (tags: TTag[], contentEn: string) => {
  const system = `
  You are an AI assistant specialized in content categorization.
Your task is to analyze the provided article and select the most relevant tags from a predefined list.

**Tag List:**  
${tags.map((tag) => `${tag.id} - ${tag.nameEn}`).join('\n')}

### Input:  
- An article text.

### Output Format:
Your response must strictly follow this JSON format:
{ "aiTags": [<number[]>] }
Where '<number[]>' is an array of relevant tag IDs from the list.

### Tag Selection Criteria:
- Select only those tags that closely match the article's main topics.
- Do not include unrelated tags.
- If no tag is relevant, return an empty array: '{ "aiTags": [] }'.
- The total number of selected tags should not exceed **5**.
- Prioritize more specific tags over general ones.
- 🚫 **Do NOT select tags that were used in the example responses.**

### Example:
#### **Example Tag List:**
1 - artificial intelligence
2 - cloud computing
3 - cybersecurity
4 - blockchain
5 - machine learning
6 - quantum computing
7 - data privacy
8 - IoT

#### **Input Article:**
*"Cloud computing has revolutionized how businesses store and process data. However, concerns around cybersecurity and data privacy remain a challenge for many companies."*

#### **Expected Output:**
{ "aiTags": [2, 3, 7] } 
`;
  try {
    const { text } = await generateText({
      model: geminiFlashModel,
      system,
      prompt: contentEn,
    });

    // console.log("AI Response:", text);

    const cleanResult = text.replace(/```json|```/g, ''); // Видаляємо можливі JSON-блоки
    const parsedResult = JSON.parse(cleanResult); // Пробуємо парсити JSON

    // 🛠 Перевіряємо, чи є `aiTags` масивом чисел
    if (
      parsedResult &&
      typeof parsedResult === 'object' &&
      Array.isArray(parsedResult.aiTags) &&
      // eslint-disable-next-line
      parsedResult.aiTags.every((tag: any) => typeof tag === 'number')
    ) {
      return parsedResult as IAiTags;
    } else {
      throw new Error(
        `Invalid AI response format: ${JSON.stringify(parsedResult)}`
      );
    }
  } catch (error) {
    console.log('🚀 ~ aiAddTags ~ error:', error);
    throw new Error(`AI tags choosing Error: ${error}`);
  }
};
