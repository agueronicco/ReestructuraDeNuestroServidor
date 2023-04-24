import { Router } from "express";
import { io } from "../../app.js";
import Products from "../../dao/dbManagers/products.js";
import productsPaginateValidator from "../../lib/validators/productsPaginateValidator.js";
import idValidator from "../../lib/validators/idValidator.js";
import postProductValidator from "../../lib/validators/postProductValidator.js";
import existingProductValidator from "../../lib/validators/existingProductValidator.js";

const productsManager = new Products();

const router = Router();

router.get("/", async (req, res) => {
  try {
    let { limit = 10, page = 1, query = "", sort = "" } = req.query;

    productsPaginateValidator(limit, page, sort);

    if (query) query = JSON.parse(query);

    if (sort) sort = { price: sort };

    const response = await productsManager.getPaginate(
      limit,
      page,
      query,
      sort
    );

    res.send(response);
  } catch (error) {
    console.log(error);
    res.status(400).send({ status: "error", message: error.message });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    idValidator(pid);
    const product = await existingProductValidator(productsManager, pid);
    res.send({ status: "success", product });
  } catch (error) {
    console.log(error);
    res.status(400).send({ status: "error", message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const product = req.body;
    const { title, description, code, price, stock, category } = product;
    postProductValidator(title, description, code, price, stock, category);

    const response = await productsManager.addProduct(product);
    if (!response)
      return res
        .status(400)
        .send({ status: "error", message: "Error creating product" });

    const products = await productsManager.getAll();
    io.emit("realTimeProducts", products);

    res.send({ status: "success", message: "Product added", response });
  } catch (error) {
    console.log(error);
    res.status(400).send({ status: "error", message: error.message });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    idValidator(pid);
    const product = await existingProductValidator(productsManager, pid);
    const newProduct = req.body;

    const response = await productsManager.updateProduct(pid, newProduct);
    return response?.modifiedCount
      ? res.send({ status: "success", message: "Product update" })
      : res.status(404).send({
          status: "error",
          message: "Can not update product",
        });
  } catch (error) {
    console.log(error);
    res.status(400).send({ status: "error", message: error.message });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    idValidator(pid);
    const product = await existingProductValidator(productsManager, pid);

    const response = await productsManager.deleteProduct(pid);
    if (response?.deletedCount) {
      const products = await productsManager.getAll();
      io.emit("realTimeProducts", products);
      return res.send({ status: "success", message: "Product delete" });
    }
    res.status(404).send({
      status: "error",
      message: "Error deleting product!",
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ status: "error", message: error.message });
  }
});

export default router;
