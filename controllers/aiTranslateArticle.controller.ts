'use server';

import { geminiFlashModel, geminiFlashThinking } from '@/ai';
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
    Your task is to generate high-quality SEO-optimized meta data and H1 headings for search engines (Google, Bing, etc.).

    🔹 **What to do?**
    - Generate an **SEO title** in English (titleEn) based on "title-ua".
      🔸 It should be **relevant**, **optimized for search queries**
      🔸 It can be **slightly modified for better SEO**
    - Generate an **H1 heading** in English (h1En) based on "titleEn".
      🔸 It should be **compelling and engaging** for readers.
      🔸 It should be **consistent with titleEn** but can be slightly different for better user experience.
    - Create a **short and attractive meta description** in Ukrainian (descriptionUa)
      🔸 It should **clearly convey the essence of the content** and **motivate clicks**
    - Generate **relevant keywords** in Ukrainian (keywordsUa)
      🔸 Use **popular search queries** that match the content's topic
    - Generate an **SEO title** in Ukrainian (titleUa).
      🔸 It should be **relevant**, **optimized for search queries**
      🔸 It can be **slightly modified for better SEO**
    - Generate an **H1 heading** in Ukrainian (h1Ua) based on "titleUa".
      🔸 It should be **compelling and engaging** for readers.
      🔸 It should be **consistent with titleUa** but can be slightly different for better user experience.
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
      "h1En": "<English H1 heading>",
      "descriptionUa": "<SEO description in Ukrainian>",
      "keywordsUa": "<SEO keywords in Ukrainian>",
      "titleUa": "<Ukrainian SEO title>",
      "h1Ua": "<Ukrainian H1 heading>",
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

export const aiGenerateTest = async (content: string) => {
  const system = `
  You are an expert test generator, skilled at crafting engaging and insightful quizzes. Your task is to create a test with questions, answers, and conclusions, all adhering to a specific schema.

🔹 What to do?

Generate a set of questions and corresponding answers for a test.

Provide detailed, extensive and well-reasoned conclusions based on the test results, mapping score ranges to descriptive outcomes.

Conclusions should not be simple statements; instead, provide a comprehensive explanation of what each score range signifies.

Conclusion Ranges: The minRank and maxRank values for the conclusions must be adjusted to create distinct, non-overlapping ranges that
cover the entire possible score range.

Calculate and write the ratings so that they are correctly match the conclusions. **Critically, the answer ratings for each question must not follow a predictable sequence (e.g., increasing or decreasing order). Randomize the rating order for each question to prevent users from easily guessing higher-scoring answers.**

The user should not know what score he scored for the answer. At the end of the test, he will only see the conclusion text.

Crucial Score Range Considerations:

Minimum Score Sum: The sum of the lowest possible rating from each question's answers must be less than or equal to the maxRank of the first conclusion. (Ensures even low-scoring individuals receive a conclusion.)

Maximum Score Sum: The sum of the highest possible rating from each question's answers must be equal to the maxRank of the last conclusion. (Ensures the highest possible score leads to the 'best' conclusion)

Ensure all output strictly adheres to the JSON schema defined below:
{
  "questions": [
{
"titleUa": "<Question in Ukrainian>",
"titleEn": "<Question in English>",
"answers": [
{
"textUa": "<Answer in Ukrainian>",
"textEn": "<Answer in English>",
"rating": <Numeric rating for this answer (0-50)>
},
{
"textUa": "<Answer in Ukrainian>",
"textEn": "<Answer in English>",
"rating": <Numeric rating for this answer (0-50)>
},
... (At least 2 answers)
]
},
... (At least 5 question)
],
"conclusions": [
{
"minRank": <Minimum score for this conclusion>,
"maxRank": <Maximum score for this conclusion>,
"descriptionUa": "<Detailed, extensive and well-reasoned conclusion description in Ukrainian>",
"descriptionEn": "<Detailed, extensive and well-reasoned conclusion description in English>"
},
... (At least 3 conclusion)
]
}

🔹 Constraints:

The "questions" array must contain at least one question.

Each question must have "titleUa" and "titleEn" fields.

The "answers" array within each question must contain at least two answers.

Each answer must have "textUa", "textEn", and "rating" fields.

The "rating" for each answer must be a number between 0 and 50 (inclusive) and **should not follow a predictable sequence within each question's answer set.**

The "conclusions" array must contain at least three conclusion.

Each conclusion must have "minRank", "maxRank", "descriptionUa", and "descriptionEn" fields.

"minRank" must be a number greater than or equal to 0.

"maxRank" must be a number greater than or equal to "minRank".

All text fields ("titleUa", "titleEn", "textUa", "textEn", "descriptionUa", "descriptionEn") must be meaningful, well-written, and you are encouraged to use Unicode Symbols where appropriate to add visual interest and clarity.

The sum of the lowest possible ratings must be less than or equal to the maxRank of the first conclusion.

The sum of the highest possible ratings must be equal to the maxRank of the last conclusion.

🔹 Input:
A brief description or text content of the test topic (e.g., "A personality test to determine your dominant character trait").

🔹 Output:
Conforming to the JSON schema above, containing the questions, answers, and conclusions for the test.

Respond only in Conforming JSON format, without explanations, comments, or introductory phrases.
`;
  try {
    const { text } = await generateText({
      model: geminiFlashThinking,
      system,
      prompt: content,
    });

    // console.log("AI Response:", text);

    return text.replace(/```json|```/g, ''); // Видаляємо можливі JSON-блоки
  } catch (error) {
    console.log('🚀 ~ aiGenerateTest ~ error:', error);
    throw new Error(`AI Test Generating Error: ${error}`);
  }
};
