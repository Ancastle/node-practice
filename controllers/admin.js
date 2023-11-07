const Product = require("../models/product");
const { validationResult } = require("express-validator");
const fileHelper = require("../utils/file");

exports.postAddProduct = (req, res, next) => {
  const { title, price, description } = req.body;
  const image = req.file;
  const user = req.user;
  if (!image) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add a new Product",
      active: "/admin/edit-product",
      editing: false,
      errorMessage: "The attached file is not an image.",
      oldInput: {
        title,
        price,
        description,
      },
    });
  }

  const imageUrl = image.path;
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
        price,
        description,
      },
    });
  }
  product
    .save()
    .then((_) => res.redirect("/"))
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add a New Game",
    active: "/admin/add-product",
    editing: false,
    errorMessage: "",
    oldInput: {
      title: "",
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
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
          price: "",
          description: "",
        },
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, description, price } = req.body;
  const image = req.file;
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
        price,
        description,
      },
      oldInput: {
        title,
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
      product.description = description;
      product.price = price;
      if (image) {
        fileHelper.deleteFile(product.imageUrl);
        product.imageUrl = image.path;
      }
      return product.save().then(() => {
        res.redirect("/admin/products");
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.deleteProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return next(new Error("Product not found!"));
      }
      fileHelper.deleteFile(product.imageUrl);
      return Product.deleteOne({ _id: productId, userId: req.user._id });
    })
    .then(() => {
      res.status(200).json({ message: "Success!" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Deleting product failed." });
    });
};
