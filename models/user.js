const mongodb = require("mongodb");
const getDb = require("../utils/database").getDb;

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart;
    this._id = id ? new mongodb.ObjectId(id) : null;
  }

  save() {
    const db = getDb();
    db.collection("users")
      .insertOne(this)
      .then()
      .catch((err) => console.log(err));
  }

  addToCart(product) {
    const db = getDb();

    const cartProductIndex = this.cart.items.findIndex((item) => {
      return item.productId.toString() === product._id.toString();
    });

    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex > -1) {
      updatedCartItems[cartProductIndex].quantity += 1;
    } else {
      updatedCartItems.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: 1,
      });
    }
    const updatedCart = {
      items: updatedCartItems,
    };
    return db
      .collection("users")
      .updateOne({ _id: this._id }, { $set: { cart: updatedCart } })
      .then()
      .catch((err) => console.log(err));
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map((item) => item.productId);
    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        return products.map((product) => {
          return {
            ...product,
            quantity: this.cart.items.find(
              (item) => item.productId.toString() === product._id.toString()
            ).quantity,
          };
        });
      });
  }

  deleteFromCart(productId) {
    const db = getDb();
    const updatedCart = this.cart.items.filter(
      (item) => item.productId.toString() !== productId.toString()
    );
    return db
      .collection("users")
      .updateOne({ _id: this._id }, { $set: { cart: { items: updatedCart } } })
      .then()
      .catch((err) => console.log(err));
  }

  addOrder() {
    const db = getDb();
    return this.getCart()
      .then((products) => {
        const order = {
          items: products,
          user: {
            _id: new mongodb.ObjectId(this._id),
            name: this.name,
          },
        };
        return db.collection("orders").insertOne(order);
      })
      .then(() => {
        this.cart = { items: [] };
        return db
          .collection("users")
          .updateOne({ _id: this._id }, { $set: { cart: { items: [] } } });
      });
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new mongodb.ObjectId(userId) })
      .then((user) => {
        return user;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = User;
