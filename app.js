const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const errorController = require("./controllers/error");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("650221d98cd9482ffd5836ee")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((error) => console.log(error));
});

app.use("/admin", adminRoutes);

app.use(shopRoutes);

app.use(authRoutes);

app.use(errorController.notFound);

mongoose
  .connect(
    "mongodb+srv://janaya0625:sAbmihQIpJxQDbrK@cluster0.rzdlri4.mongodb.net/shop?retryWrites=true&w=majority"
  )
  .then(() => {
    // const user = new User({
    //   name: "Jorge",
    //   email: "diossexual@hotmail.com",
    //   cart: { items: [] },
    // });
    // user.save();
    app.listen(3000);
  })
  .catch((err) => console.log(err));
