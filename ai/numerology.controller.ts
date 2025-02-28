'use server';

import { geminiFlashThinking } from '@/ai';
import { ELanguage } from '@/models/language.model';
import { ENumerologySystem } from '@/models/meta/numerology.model';
import { generateText } from 'ai';

// Letter values for both systems (expanded for Ukrainian alphabet)
const pythagoreanLetterValues: { [key: string]: number } = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5,
  f: 6,
  g: 7,
  h: 8,
  i: 9,
  j: 1,
  k: 2,
  l: 3,
  m: 4,
  n: 5,
  o: 6,
  p: 7,
  q: 8,
  r: 9,
  s: 1,
  t: 2,
  u: 3,
  v: 4,
  w: 5,
  x: 6,
  y: 7,
  z: 8,

  а: 1,
  б: 2,
  в: 4,
  г: 3,
  ґ: 3,
  д: 4,
  е: 5,
  є: 5,
  ж: 6,
  з: 7,
  и: 8,
  і: 9,
  ї: 9,
  й: 1,
  к: 2,
  л: 3,
  м: 4,
  н: 5,
  о: 6,
  п: 7,
  р: 9,
  с: 1,
  т: 2,
  у: 6,
  ф: 8,
  х: 5,
  ц: 3,
  ч: 8,
  ш: 3,
  щ: 8,
  ь: 1,
  ю: 7,
  я: 1,
};

const chaldeanLetterValues: { [key: string]: number } = {
  a: 1,
  i: 1,
  j: 1,
  o: 7,
  y: 1,
  b: 2,
  k: 2,
  r: 2,
  c: 3,
  g: 3,
  l: 3,
  s: 3,
  d: 4,
  m: 4,
  t: 4,
  e: 5,
  h: 5,
  n: 5,
  x: 5,
  u: 6,
  v: 6,
  w: 6,
  z: 7,
  f: 8,
  p: 8,

  а: 1,
  і: 1,
  й: 1,
  о: 7,
  у: 6,
  б: 2,
  к: 2,
  р: 2,
  в: 6,
  г: 3,
  л: 3,
  с: 3,
  д: 4,
  м: 4,
  т: 4,
  е: 5,
  є: 5,
  н: 5,
  х: 5,
  ж: 5,
  з: 7,
  п: 8,
  ф: 8,
  ц: 3,
  ч: 8,
  ш: 3,
  щ: 8,
  ю: 7,
  я: 1,
  ґ: 3,
  ї: 9,
};

// Function to get correct letter values based on system
const getLetterValues = (system: ENumerologySystem) => {
  switch (system) {
    case ENumerologySystem.Chaldean:
      return chaldeanLetterValues;
    case ENumerologySystem.Pythagorean:
    default:
      return pythagoreanLetterValues;
  }
};

