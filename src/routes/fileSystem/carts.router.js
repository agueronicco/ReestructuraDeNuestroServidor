import { Router } from "express";
import { getAbsolutePath } from "../../utils.js";
import ProductService from "../../dao/fileManagers/ProductService.js";
import CartService from "../../dao/fileManagers/CartService.js";

const router = Router();

const cartsPath = await getAbsolutePath("/data/carts.json");
const productsPath = await getAbsolutePath("/data/products.json");
const cartService = new CartService(cartsPath);
const productService = new ProductService(productsPath);

router.post("/", async (req, res) => {
  try {
    const response = await cartService.createCart();
    response.status === "success"
      ? res.send({ status: "success", message: "cart created" })
      : res.status(400).send({ status: "error", message: response.error });
  } catch (error) {
    console.log(error);
  }
});

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  const cart = await cartService.getCart(cid);
  if (!cart)
    return res
      .status(404)
      .send({ status: "error", message: "No existe ese id de carrito" });
  res.send({ status: "success", cart: cart });
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await cartService.getCart(cid);
    if (!cart)
      return res
        .status(404)
        .send({ status: "error", message: "No existe ese id de carrito" });

    const product = await productService.getProductById(Number(pid));
    if (!product)
      return res
        .status(404)
        .send({ status: "error", message: "No existe ese id de producto" });

    const response = await cartService.addProduct(cid, pid);
    response.status === "success"
      ? res.send({ status: "success", message: "Product added." })
      : res.status(400).send({ status: "error", message: response.error });
  } catch (error) {
    console.log(error);
  }
});

export default router;
