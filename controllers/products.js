const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("add-product", {
    pageTitle: "Add a New Game",
    active: "add-product",
  });
};

exports.postAddProduct = (req, res, next) => {
  const newProduct = new Product(req.body.title);
  newProduct.save();
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) =>
    res.render("shop", {
      pageTitle: "Shop Page",
      active: "home",
      products: products,
    })
  );
};
