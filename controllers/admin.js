const Product = require("../models/product");
const { validationResult } = require("express-validator");

exports.postAddProduct = (req, res, next) => {
  const { title, price, imageUrl, description } = req.body;
  const user = req.user;
  const product = new Product({
    title,
    price,
    imageUrl,
    description,
    userId: user._id,
  });
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add a new Product",
      active: "/admin/edit-product",
      editing: false,
      errorMessage: errors.array()[0].msg,
      oldInput: {
        title,
        imageUrl,
        price,
        description,
      },
    });
  }
  product
    .save()
    .then((_) => res.redirect("/"))
    .catch((error) => console.log(error));
};

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add a New Game",
    active: "/admin/add-product",
    editing: false,
    errorMessage: "",
    oldInput: {
      title: "",
      imageUrl: "",
      price: "",
      description: "",
    },
  });
};

exports.getAdminProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .then((products) =>
      res.render("admin/products", {
        pageTitle: "Admin Product List",
        active: "/admin/products",
        products: products,
      })
    )
    .catch((error) => console.log(error));
};

exports.getEditProduct = (req, res, next) => {
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
        errorMessage: "",
        oldInput: {
          title: "",
          imageUrl: "",
          price: "",
          description: "",
        },
      });
    })
    .catch((error) => console.log(error));
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, imageUrl, description, price } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      active: "/admin/edit-product",
      editing: true,
      errorMessage: errors.array()[0].msg,
      product: {
        _id: productId,
        title,
        imageUrl,
        price,
        description,
      },
      oldInput: {
        title,
        imageUrl,
        price,
        description,
      },
    });
  }

  Product.findById(productId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = title;
      product.imageUrl = imageUrl;
      product.description = description;
      product.price = price;
      return product.save().then(() => {
        res.redirect("/admin/products");
      });
    })
    .catch((error) => console.log(error));
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.deleteOne({ _id: productId, userId: req.user._id })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((error) => console.log(error));
};
