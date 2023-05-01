//manejo de archivos - desafio entregable
const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  addProduct = async (product) => {
    try {
      let data = await this.getProducts();

      if (
        !product.title ||
        !product.description ||
        !product.price ||
        !product.thumbnail ||
        !product.stock ||
        !product.code
      ) {
        return "Falto un dato";
      }

      const codes = data.map((product) => product.code);

      if (codes.includes(product.code)) {
        return `Codigo existente ${product.code}`;
      }

      const id = data.length > 0 ? data[data.length - 1].id + 1 : 1;
      const add_product = { id, ...product };

      data.push(add_product);

      await fs.promises.writeFile(this.path, JSON.stringify(data, null, 2));

      return add_product;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  getProducts = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(data);
      }

      await fs.promises.writeFile(this.path, JSON.stringify([]));
      return [];
    } catch (error) {
      throw new Error(error.message);
    }
  };

  getProductsById = async (id) => {
    try {
      let data = await this.getProducts();
      const product_id = data.find((product) => product.id === id);

      if (!product_id) {
        throw new Error("producto inexistente");
      }

      return product_id;
    } catch (error) {
      throw new Error(error);
    }
  };

  updateProduct = async (id, update) => {
    try {
      let data = await this.getProducts();
      const index = data.findIndex((product) => product.id === id);

      if (index === -1) {
        throw new Error(
          "No se encuentra el producto a acutalizar con id: " + id
        );
      }

      data[index] = { ...data[index], ...update };

      await fs.promises.writeFile(this.path, JSON.stringify(data, null, 2));
      return "producto actualizado";
    } catch (error) {
      throw new Error(error);
    }
  };

  deleteProduct = async (id) => {
    try {
      let data = await this.getProducts();
      const index = data.findIndex((product) => product.id === id);

      if (index === -1) {
        throw new Error("no se encuentra el id " + id);
      }

      data.splice(index, 1);
      await fs.promises.writeFile(this.path, JSON.stringify(data, null, 2));

      return "producto eliminado";
    } catch (error) {
      throw new Error(error);
    }
  };
}

const productManager = new ProductManager("./src/files.json");

const adidas = {
  title: "Botines",
  description: "Adidas SpeedPortal .3",
  price: 34000,
  thumbnail: "url",
  code: "adidas201",
  stock: 25,
};
const nike = {
  title: "Botines",
  description: "Nike Tiempo",
  price: 41000,
  thumbnail: "url",
  code: "nike301",
  stock: 15,
};
const puma = {
  title: "Zapatillas",
  description: "Puma future 3.4",
  price: 31000,
  thumbnail: "url",
  code: "puma101",
  stock: 10,
};

const asyncFn = async () => {
  await productManager.addProduct(adidas);
  await productManager.addProduct(nike);
  await productManager.addProduct(puma);

  const all = await productManager.getProducts()
  console.log(all);

  const product_id = await productManager.getProductsById(2)
  console.log(product_id);

  const product_update = await productManager.updateProduct(2, {
    price: 55000
  })
  console.log(product_update);

  // const product_delete = await productManager.deleteProduct(1)
  // console.log(product_delete);
};

asyncFn();

module.exports = ProductManager;
