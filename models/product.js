const fs = require("fs");
const path = require("path");
const rootPath = require("../utils/path");

const dataPath = path.join(rootPath, "data", "products.json");

const Cart = require("./cart");

const getProductsFromFile = (callBack) => {
  fs.readFile(dataPath, (error, fileContent) => {
    if (error) {
      callBack([]);
    } else {
      callBack(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (prod) => prod.id === this.id
        );
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(dataPath, JSON.stringify(updatedProducts), (error) => {
          console.log(error, "error");
        });
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(dataPath, JSON.stringify(products), (error) => {
          console.log(error, "error");
        });
      }
    });
  }

  static deleteById(productId) {
    getProductsFromFile((products) => {
      const product = products.find((prod) => prod.id === productId);
      const newProducts = products.filter((prod) => prod.id !== productId);
      if (product) {
        fs.writeFile(dataPath, JSON.stringify(newProducts), (error) => {
          if (!error) {
            Cart.deleteProduct(productId, product.price);
          }
        });
      }
    });
  }

  static fetchAll(callBack) {
    getProductsFromFile(callBack);
  }

  static findById(id, callBack) {
    getProductsFromFile((products) => {
      callBack(products.find((product) => product.id === id));
    });
  }
};
