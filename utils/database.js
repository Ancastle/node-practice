// MySQL
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost", // running locally
  user: "root", // default in the configuration process
  database: "node-complete", // servers normally have multiple db's
  password: "intuitivemysql", // assigned in the configuration process
});

module.exports = pool.promise(); // this allow us to use promises when working with the pool
