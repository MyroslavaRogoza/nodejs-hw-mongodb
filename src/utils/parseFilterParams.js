const parseType = (type) => {
  const isString = typeof type === 'string';
  if (!isString) return;

  if (['work', 'home', 'personal'].includes(type)) return type;
};

const parseToBool = (query) => {
  if (typeof query === 'string') {
    return Boolean(query);
  }
};

export const parseFilterParams = (query) => {
  const { type, isFavourite } = query;

  const parsedType = parseType(type);
  const parsedIsFavourite = parseToBool(isFavourite);

  return {
    type: parsedType,
    IsFavorite: parsedIsFavourite,
  };
};
