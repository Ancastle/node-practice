const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const mongoConnect = require("./utils/database");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// app.use((req, res, next) => {
//   User.findByPk(1)
//     .then((user) => {
//       req.user = user;
//       next();
//     })
//     .catch((error) => console.log(error));
// });

// const adminRoutes = require("./routes/admin");
// const shopRoutes = require("./routes/shop");

// app.use("/admin", adminRoutes);

// app.use(shopRoutes);

// app.use(errorController.notFound);

mongoConnect((client) => {
  console.log(client);
  app.listen(3000);
});
