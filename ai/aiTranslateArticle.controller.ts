'use server';

import { geminiFlashModel, geminiProExperimental } from '@/ai';
import { TTag } from '@/db/schema';
import { questAndConclusionSchema } from '@/models/editArticle.model';
import { generateObject } from 'ai';
import { z } from 'zod';

export const aiTranslateArticle = async (contentUa: string) => {
  const { object } = await generateObject({
    model: geminiFlashModel,
    system: `## 🔄 General Instructions

Translate the Ukrainian content into English.

- Ensure that only the **text content inside the tags** and the relevant **attribute values** (e.g., 'alt', 'aria-label') are translated.
- Leave the **HTML tags and structure unchanged**.
- Translate the **text content** while preserving all formatting.

---

## 🔗 Internal Links Handling

If any internal links are found in the format:

- '/uk/blog/article-name'
- '/uk/tests/test-name'

Replace '/uk' with '/en', so that the translated version points to the correct English URL:

- '/uk/blog/article-name' → '/en/blog/article-name'
- '/uk/tests/test-name' → '/en/tests/test-name'

---

## 🌍 Cultural and Language Adaptation

When translating, adapt the text to match the **mentality, cultural background, and expectations** of an English-speaking audience:

- Use **names and surnames** that are more familiar to English-speaking users, if appropriate.
- Adapt **expressions, idioms, and cultural references** to be more relatable to English readers.
- Adjust **tone, style, and formality** to align with natural English communication norms.
- Ensure the result feels **natural and engaging**, not overly literal.

---

## 🧠 Special Cases: Cultural Systems like Numerology or Alphabets

If the content includes:

- **Tables or descriptions of number-letter associations** using the **Ukrainian alphabet** (e.g., Pythagorean numerology),
- **Culturally specific naming or symbolic systems**,

Then do the following:

- **Do not transliterate or translate the Cyrillic letters literally**.
- Instead, **adapt or replace** the table or logic with the **English equivalent** (e.g., Latin alphabet Pythagorean numerology).
- Add **explanatory text if needed**, such as:
  
  > “In English-speaking contexts, the Pythagorean system assigns numbers to letters as follows…”

- Ensure clarity and cultural relevance for readers unfamiliar with Cyrillic.

---

## ✅ Goal

The final result should:

- Retain **original HTML structure**
- Be a **natural, culturally adapted English version**
- Be ready to use in an **English-facing website or blog**
`,
    schema: z.object({
      translatedHtml: z
        .string()
        .describe(`English HTML content with preserved tags`),
    }),
    prompt: contentUa,
  });

  return object;
};

const metaDataSchema = z.object({
  titleEn: z.string()
    .describe(`**SEO title** in English (titleEn) based on "title-ua".
🔸 It should be **relevant**, **optimized for search queries**
🔸 It can be **slightly modified for better SEO**`),
  h1En: z.string()
    .describe(`**H1 heading** in English (h1En) based on "titleEn".
🔸 It should be **compelling and engaging** for readers.
🔸 It should be **consistent with titleEn** but can be slightly different for better user experience.`),
  descriptionUa: z.string()
    .describe(`**short and attractive meta description** in Ukrainian.
🔸 It should **clearly convey the essence of the content** and **motivate clicks**`),
  descriptionEn: z.string()
    .describe(`**short and attractive meta description** in English.
🔸 It should **clearly convey the essence of the content** and **motivate clicks**`),
  keywordsUa: z.string().describe(`**relevant keywords** in Ukrainian
🔸 Use **popular search queries** that match the content's topic`),
  keywordsEn: z.string().describe(`**relevant keywords** in English
🔸 Use **popular search queries** that match the content's topic`),
  titleUa: z.string().describe(`**SEO title** in Ukrainian (titleUa).
🔸 It should be **relevant**, **optimized for search queries**
🔸 It can be **slightly modified for better SEO**`),
  h1Ua: z.string()
    .describe(`**H1 heading** in Ukrainian (h1Ua) based on "titleUa".
🔸 It should be **compelling and engaging** for readers.
🔸 It should be **consistent with titleUa** but can be slightly different for better user experience.`),
});

// export type TGenerateMetaData = z.infer<typeof metaDataSchema>;

export const aiGenerateMeta = async (titleUa: string, contentUa: string) => {
  const { object } = await generateObject({
    model: geminiProExperimental,
    system: `
    You are an SEO expert and content marketing specialist.
    Your task is to generate high-quality SEO-optimized meta data and H1 headings for search engines (Google, Bing, etc.).

    🔹 **Input data format (JSON)**:
    {
      "title-ua": "<Ukrainian title>",
      "content-ua": "<Ukrainian HTML content with tags>"
    }
  `,
    schema: metaDataSchema,
    prompt: JSON.stringify({
      'title-ua': titleUa,
      'content-ua': contentUa,
    }),
  });

  return object;
};

export const aiAddTags = async (tags: TTag[], contentEn: string) => {
  const system = `
  You are an AI assistant specialized in content categorization.
Your task is to analyze the provided article and select the most relevant tags from a predefined list.

**Tag List:**  
${tags.map((tag) => `${tag.id} - ${tag.nameEn}`).join('\n')}

### Input:  
- An article text.

### Tag Selection Criteria:
- Select only those tags that closely match the article's main topics.
- Do not include unrelated tags.
- If no tag is relevant, return an empty array.
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
`;
  const { object } = await generateObject({
    model: geminiFlashModel,
    system,
    schema: z.object({
      aiTags: z.array(z.number().describe(`Tag identifier`)).max(5),
    }),
    prompt: contentEn,
  });

  return object;
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

🔹 Constraints:

The "rating" for each answer must be a number between 0 and 50 (inclusive) and **should not follow a predictable sequence within each question's answer set.**

All text fields ("titleUa", "titleEn", "textUa", "textEn", "descriptionUa", "descriptionEn") must be meaningful, well-written, and you are encouraged to use Unicode Symbols where appropriate to add visual interest and clarity.

The sum of the lowest possible ratings must be less than or equal to the maxRank of the first conclusion.

The sum of the highest possible ratings must be equal to the maxRank of the last conclusion.

🔹 Input:
A brief description or text content of the test topic (e.g., "A personality test to determine your dominant character trait").
`;

  const { object } = await generateObject({
    model: geminiProExperimental,
    system,
    schema: questAndConclusionSchema,
    prompt: content,
  });

  return object;
};
