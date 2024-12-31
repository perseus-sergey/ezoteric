export const cutText = (text: string, cutLength: number) => {
  if (!text) return '';

  let trimmedText = text.trim();

  if (trimmedText.length <= cutLength) return trimmedText;

  trimmedText = text.slice(0, cutLength);
  trimmedText = trimmedText.replace(/[!,.-]*$/, '');
  const lastSpaceIndex = trimmedText.lastIndexOf(' ');
  trimmedText =
    lastSpaceIndex !== -1 ? trimmedText.slice(0, lastSpaceIndex) : trimmedText;

  return `${trimmedText}...`;
};

export const cutMiddleOfText = (
  text: string,
  lengthThreshold: number,
  numberOfStartWords: number,
  numberOfEndWords: number
): string => {
  if (!text) return '';

  const trimmedText = text.trim();

  if (trimmedText.length <= lengthThreshold) return trimmedText;
  const words = trimmedText.split(/\s+/);
  const totalWords = words.length;

  if (totalWords <= numberOfStartWords + numberOfEndWords) return trimmedText;

  const startWords = words.slice(0, numberOfStartWords).join(' ');
  const endWords = words.slice(totalWords - numberOfEndWords).join(' ');

  return `${startWords} ... ${endWords}`;
};
