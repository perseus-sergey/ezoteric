export const localeStringMaker = (
  number: number,
  delimiter: 'coma' | 'point' = 'point'
) => {
  return number.toLocaleString(delimiter === 'coma' ? 'en-US' : 'de-DE');
};
