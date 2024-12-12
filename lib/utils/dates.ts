export const getValidDate = (date: string | Date) => {
  const currDate = date instanceof Date ? date : new Date(date);

  return currDate.toString() === "Invalid Date" ? null : currDate;
};

// export const getFormattedDateStrYearFirst = (
//   date: string | Date = new Date()
// ) => {
//   const validDate = getValidDate(date);

//   return !validDate
//     ? ''
//     : validDate.toLocaleDateString('en-CA', {
//         year: 'numeric',
//         month: '2-digit',
//         day: '2-digit',
//       });
// };

export const getFormattedDateStrYearFirst = (date: string | Date) => {
  const validDate = !date ? new Date() : getValidDate(date);
  const locale = "en-CA";

  return !validDate
    ? ""
    : validDate
        .toLocaleDateString(locale, {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\u200F/g, ""); // прибирає RLM символи, якщо вони є
};
