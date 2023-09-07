const Product = require("../models/product");

exports.getHome = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/home", {
        pageTitle: "Welcome Home",
        active: "/",
        products: products,
      });
    })
    .catch((error) => console.log(error));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts().then((products) =>
        res.render("shop/cart", {
          pageTitle: "Your Cart",
          active: "/cart",
          products: products,
        })
      );
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) product = products[0];
      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => res.redirect("/cart"))
    .catch((err) => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: productId } });
      // get the product with it's association to the cart (cartItem)
    })
    .then((products) => {
      const product = products[0];
      product.cartItem.destroy();
      // destroy the association of the cart to the product
    })
    .finally(() => res.redirect("/cart"))
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/product-list", {
        pageTitle: "Product List",
        active: "/products",
        products: products,
      });
    })
    .catch((error) => console.log(error));
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkut",
    active: "/checkout",
  });
};

exports.getOrders = (req, res, next) => {
  req.user.getOrders({ include: ["products"] }).then((orders) => {
    // we need to use include products so sequelize adds a products key to each order with all the orderItems listed
    // each product will have its own orderItem key which holds the orderItem table information
    res.render("shop/orders", {
      pageTitle: "My Orders",
      active: "/orders",
      orders: orders,
    });
  });
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findByPk(productId)
    .then((product) => {
      res.render("shop/product-detail", {
        pageTitle: product.title,
        active: "/products",
        product: product,
      });
    })
    .catch((err) => console.log(err));
};

exports.createOrder = (req, res, next) => {
  let fetchedCart;
  req.user.getCart().then((cart) => {
    fetchedCart = cart;
    cart
      .getProducts()
      .then((products) => {
        req.user.createOrder().then((order) =>
          order.addProducts(
            products.map((product) => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          )
        );
      })
      .then(() => {
        fetchedCart.setProducts(null);
      })
      .then(() => res.redirect("/orders"))
      .catch((error) => console.log(error));
  });
};
