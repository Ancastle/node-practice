const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add a New Game",
    active: "/admin/add-product",
    editing: false,
  });
};

exports.getEditProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findByPk(productId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit a Game",
        active: "/admin/edit-product",
        editing: true,
        product: product,
      });
    })
    .catch((error) => console.log(error));
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, imageUrl, description, price } = req.body;
  Product.findByPk(productId)
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

exports.deleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.findByPk(productId)
    .then((product) => {
      return product.destroy();
    })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((error) => console.log(error));
};

exports.postAddProduct = (req, res, next) => {
  const { title, price, imageUrl, description } = req.body;
  Product.create({
    title,
    price,
    imageUrl,
    description,
  })
    .then((_) => res.redirect("/"))
    .catch((error) => console.log(error));
};

exports.getAdminProducts = (req, res, next) => {
  Product.findAll()
    .then((products) =>
      res.render("admin/products", {
        pageTitle: "Admin Product List",
        active: "/admin/products",
        products: products,
      })
    )
    .catch((error) => console.log(error));
};
