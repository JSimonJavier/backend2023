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
      await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2))
      let productString = await fs.promises.readFile(this.path, "utf-8");

      let products = JSON.parse(productString);

      return products;
    } catch (err) {
      console.log(err);;
    }
  };

  getProductsById = async (idProduct) => {
    try {
      const productsString = await fs.promises.readFile(this.path, "utf-8");
      const products = JSON.parse(productsString)
      const getId = products.find((product) => product.id === idProduct);
      return getId;
    } catch (error) {
      console.log(error);;
    }
  };

  updateProduct = async (id, update) => {
    try {
      const productsString = await fs.promises.readFile(this.path, "utf-8");
      const products = JSON.parse(productsString)
      const index = products.findIndex(product => product.id === id);

      if (index === -1) {
        throw new Error("No se encuentra el id: " + id);
      }

      const updatedProduct = { ...products[index], ...update };
      products.splice(index, 1, updatedProduct);

      const data = JSON.stringify(products, null, 2);
      await fs.promises.writeFile(this.path, data);


    } catch (error) {
      console.log(error);;
    }
  };

  deleteProduct = async (id) => {
    try {
      const productsString = await fs.promises.readFile(this.path, "utf-8");
      const products = JSON.parse(productsString)
      const index = await products.findIndex((product) => product.id === id);

      if (index === -1) {
        throw new Error("no se encuentra el id " + id);
      }

      await products.splice(index, 1);
      const data = JSON.stringify(products, null, 2);
      await fs.promises.writeFile(this.path, data);
      return products
    } catch (error) {
      console.log(error);
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
  "Zapatillas",
  "Puma future 3.4",
  31000,
  "url",
  "puma101",
  10
);

async function manejoDeArchivos() {
  // getProducts 
  const allProducts = await productManager.getProducts()
  console.log(allProducts);

  // getProductByID
  const productById = await productManager.getProductsById(1)
  console.log(productById);

  //updatedProduct
  await productManager.updateProduct(3, {
    title: "Zapatillas",
    description: "Puma clasic",
    price: 41000,
    thumbnail: "url",
    code: "pumeas201",
    stock: 30,
  })

  //obtenemos el producto actualizado con getProductById
  await productManager.getProductsById(2).then((byId) => console.log(byId))

  //deleteProduct -> se borra el producto con id 1 y devuelve los otros productos
  const deleteProduct = await productManager.deleteProduct(3)
  console.log(deleteProduct);
}

manejoDeArchivos()

