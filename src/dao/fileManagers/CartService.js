import { generateId, readInfo, writeInfo } from "../../utils.js";

export default class CartService {
  constructor(path) {
    this.path = path;
  }

  createCart = async () => {
    try {
      const data = await readInfo(this.path);
      const carts = JSON.parse(data);
      const cart = { _id: generateId(carts), products: [] };
      carts.push(cart);
      await writeInfo(carts, this.path);
      return { status: "success" };
    } catch (error) {
      console.log(error);
      return { status: "error", error: error.message };
    }
  };

  getCart = async (cid) => {
    try {
      const data = await readInfo(this.path);
      const carts = JSON.parse(data);
      return carts.find((c) => c._id === Number(cid));
    } catch (error) {
      console.log(error);
    }
  };

  addProduct = async (cid, pid) => {
    try {
      const data = await readInfo(this.path);
      const carts = JSON.parse(data);
      const newCarts = carts.map((c) => {
        if (c._id === Number(cid)) {
          const index = c.products.findIndex((p) => p.product === Number(pid));
          if (index === -1) {
            c.products.push({ product: Number(pid), quantity: 1 });
            return c;
          }
          c.products[index].quantity++;
        }
        return c;
      });

      await writeInfo(newCarts, this.path);
      return { status: "success" };
    } catch (error) {
      console.log(error);
    }
  };
}
