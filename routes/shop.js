const express = require("express");
const path = require("path");
const rootDir = require("../utils/path");
const adminData = require("./admin");

const router = express.Router();

router.get("/", (req, res, next) => {
  const products = adminData.products;
  res.render("shop", {
    pageTitle: "Shop Page",
    active: "home",
    products: products,
    hasProducts: products.length > 0,
    activeShop: true,
    activeAddProduct: false,
    productCSS: true,
  });
});

// HTML
// router.get("/", (req, res, next) => {
//   res.sendFile(path.join(rootDir, "views", "shop.html"));
// });

module.exports = router;
