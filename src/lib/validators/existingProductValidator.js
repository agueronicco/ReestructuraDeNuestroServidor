const existingProductValidator = async (productsManager, pid) => {
  const product = await productsManager.getProduct(pid);
  if (!product) throw new Error("That product id does not exist");
  return product;
};

export default existingProductValidator;
