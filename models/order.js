const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

// an order is a commited Cart, basically
const Order = sequelize.define("order", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = Order;
