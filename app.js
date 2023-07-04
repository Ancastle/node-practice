const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const expressHandlebars = require("express-handlebars");

const app = express();

app.set("view engine", "ejs");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/admin", adminData.routes);

app.use(shopRoutes);

// HTML
// app.use((req, res, next) => {
//   res.status(404).sendFile(path.join(__dirname, "views", "not-found.html"));
// });

app.use((req, res, next) => {
  res
    .status(404)
    .render("not-found", { pageTitle: "Page Not Found", active: null });
});

app.listen(3000);
