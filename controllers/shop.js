const Product = require("../models/product");
const Cart = require("../models/cart");

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
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (product of products) {
        const productOfCart = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (productOfCart) {
          cartProducts.push({
            productData: product,
            qty: productOfCart.qty,
          });
        }
      }
      res.render("shop/cart", {
        pageTitle: "Your Cart",
        active: "/cart",
        products: cartProducts,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId, (product) => {
    Cart.addProduct(productId, product.price);
  });
  res.redirect("/cart");
};

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId, (product) => {
    Cart.deleteProduct(productId, product.price);
    res.redirect("/cart");
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

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId, (product) =>
    res.render("shop/product-detail", {
      pageTitle: "Product Details",
      active: "/products",
      product: product,
    })
  );
};
