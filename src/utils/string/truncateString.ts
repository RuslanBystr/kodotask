export const truncateString = (input: string, letters = 50) =>
  input.length > letters ? `${input.substring(0, letters)}...` : input;
