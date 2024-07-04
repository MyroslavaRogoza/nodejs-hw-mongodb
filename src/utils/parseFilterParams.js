const parseType = (type) => {
  const isString = typeof type === 'string';
  if (!isString) return;

  if (['work', 'home', 'personal'].includes(type)) return type;
};

const parseToBool = (query) => {
  const isString = typeof query === 'string';
  if (!isString) return;

  if (query === 'true') {
    return true;
  }
  if (query === 'false') {
    return false;
  }
};

export const parseFilterParams = (query) => {
  const { type, isFavourite } = query;

  const parsedType = parseType(type);
  const parsedIsFavourite = parseToBool(isFavourite);

  return {
    type: parsedType,
    isFavourite: parsedIsFavourite,
  };
};
