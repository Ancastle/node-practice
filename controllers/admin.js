const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add a New Game",
    active: "add-product",
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, description, price } = req.body;
  const newProduct = new Product(title, imageUrl, description, price);
  newProduct.save();
  res.redirect("/");
};

exports.getAdminProducts = (req, res, next) => {
  Product.fetchAll((products) =>
    res.render("admin/products", {
      pageTitle: "Admin Product List",
      active: "/admin/products",
      products: products,
    })
  );
};
