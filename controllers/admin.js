const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add a New Game",
    active: "/admin/add-product",
    editing: false,
  });
};

exports.getEditProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId, (product) => {
    res.render("admin/edit-product", {
      pageTitle: "Edit a Game",
      active: "/admin/edit-product",
      editing: true,
      product: product,
    });
  });
};

exports.updateProduct = (req, res, next) => {
  const { id, title, imageUrl, description, price } = req.body;
  const updatedProduct = new Product(id, title, imageUrl, description, price);
  updatedProduct.save();
  res.redirect("/admin/products");
};

exports.deleteProduct = (req, res, next) => {
  const productId = req.body.id;
  Product.deleteById(productId, () => res.redirect("/admin/products"));
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, description, price } = req.body;
  const newProduct = new Product(null, title, imageUrl, description, price);
  newProduct
    .save()
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
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
