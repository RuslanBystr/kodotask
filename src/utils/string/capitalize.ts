export const capitalize = <T extends string>(str: T): Capitalize<T> => {
  if (!str) {
    return str as Capitalize<T>;
  }

  return (str[0].toUpperCase() + str.substring(1)) as Capitalize<T>;
};
