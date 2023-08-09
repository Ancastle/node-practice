const Squelize = require("sequelize");

const sequelize = require("../utils/database");

const Cart = sequelize.define("cart", {
  id: {
    type: Squelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = Cart;
