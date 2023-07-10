const fs = require("fs");
const path = require("path");
const rootPath = require("../utils/path");

module.exports = class Product {
  constructor(title) {
    this.title = title;
  }

  save() {
    const dataPath = path.join(rootPath, "data", "products.json");
    fs.readFile(dataPath, (error, fileContent) => {
      let products = [];
      if (!error) {
        products = JSON.parse(fileContent);
      }
      products.push(this);
      fs.writeFile(dataPath, JSON.stringify(products), (error) => {
        console.log(error);
      });
    });
  }

  static fetchAll(callback) {
    const dataPath = path.join(rootPath, "data", "products.json");
    fs.readFile(dataPath, (error, fileContent) => {
      if (error) {
        callback([]);
      }
      callback(JSON.parse(fileContent));
    });
  }
};
