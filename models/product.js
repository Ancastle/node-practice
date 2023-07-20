const fs = require("fs");
const path = require("path");
const rootPath = require("../utils/path");

const dataPath = path.join(rootPath, "data", "products.json");

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
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this.id = Math.random().toString();
  }

  save() {
    getProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(dataPath, JSON.stringify(products), (error) => {
        console.log(error, "error");
      });
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
