const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const sequelize = require("./utils/database");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use("/admin", adminRoutes);

app.use(shopRoutes);

app.use(errorController.notFound);

sequelize
  .sync()
  .then((_) => {
    app.listen(3000);
  })
  .catch((error) => console.log(error));
