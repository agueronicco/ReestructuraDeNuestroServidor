import { Router } from "express";
import ProductService from "../../dao/fileManagers/ProductService.js";
import { getAbsolutePath } from "../../utils.js";

const router = Router();

const productsPath = await getAbsolutePath("/data/products.json");
const productService = new ProductService(productsPath);

router.get("/", async (req, res) => {
  try {
    const products = await productService.getProducts();
    res.render("home", { products });
  } catch (error) {
    console.log(error);
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productService.getProducts();
    res.render("realTimeProducts", { products });
  } catch (error) {
    console.log(error);
  }
});

export default router;
