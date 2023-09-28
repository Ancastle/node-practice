const Product = require("../models/product");

exports.postAddProduct = (req, res, next) => {
  const { title, price, imageUrl, description } = req.body;
  const user = req.session.user;
  const product = new Product({
    title,
    price,
    imageUrl,
    description,
    userId: user._id,
  });
  product
    .save()
    .then((_) => res.redirect("/"))
    .catch((error) => console.log(error));
};

exports.getAddProduct = (req, res, next) => {
  const isAuthenticated = req.session.isLoggedIn;
  res.render("admin/edit-product", {
    pageTitle: "Add a New Game",
    active: "/admin/add-product",
    editing: false,
    isAuthenticated: isAuthenticated,
  });
};

exports.getAdminProducts = (req, res, next) => {
  const isAuthenticated = req.session.isLoggedIn;
  Product.find()
    .then((products) =>
      res.render("admin/products", {
        pageTitle: "Admin Product List",
        active: "/admin/products",
        products: products,
        isAuthenticated: isAuthenticated,
      })
    )
    .catch((error) => console.log(error));
};

exports.getEditProduct = (req, res, next) => {
  const isAuthenticated = req.session.isLoggedIn;
  const productId = req.params.productId;
  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit a Game",
        active: "/admin/edit-product",
        editing: true,
        product: product,
        isAuthenticated: isAuthenticated,
      });
    })
    .catch((error) => console.log(error));
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, imageUrl, description, price } = req.body;
  Product.findById(productId)
    .then((product) => {
      product.title = title;
      product.imageUrl = imageUrl;
      product.description = description;
      product.price = price;
      return product.save();
    })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((error) => console.log(error));
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.findByIdAndRemove(productId)
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((error) => console.log(error));
};
