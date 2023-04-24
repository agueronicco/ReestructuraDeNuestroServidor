import { Router } from "express";
import User from "../../dao/dbManagers/users.js";
import Carts from "../../dao/dbManagers/carts.js";
import passport from "passport";
import {
  createHash,
  generateToken,
  passportCall,
  validatePassword,
} from "../../utils.js";

const cartsManager = new Carts();
const userManager = new User();

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      age,
      role = "user",
      password,
    } = req.body;
    const user = await userManager.findByEmail(email);

    if (user) {
      return res
        .status(400)
        .send({ status: "error", message: "User already exists" });
    }

    const newUser = {
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
      role,
    };

    await userManager.add(newUser);
    res.send({ status: "success", message: "user registered" });
  } catch (error) {
    return res
      .status(500)
      .send({ status: "error", message: `Error registering user. ${error}` });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userManager.findByEmail(email);

    if (!user) {
      return res
        .status(401)
        .send({ status: "error", message: "Invalid credentials" });
    }

    if (!validatePassword(user, password))
      return res
        .status(401)
        .send({ status: "error", message: "Invalid credentials" });

    if (!user.cart) {
      const cart = await cartsManager.createCart();
      user.cart = cart._id.toString();
      await userManager.update(email, user);
      console.log("cart created");
    }
    user.password = "";

    const accessToken = generateToken(user);

    res
      .cookie("coderCookieToken", accessToken, {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
      })
      .send({ status: "success", message: "login success" });
  } catch (error) {
    return res
      .status(500)
      .send({ status: "error", message: `Error login user. ${error}` });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("coderCookieToken");
  res.redirect("/login");
});

router.get(
  "/github",
  passport.authenticate("github", { session: false, scope: ["user:email"] }),
  async (req, res) => {
    res.send({ status: "sucess", message: "user registered" });
  }
);

router.get(
  "/github-callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: "/login",
  }),
  async (req, res) => {
    if (!req.user.cart) {
      const cart = await cartsManager.createCart();
      req.user.cart = cart._id.toString();
      await userManager.update(req.user.email, req.user);
      console.log("cart created");
    }

    const accessToken = generateToken(req.user);

    res
      .cookie("coderCookieToken", accessToken, {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
      })
      .redirect("/products");
  }
);

router.get("/current", passportCall("jwt"), async (req, res) => {
  res.send({ user: req.user });
});

export default router;
