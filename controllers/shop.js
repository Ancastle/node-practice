const Product = require("../models/product");
const Order = require("../models/order");

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

exports.getOrders = (req, res, next) => {
  Order.find({ userId: req.user._id }).then((orders) => {
    res.render("shop/orders", {
      pageTitle: "My Orders",
      active: "/orders",
      orders: orders,
    });
  });
};

exports.createOrder = async (req, res, next) => {
  const user = await req.user.populate("cart.items.productId");
  const products = user.cart.items.map((item) => {
    return {
      productId: item.productId._id,
      title: item.productId.title,
      quantity: item.quantity,
    };
  });
  const order = new Order({
    userId: req.user._id,
    items: products,
  });

  await order.save();
  await req.user.clearCart();
  const orders = await Order.find();

  res.render("shop/orders", {
    pageTitle: "My Orders",
    active: "/orders",
    orders: orders,
  });
};
