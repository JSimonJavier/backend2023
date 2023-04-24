//manejo de archivos - desafio entregable
const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.id = 0;
  }

  //? agregando productos
  addProduct = async (title, description, price, thumbnail, code, stock) => {
    if (!title && !description && !price && !thumbnail && !stock && !code) {
      console.error("Le falto agregar un dato del producto");
      return;
    }

    const codes = this.products.map((product) => product.code);

    if (codes.includes(code)) {
      console.error(`Codigo existente ${code}`);
      return;
    }

    this.products.push({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      id: ++this.id,
    });

    await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
    return this.products;
  };

  getProducts = async () => {
    try {
      let productString = await fs.promises.readFile(this.path, "utf-8");
      let products = JSON.parse(productString);
      console.log(products);
      return products;
    } catch (err) {
      throw err;
    }
  };

  getProductsById = async (idProduct) => {
    try {
      const products = await this.getProducts();
      const getId = products.find((product) => product.id === idProduct);
      console.log(getId);
      return getId;
    } catch (error) {
      throw error;
    }
  };

  updateProduct = async (id, update) => {
    try {
      const products = await this.getProducts();
      const index = products.findIndex(product => product.id === id);

      if (index === -1) {
        throw new error("No se encuentra el id: " + id);
      }

      const updatedProduct = { ...products[index], ...update };
      products.splice(index, 1, updatedProduct);

      const data = JSON.stringify(products, null, 2);
      await fs.promises.writeFile(this.path, data);

    } catch (err) {
      throw err;
    }
  };

  deleteProduct = async (id) => {
    try {
      const products = await this.getProducts();
      const index = products.findIndex((product) => product.id === id);

      if (index === -1) {
        throw new error("no se encuentra el id " + id);
      }

      products.splice(index, 1);
      const data = JSON.stringify(products, null, 2);
      await fs.promises.writeFile(this.path, data);
    } catch (err) {
      console.log(err);
    }
  };
}

const productManager = new ProductManager("productos.json");

productManager.addProduct(
  "Botines",
  "Adidas SpeedPortal .3",
  34000,
  "url",
  "adidas201",
  25
);
productManager.addProduct(
  "Botines",
  "Nike Tiempo",
  41000,
  "url",
  "nike301",
  15
);
productManager.addProduct(
  "Botines",
  "Puma future 3.4",
  31000,
  "url",
  "puma101",
  10
);

const getAllProducts = productManager.getProducts()

console.log(getAllProducts);

const getProductID = productManager.getProductsById(1);

console.log(getProductID);


const updatedProduct = productManager.updateProduct(2, {
  title: "Zapatillas",
  description: "Puma clasic",
  price: 41000,
  thumbnail: "url",
  code: "pumeas201",
  stock: 30,
});

console.log(updatedProduct);

const deleteProducto = productManager.deleteProduct(3);

console.log(deleteProducto);
