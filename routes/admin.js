const express = require("express");
const { body } = require("express-validator");

const isAuth = require("../middleware/is-auth");
const adminController = require("../controllers/admin");

const router = express.Router();

router.get("/add-product", isAuth, adminController.getAddProduct);

router.post(
  "/add-product",
  isAuth,
  [
    body("title", "The title must be between 6 and 30 characters long.")
      .isLength({ min: 6, max: 30 })
      .trim(),
    body("price", "Enter a valid money amount").isNumeric().trim(),
    body(
      "description",
      "Enter a description between 10 and 50 characters long."
    )
      .isLength({ min: 10, max: 50 })
      .trim(),
  ],
  adminController.postAddProduct
);

router.get("/products", isAuth, adminController.getAdminProducts);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post(
  "/edit-product",
  isAuth,
  [
    body("title", "The title must be between 6 and 30 characters long.")
      .isLength({ min: 6, max: 30 })
      .trim(),
    body("price", "Enter a valid money amount").isNumeric().trim(),
    body(
      "description",
      "Enter a description between 10 and 50 characters long."
    )
      .isLength({ min: 10, max: 50 })
      .trim(),
  ],
  adminController.postEditProduct
);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
