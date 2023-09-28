const Product = require("../models/product");
const Order = require("../models/order");
const User = require("../models/user");

exports.getProducts = (req, res, next) => {
  const isAuthenticated = req.session.isLoggedIn;
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        pageTitle: "Product List",
        active: "/products",
        products: products,
        isAuthenticated: isAuthenticated,
      });
    })
    .catch((error) => console.log(error));
};

exports.getHome = (req, res, next) => {
  const isAuthenticated = req.session.isLoggedIn;
  Product.find()
    .then((products) => {
      res.render("shop/home", {
        pageTitle: "Welcome Home",
        active: "/",
        products: products,
        isAuthenticated: isAuthenticated,
      });
    })
    .catch((error) => console.log(error));
};

exports.getProduct = (req, res) => {
  const isAuthenticated = req.session.isLoggedIn;
  const productId = req.params.productId;
  Product.findById(productId)
    .then((product) => {
      res.render("shop/product-detail", {
        pageTitle: product.title,
        active: "/products",
        product: product,
        isAuthenticated: isAuthenticated,
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  const isAuthenticated = req.session.isLoggedIn;
  User.findById(req.session.user._id)
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        pageTitle: "Your Cart",
        active: "/cart",
        products: products,
        isAuthenticated: isAuthenticated,
      });
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let product;
  Product.findById(prodId)
    .then((p) => {
      product = p;
      return User.findById(req.session.user._id);
    })
    .then((user) => {
      return user.addToCart(product);
    })
    .then(() => {
      res.redirect("/cart");
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  User.findById(req.session.user._id)
    .removeFromCart(productId)
    .finally(() => res.redirect("/cart"))
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  const isAuthenticated = req.session.isLoggedIn;
  Order.find({ userId: req.session.user._id }).then((orders) => {
    res.render("shop/orders", {
      pageTitle: "My Orders",
      active: "/orders",
      orders: orders,
      isAuthenticated: isAuthenticated,
    });
  });
};

exports.createOrder = async (req, res, next) => {
  const isAuthenticated = req.session.isLoggedIn;
  const user = await User.findById(req.session.user._id).populate(
    "cart.items.productId"
  );
  const products = user.cart.items.map((item) => {
    return {
      productId: item.productId._id,
      title: item.productId.title,
      quantity: item.quantity,
    };
  });
  const order = new Order({
    userId: req.session.user._id,
    items: products,
  });

  await order.save();
  await User.findById(req.session.user._id).clearCart();
  const orders = await Order.find();

  res.render("shop/orders", {
    pageTitle: "My Orders",
    active: "/orders",
    orders: orders,
    isAuthenticated: isAuthenticated,
  });
};
