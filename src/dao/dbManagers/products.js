import { productModel } from "../models/products.js";

export default class Products {
  constructor() {
    console.log("Working products with DB in mongoDB");
  }

  getPaginate = async (limit = 10, page = 1, query = "", sort = "") => {
    try {
      const response = await productModel.paginate(query, {
        limit,
        page,
        sort,
        lean: true,
      });

      if (query) query = JSON.stringify(query);

      response.status = "success";
      response.prevLink = response.hasPrevPage
        ? `http://localhost:8080/products?limit=${limit}&page=${
            response.prevPage
          }${query ? `&query=${query}` : ""}${
            sort ? `&sort=${sort.price}` : ""
          }`
        : null;
      response.nextLink = response.hasNextPage
        ? `http://localhost:8080/products?limit=${limit}&page=${
            response.nextPage
          }${query ? `&query=${query}` : ""}${
            sort ? `&sort=${sort.price}` : ""
          }`
        : null;

      response.payload = response.docs;
      delete response.docs;

      return response;
    } catch (error) {
      console.log(error);
    }
  };

  getAll = async () => {
    try {
      const products = await productModel.find();
      return products.map((product) => product.toObject());
    } catch (error) {
      console.log(error);
    }
  };

  getLimit = async (limit) => {
    try {
      const products = await productModel.find().limit(limit);
      return products.map((product) => product.toObject());
    } catch (error) {
      console.log(error);
    }
  };

  addProduct = async (product) => {
    try {
      const result = await productModel.create(product);
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  getProduct = async (pid) => {
    try {
      const result = await productModel.findOne({ _id: pid });
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  updateProduct = async (pid, product) => {
    try {
      const result = await productModel.updateOne({ _id: pid }, product);
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  deleteProduct = async (pid) => {
    try {
      const result = await productModel.deleteOne({ _id: pid });
      return result;
    } catch (error) {
      console.log(error);
    }
  };
}
