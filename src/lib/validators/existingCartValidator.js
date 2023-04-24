const existingCartValidator = async (cartsManager, cid) => {
  const cart = await cartsManager.getCart(cid);
  if (!cart) throw new Error("That cart id does not exist");
  return cart;
};

export default existingCartValidator;
