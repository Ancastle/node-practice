const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongodbStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");

const errorController = require("./controllers/error");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const User = require("./models/user");

const MONGODB_URI =
  "mongodb+srv://janaya0625:sAbmihQIpJxQDbrK@cluster0.rzdlri4.mongodb.net/shop?retryWrites=true&w=majority";

const app = express();
const store = new MongodbStore({
  uri: MONGODB_URI,
  collection: "sessions",
});
const csrfProtection = csrf();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
//must be used after the session initialization
app.use(csrfProtection);

app.use((req, res, next) => {
  const userId = req.session.user && req.session.user._id;
  if (userId) {
    User.findById(req.session.user._id)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((error) => console.log(error));
  } else {
    req.user = null;
    next();
  }
});
// setting up res.locals variables
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", adminRoutes);

app.use(shopRoutes);

app.use(authRoutes);

app.use(errorController.notFound);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
