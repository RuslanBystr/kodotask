export const addMonths = (numOfMonths: number, date = new Date()) => {
  date.setMonth(date.getMonth() + numOfMonths);

  return date;
};

export const getPreviousDate = (date: Date = new Date()) => {
  const d = new Date(date);
  return new Date(d.setDate(d.getDate() - 1));
};

export const getNextDate = (date: Date = new Date()) => {
  const d = new Date(date);
  return new Date(d.setDate(d.getDate() + 1));
};
