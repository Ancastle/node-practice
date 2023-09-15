const Product = require("../models/product");
const User = require("../models/user");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        pageTitle: "Product List",
        active: "/products",
        products: products,
      });
    })
    .catch((error) => console.log(error));
};

exports.getHome = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/home", {
        pageTitle: "Welcome Home",
        active: "/",
        products: products,
      });
    })
    .catch((error) => console.log(error));
};

exports.getProduct = (req, res) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then((product) => {
      res.render("shop/product-detail", {
        pageTitle: product.title,
        active: "/products",
        product: product,
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user.populate("cart.items.productId").then((user) => {
    const products = user.cart.items;
    res.render("shop/cart", {
      pageTitle: "Your Cart",
      active: "/cart",
      products: products,
    });
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then(() => {
      res.redirect("/cart");
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  req.user
    .removeFromCart(productId)
    .finally(() => res.redirect("/cart"))
    .catch((err) => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkut",
    active: "/checkout",
  });
};

exports.getOrders = (req, res, next) => {
  req.user.getOrders().then((orders) => {
    res.render("shop/orders", {
      pageTitle: "My Orders",
      active: "/orders",
      orders: orders,
    });
  });
};

exports.createOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then(() => res.redirect("/orders"))
    .catch((error) => console.log(error));
};
