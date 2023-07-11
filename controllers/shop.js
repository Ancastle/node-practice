const Product = require("../models/product");

exports.getHome = (req, res, next) => {
  Product.fetchAll((products) =>
    res.render("shop/home", {
      pageTitle: "Welcome Home",
      active: "/",
      products: products,
    })
  );
};

exports.getCart = (req, res, next) => {
  res.render("shop/cart", {
    pageTitle: "Your Cart",
    active: "/cart",
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) =>
    res.render("shop/product-list", {
      pageTitle: "Product List",
      active: "/products",
      products: products,
    })
  );
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkut",
    active: "/checkout",
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    pageTitle: "My Orders",
    active: "/orders",
  });
};