// Function to reduce number to single digit, considering master and karmic numbers (for Chaldean)
const reduceToSingleDigit = (
  number: number,
  system: ENumerologySystem
): { reducedNumber: number; isMasterKarmic: boolean } => {
  // Return object
  let num = number;
  let isMasterKarmic = false; // Track if it's master/karmic

  // Karmic numbers
  const chaldeanKarmicNumbers = [16, 19, 18, 25, 13, 14];
  const masterNumbers = [11, 22, 33];

  if (system === ENumerologySystem.Chaldean) {
    if (masterNumbers.includes(num) || chaldeanKarmicNumbers.includes(num)) {
      isMasterKarmic = true; // Mark as master/karmic
      return { reducedNumber: num, isMasterKarmic }; // Return master/karmic number as is
    }
  } else if (masterNumbers.includes(num)) {
    isMasterKarmic = true; // Mark as master
    return { reducedNumber: num, isMasterKarmic }; // Return master number as is
  }

  while (num > 9) {
    const numStr = num.toString();
    num = numStr.split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  return { reducedNumber: num, isMasterKarmic: false }; // Return reduced number and mark as not master/karmic
};

const calculateLifePathNumber = (
  birthDate: string,
  system: ENumerologySystem
): { lifePathNumber: number; lifePathInvolvedNumbers: number[] } => {
  const date = new Date(birthDate);

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const lifePathInvolvedNumbers: number[] = [];

  const reducedDayResult = reduceToSingleDigit(day, system);
  const reducedMonthResult = reduceToSingleDigit(month, system);
  const reducedYearResult = reduceToSingleDigit(year, system);

  if (reducedDayResult.isMasterKarmic)
    lifePathInvolvedNumbers.push(reducedDayResult.reducedNumber);
  if (reducedMonthResult.isMasterKarmic)
    lifePathInvolvedNumbers.push(reducedMonthResult.reducedNumber);
  if (reducedYearResult.isMasterKarmic)
    lifePathInvolvedNumbers.push(reducedYearResult.reducedNumber);

  const sum =
    reducedDayResult.reducedNumber +
    reducedMonthResult.reducedNumber +
    reducedYearResult.reducedNumber;
  const lifePathNumberResult = reduceToSingleDigit(sum, system);
  const lifePathNumber = lifePathNumberResult.reducedNumber;

  if (lifePathNumberResult.isMasterKarmic)
    lifePathInvolvedNumbers.push(lifePathNumber);

  return { lifePathNumber, lifePathInvolvedNumbers };
};

const calculateSoulNumber = (
  username: string,
  system: ENumerologySystem
): { soulNumber: number; soulInvolvedNumbers: number[] } => {
  const vowels = 'aeiouyаеєіїиіуяю';
  const lowerUsername = username.toLowerCase();
  const currentLetterValues = getLetterValues(system);
  const soulInvolvedNumbers: number[] = [];

  const soulValueCalculated = lowerUsername.split('').reduce((acc, char) => {
    return vowels.includes(char) ? acc + (currentLetterValues[char] || 0) : acc;
  }, 0);

  const soulNumberResult = reduceToSingleDigit(soulValueCalculated, system);
  const soulNumber = soulNumberResult.reducedNumber;
  if (soulNumberResult.isMasterKarmic) soulInvolvedNumbers.push(soulNumber);

  return { soulNumber, soulInvolvedNumbers };
};

const calculatePersonalityNumber = (
  username: string,
  system: ENumerologySystem
): { personalityNumber: number; personalityInvolvedNumbers: number[] } => {
  const consonants = 'bcdfghjklmnpqrstvwxzбвгґджзклмнпрстфхцчшщ';
  const lowerUsername = username.toLowerCase();
  const currentLetterValues = getLetterValues(system);
  const personalityInvolvedNumbers: number[] = [];

  const personalityValueCalculated = lowerUsername
    .split('')
    .reduce((acc, char) => {
      return consonants.includes(char)
        ? acc + (currentLetterValues[char] || 0)
        : acc;
    }, 0);

  const personalityNumberResult = reduceToSingleDigit(
    personalityValueCalculated,
    system
  );
  const personalityNumber = personalityNumberResult.reducedNumber;
  if (personalityNumberResult.isMasterKarmic)
    personalityInvolvedNumbers.push(personalityNumber);

  return { personalityNumber, personalityInvolvedNumbers };
};

const calculateDestinyNumber = (
  username: string,
  system: ENumerologySystem
): { destinyNumber: number; destinyInvolvedNumbers: number[] } => {
  const lowerUsername = username.toLowerCase();
  const currentLetterValues = getLetterValues(system);
  const destinyInvolvedNumbers: number[] = [];

  const destinyValueCalculated = lowerUsername.split('').reduce((acc, char) => {
    return acc + (currentLetterValues[char] || 0);
  }, 0);

  const destinyNumberResult = reduceToSingleDigit(
    destinyValueCalculated,
    system
  );
  const destinyNumber = destinyNumberResult.reducedNumber;
  if (destinyNumberResult.isMasterKarmic)
    destinyInvolvedNumbers.push(destinyNumber);

  return { destinyNumber, destinyInvolvedNumbers };
};

// =================================================================
// =================================================================

export const generateAiNumerology = async (
  userName: string,
  birthdate: string,
  lang: ELanguage,
  numerologySystem: ENumerologySystem
) => {
  const { lifePathNumber, lifePathInvolvedNumbers } = calculateLifePathNumber(
    birthdate,
    numerologySystem
  );
  const { soulNumber, soulInvolvedNumbers } = calculateSoulNumber(
    userName,
    numerologySystem
  );
  const { destinyNumber, destinyInvolvedNumbers } = calculateDestinyNumber(
    userName,
    numerologySystem
  );
  const { personalityNumber, personalityInvolvedNumbers } =
    calculatePersonalityNumber(userName, numerologySystem);

  const { text } = await generateText({
    model: geminiFlashThinking,
    system: `
You are an expert numerologist specializing in **both Pythagorean and Chaldean numerology systems**. You will receive pre-calculated numerological numbers, information about any master or karmic numbers involved, and **the name of the numerology system chosen by the user**. Your task is to provide a concise, insightful, and **system-specific** interpretation **in the specified language**.

**Input Format:**

The input will be provided in the following JSON format:

\`\`\`json
{
  "lifePathNumber": <Number>, // **Final, reduced Life Path Number**
  "soulNumber": <Number>,     // **Final, reduced Soul Number**
  "destinyNumber": <Number>,  // **Final, reduced Destiny Number**
  "personalityNumber": <Number>, // **Final, reduced Personality Number**
  "masterKarmicNumbersInvolved": {
    "lifePathNumber": [<Number>], // Intermediate master/karmic numbers for Life Path
    "soulNumber": [<Number>],     // Intermediate master/karmic numbers for Soul Number
    "destinyNumber": [<Number>],  // Intermediate master/karmic numbers for Destiny Number
    "personalityNumber": [<Number>] // Intermediate master/karmic numbers for Personality Number
  },
  "system": "pythagorean" | "chaldean", // **Numerology system chosen by user**
  "language": "en" | "uk" // "uk" - ukrainian
}
\`\`\`

**Task:**

Based on the provided **final numerological numbers**, **considering the influence of intermediate master or karmic numbers**, and **strictly adhering to the principles and interpretations of the specified numerology system ("pythagorean" or "chaldean")**, generate the following interpretations:

- **lifePathNumberInterpretation**:  Explain the meaning of the Life Path Number **according to the chosen numerology system** and discuss the influence of any listed master/karmic numbers **within the context of that system.**
- **soulNumberInterpretation**: Explain the meaning of the Soul Number **according to the chosen numerology system** and discuss the influence of any listed master/karmic numbers **within the context of that system.**
- **destinyNumberInterpretation**: Explain the meaning of the Destiny Number **according to the chosen numerology system** and discuss the influence of any listed master/karmic numbers **within the context of that system.**
- **personalityNumberInterpretation**: Explain the meaning of the Personality Number **according to the chosen numerology system** and discuss the influence of any listed master/karmic numbers **within the context of that system.**
- **overallInterpretation**: Provide a concise overall summary of the numerological profile, highlighting key themes and potential areas of focus **based on all numbers, the influence of master/karmic numbers, and the principles of the chosen numerology system.**

**Output Format:**

Your output should be a JSON object with the following structure:

\`\`\`json
{
  "lifePathNumberInterpretation": <String>, // In the specified language, **system-specific**
  "soulNumberInterpretation": <String>, // In the specified language, **system-specific**
  "destinyNumberInterpretation": <String>, // In the specified language, **system-specific**
  "personalityNumberInterpretation": <String>, // In the specified language, **system-specific**
  "overallInterpretation": <String> // In the specified language, **system-specific**
}
\`\`\`

**Important Notes:**

- **System-Specific Interpretations:**  **Ensure ALL interpretations are consistent with the principles and common interpretations of the numerology system specified in the input ("pythagorean" or "chaldean").**  For example:
    - **Pythagorean System:** Focus on interpretations commonly associated with Pythagorean numerology (e.g., emphasis on personality traits, life path direction in a more practical sense, simplified number meanings).
    - **Chaldean System:** Focus on interpretations aligned with Chaldean numerology (e.g., emphasis on vibrational essence of numbers, deeper spiritual and karmic meanings, potential for more nuanced and sometimes challenging interpretations, recognition of compound number meanings in some contexts).
- **Personalization, Master/Karmic Number Influence, No Predictions, Concise and Insightful, Language:** (These notes remain the same as in the previous prompt -  Personalization, Master/Karmic Number Influence, No Predictions, Concise and Insightful, Language).
`,
    prompt: JSON.stringify({
      lifePathNumber,
      soulNumber,
      destinyNumber,
      personalityNumber,
      masterKarmicNumbersInvolved: {
        lifePathNumber: lifePathInvolvedNumbers,
        soulNumber: soulInvolvedNumbers,
        destinyNumber: destinyInvolvedNumbers,
        personalityNumber: personalityInvolvedNumbers,
      },
      system: numerologySystem, // **Pass the selected numerologySystem to the prompt**
      language: lang,
    }),
  });

  const cleanResult = text.replace(/```json|```/g, '');

  const jsonParsed = JSON.parse(cleanResult);

  return {
    ...jsonParsed,
    lifePathNumber,
    soulNumber,
    destinyNumber,
    personalityNumber,
    lifePathInvolvedNumbers,
    soulInvolvedNumbers,
    destinyInvolvedNumbers,
    personalityInvolvedNumbers,
  };
};
