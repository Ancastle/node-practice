const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const db = require("./utils/database");
const errorController = require("./controllers/error");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

db.execute("SELECT * FROM products")
  .then((result) => {
    console.log(result[0], result[1]);
    // The first item will be an array or the records of the table
    // The second item will be a configuration object of the table
  })
  .catch((error) => console.log(error));

app.use("/admin", adminRoutes);

app.use(shopRoutes);

app.use(errorController.notFound);

app.listen(3000);
