import { generateId, validateId, writeInfo, readInfo } from "../../utils.js";

export default class ProductService {
  constructor(path) {
    this.path = path;
  }

  addProduct = async ({
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
    thumbnail = [],
  }) => {
    try {
      if (
        [title, description, code, price, status, stock, category].some(
          (element) =>
            element === undefined || element === null || element.length === 0
        )
      ) {
        throw new Error("Debe ingresar todos los argumentos");
      }

      const products = await this.getProducts();

      if (products.find((p) => p.code === code)) {
        throw new Error("Codigo duplicado!!!");
      }

      const product = {
        _id: generateId(products),
        title,
        description,
        price,
        status,
        thumbnail,
        code,
        stock,
        category,
      };

      products.push(product);

      await writeInfo(products, this.path);
      return { status: "success" };
    } catch (error) {
      console.log(`Error al agregar producto: ${error}`);
      return { status: "error", error };
    }
  };

  getProducts = async () => {
    try {
      let data = await readInfo(this.path);
      return JSON.parse(data);
    } catch (error) {
      console.log(`Error al obtener productos: ${error}`);
    }
  };

  getProductById = async (id) => {
    try {
      const products = await this.getProducts();
      const product = products.find((p) => p._id === id);

      if (product) return product;
      throw new Error(`No existe un producto con el id ${id}`);
    } catch (error) {
      console.log(`Error al obtener producto: ${error}`);
    }
  };

  updateProduct = async (id, product) => {
    try {
      const products = await this.getProducts();
      if (!validateId(id, products))
        throw new Error(`No existe un producto con el id ${id}`);

      if (Object.keys(product).some((k) => k === "_id")) delete product._id;

      const updateProducts = products.map((p) => {
        return p._id === id ? { ...p, ...product } : p;
      });

      await writeInfo(updateProducts, this.path);
      return { status: "success" };
    } catch (error) {
      console.log(`Error al actualizar producto: ${error}`);
      return { status: "error", error: error.message };
    }
  };

  deleteProduct = async (id) => {
    try {
      const products = await this.getProducts();
      if (!validateId(id, products))
        throw new Error(`No existe un producto con el id ${id}`);

      const filterProducts = products.filter((p) => p._id !== id);

      await writeInfo(filterProducts, this.path);
      return { status: "success" };
    } catch (error) {
      console.log(`Error al borrar producto: ${error}`);
      return { status: "error", error: error.message };
    }
  };
}
