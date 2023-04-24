import { cartModel } from "../models/carts.js";

export default class Carts {
  constructor() {
    console.log("Working carts with DB in mongoDB");
  }

  createCart = async () => {
    try {
      const result = await cartModel.create({});
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  getCart = async (cid) => {
    try {
      const result = await cartModel
        .findOne({ _id: cid })
        .populate("products.product");
      return result?.toObject();
    } catch (error) {
      console.log(error);
    }
  };

  addProduct = async (cid, cart) => {
    try {
      const result = await cartModel.updateOne({ _id: cid }, cart);
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  update = async (cid, cart) => {
    try {
      const result = await cartModel.updateOne({ _id: cid }, cart);
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  deleteProduct = async (cid, pid) => {
    try {
      const result = await cartModel.updateOne(
        { _id: cid },
        { $pull: { products: { product: pid } } }
      );
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  deleteAllProducts = async (cid) => {
    try {
      const result = await cartModel.updateOne({ _id: cid }, { products: [] });
      return result;
    } catch (error) {
      console.log(error);
    }
  };
}
