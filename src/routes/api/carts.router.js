import { Router } from "express";
import Carts from "../../dao/dbManagers/carts.js";
import Products from "../../dao/dbManagers/products.js";
import existingCartValidator from "../../lib/validators/existingCartValidator.js";
import idValidator from "../../lib/validators/idValidator.js";
import existingProductValidator from "../../lib/validators/existingProductValidator.js";

const cartsManager = new Carts();
const productsManager = new Products();

const router = Router();

router.post("/", async (req, res) => {
  try {
    const response = await cartsManager.createCart();
    if (!response)
      return res
        .status(400)
        .send({ status: "error", message: "Error creating cart" });

    res.send({ status: "success", message: "Cart created", response });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    idValidator(cid);
    const cart = await existingCartValidator(cartsManager, cid);

    res.send({ status: "success", cart });
  } catch (error) {
    console.log(error);
    res.status(400).send({ status: "error", message: error.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    idValidator(cid, pid);

    const cart = await existingCartValidator(cartsManager, cid);
    const product = await existingProductValidator(productsManager, pid);

    const index = cart.products.findIndex(
      (p) => p.product._id.toString() === pid
    );
    if (index === -1) cart.products.push({ product: pid });
    if (index !== -1) cart.products[index].quantity += 1;

    const response = await cartsManager.addProduct(cid, cart);

    if (!response)
      return res
        .status(400)
        .send({ status: "error", message: "Error adding product" });

    res.send({ status: "success", message: "Product added." });
  } catch (error) {
    console.log(error);
    res.status(400).send({ status: "error", message: error.message });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { newCart } = req.body;

    idValidator(cid);
    const cart = await existingCartValidator(cartsManager, cid);

    const response = await cartsManager.update(cid, newCart);
    if (response?.acknowledged)
      return res.send({ status: "success", message: "Cart updated" });

    res.status(400).send({ status: "error", message: "Error updating cart" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ status: "error", message: error.message });
  }
});

router.put("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    idValidator(cid, pid);
    const cart = await existingCartValidator(cartsManager, cid);
    const product = await existingProductValidator(productsManager, pid);

    const index = cart.products.findIndex(
      (p) => p.product._id.toString() === pid
    );
    if (index !== -1) cart.products[index].quantity = quantity;

    const response = await cartsManager.update(cid, cart);

    if (response?.acknowledged)
      return res.send({ status: "success", message: "Cart updated" });

    res.status(400).send({ status: "error", message: "Error updating cart" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ status: "error", message: error.message });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    idValidator(cid, pid);
    const cart = await existingCartValidator(cartsManager, cid);
    const product = await existingProductValidator(productsManager, pid);

    const response = await cartsManager.deleteProduct(cid, pid);
    if (response?.acknowledged && response?.modifiedCount)
      return res.send({ status: "success", message: "Product was deleted." });
    res
      .status(400)
      .send({ status: "error", message: "Error deleting product" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ status: "error", message: error.message });
  }
});

router.delete("/:cid/", async (req, res) => {
  try {
    const { cid } = req.params;
    idValidator(cid);
    const cart = await existingCartValidator(cartsManager, cid);

    const response = await cartsManager.deleteAllProducts(cid);
    if (response?.acknowledged)
      res.send({
        status: "success",
        message: `All products was deleted from cart`,
      });
  } catch (error) {
    console.log(error);
    res.status(400).send({ status: "error", message: error.message });
  }
});

export default router;
