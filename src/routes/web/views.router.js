import { Router } from "express";
import Products from "../../dao/dbManagers/products.js";
import Carts from "../../dao/dbManagers/carts.js";
import productsPaginateValidator from "../../lib/validators/productsPaginateValidator.js";
import existingProductValidator from "../../lib/validators/existingProductValidator.js";
import idValidator from "../../lib/validators/idValidator.js";
import existingCartValidator from "../../lib/validators/existingCartValidator.js";
import passport from "passport";

const productsManager = new Products();
const cartsManager = new Carts();

const router = Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
  async (req, res) => {
    res.redirect("/products");
  }
);

router.get(
  "/realtimeproducts",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const products = await productsManager.getAll();
      res.render("realTimeProducts", { products, user: req.user });
    } catch (error) {
      console.log(error);
    }
  }
);

router.get(
  "/chat",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    res.render("chat", { user: req.user });
  }
);

router.get(
  "/products/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
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

      res.render("products", { response, user: req.user });
    } catch (error) {
      console.log(error);
      res.status(400).send({ status: "error", message: error.message });
    }
  }
);

router.get(
  "/products/:pid",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { pid } = req.params;
      idValidator(pid);
      const product = await existingProductValidator(productsManager, pid);

      res.render("productDetail", { ...product._doc, user: req.user });
    } catch (error) {
      res.status(400).send({ status: "error", message: error.message });
    }
  }
);

router.get(
  "/carts/:cid",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { cid } = req.params;
      idValidator(cid);
      const cart = await existingCartValidator(cartsManager, cid);

      res.render("cart", { ...cart, user: req.user });
    } catch (error) {
      console.log(error);
      res.status(400).send({ status: "error", message: error.message });
    }
  }
);

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.render("profile", {
      user: req.user,
    });
  }
);

export default router;
