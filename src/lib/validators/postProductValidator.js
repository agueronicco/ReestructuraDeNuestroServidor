const postProductValidator = (...values) => {
  values.forEach((value) => {
    if (!value) throw new Error("You must enter all fields");
  });
  return true;
};

export default postProductValidator;
