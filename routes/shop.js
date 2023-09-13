const express = require("express");

const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/products", shopController.getProducts);

router.get("/", shopController.getHome);

router.get("/products/:productId", shopController.getProduct);

// router.get("/cart", shopController.getCart);

// router.post("/cart", shopController.postCart);

// router.post("/cart-delete-item", shopController.postCartDeleteProduct);

// router.post("/create-order", shopController.createOrder);

// router.get("/checkout", shopController.getCheckout);

// router.get("/orders", shopController.getOrders);

module.exports = router;
