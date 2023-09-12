const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const errorController = require("./controllers/error");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("64ff5d6c3e3d2701c551f5bb")
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      // we need to create a new User object so we can use it's methods and not only
      // the plain data from the database
      next();
    })
    .catch((error) => console.log(error));
});

app.use("/admin", adminRoutes);

app.use(shopRoutes);

app.use(errorController.notFound);

mongoose
  .connect(
    "mongodb+srv://janaya0625:sAbmihQIpJxQDbrK@cluster0.rzdlri4.mongodb.net/shop?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
