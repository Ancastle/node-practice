const fs = require("fs");
const path = require("path");
const rootPath = require("../utils/path");

const dataPath = path.join(rootPath, "data", "cart.json");

module.exports = class Cart {
  static addProduct(productId, productPrice) {
    fs.readFile(dataPath, (error, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!error) {
        try {
          cart = JSON.parse(fileContent);
        } catch {
          cart = { products: [], totalPrice: 0 };
        }
      }
      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === productId
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: productId, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = parseInt(cart.totalPrice) + parseInt(productPrice);
      fs.writeFile(dataPath, JSON.stringify(cart), (err) => {
        console.log(err, "error");
      });
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(dataPath, (err, fileContent) => {
      if (err) return;
      const cart = JSON.parse(fileContent);
      const updatedCart = { ...cart };
      const product = updatedCart.products.find((prod) => prod.id === id);
      updatedCart.products = updatedCart.products.filter(
        (prod) => prod.id !== id
      );
      updatedCart.totalPrice = cart.totalPrice - productPrice * product.qty;
      fs.writeFile(dataPath, JSON.stringify(updatedCart), (err) => {
        console.log(err, "error");
      });
    });
  }

  static getCart(callBack) {
    fs.readFile(dataPath, (error, fileContent) => {
      const cart = JSON.parse(fileContent);
      if (error) {
        callBack(null);
      }
      callBack(cart);
    });
  }
};
