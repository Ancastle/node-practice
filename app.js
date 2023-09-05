const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const sequelize = require("./utils/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((error) => console.log(error));
});

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use("/admin", adminRoutes);

app.use(shopRoutes);

app.use(errorController.notFound);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User); // optional
Cart.belongsToMany(Product, { through: CartItem }); // using the through key to let Sequelize know when to store this relation
Product.belongsToMany(Cart, { through: CartItem });

Order.belongsTo(User); // Users have orders
User.hasMany(Order); // Orders have one User
Order.belongsToMany(Product, { through: OrderItem });

sequelize
  .sync()
  .then((_) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "Jorge", email: "test@test.com" });
    }
    return user;
  })
  .then((user) => {
    user.getCart().then((cart) => {
      if (!cart) {
        user.createCart();
      }
    });
  })
  .then(() => {
    app.listen(3000);
  })
  .catch((error) => console.log(error));
