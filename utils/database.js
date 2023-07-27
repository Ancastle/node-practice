// Sequelize
const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "mysqlpass", {
  dialect: "mysql",
  host: "localhost",
}); // DB, user, password, config object

module.exports = sequelize;
