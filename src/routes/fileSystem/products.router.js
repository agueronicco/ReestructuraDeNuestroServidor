import { Router } from "express";
import ProductService from "../../dao/fileManagers/ProductService.js";
import { getAbsolutePath } from "../../utils.js";
import { io } from "../../app.js";

const router = Router();

const productsPath = await getAbsolutePath("/data/products.json");
const productService = new ProductService(productsPath);

router.get("/", async (req, res) => {
  try {
    let { limit } = req.query;

    if (limit === undefined) {
      const products = await productService.getProducts();
      return res.send(products);
    }

    limit = Number(limit);
    if (isNaN(limit) || limit <= 0)
      return res.status(400).send({
        status: "error",
        message: "Debe ingresar un numero mayor a 0",
      });

    const products = await productService.getProducts();

    if (limit > 0) return res.send(products.slice(0, limit));
  } catch (error) {
    console.log(error);
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    const product = await productService.getProductById(Number(pid));

    if (product) return res.send(product);

    res
      .status(404)
      .send({ status: "error", Error: "El producto no existe!!!" });
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const product = req.body;
    const response = await productService.addProduct(product);
    if (response.error)
      return res
        .status(400)
        .send({ status: "error", message: response.error.message });

    const products = await productService.getProducts();
    io.emit("realTimeProducts", products);

    res.send({ status: "success", message: "Product added" });
  } catch (error) {
    console.log(error);
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = req.body;

    const response = await productService.updateProduct(Number(pid), product);
    return response.status === "success"
      ? res.send({ status: "success", message: "Product update" })
      : res.status(404).send({
          status: "error",
          message: response.error,
        });
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    const response = await productService.deleteProduct(Number(pid));
    if (response.status === "success") {
      const products = await productService.getProducts();
      io.emit("realTimeProducts", products);
      return res.send({ status: "success", message: "Product delete" });
    }
    res.status(404).send({
      status: "error",
      message: response.error,
    });
  } catch (error) {
    console.log(error);
  }
});

export default router;
