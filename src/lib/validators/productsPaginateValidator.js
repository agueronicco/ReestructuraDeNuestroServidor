const productsPaginateValidator = (limit, page, sort) => {
  limit = Number(limit);
  page = Number(page);

  if (isNaN(limit) || limit <= 0 || isNaN(page) || page <= 0)
    throw new Error("You must enter a number greater than 0");

  if (sort) {
    sort = Number(sort);
    if (isNaN(sort) || (sort !== 1 && sort !== -1))
      throw new Error(
        "To sort the result, you must enter the number 1 (DES) or -1 (ASC)"
      );
  }

  return true;
};

export default productsPaginateValidator;
