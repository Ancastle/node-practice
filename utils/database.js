// Sequelize
const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "intuitivemysql", {
  dialect: "mysql",
  host: "localhost",
}); // DB, user, password, config object

module.exports = sequelize;
