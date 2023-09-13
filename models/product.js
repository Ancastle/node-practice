const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model("Product", productSchema);

// const mongodb = require("mongodb");
// const getDb = require("../utils/database").getDb;

// class Product {
//   constructor(title, price, imageUrl, description, id, userId) {
//     this.title = title;
//     this.price = price;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this._id = id ? new mongodb.ObjectId(id) : null;
//     this.userId = userId;
//   }

//   save() {
//     const db = getDb();
//     let dbOp;
//     if (this._id) {
//       dbOp = db
//         .collection("products")
//         .updateOne({ _id: this._id }, { $set: this });
//     } else {
//       dbOp = db.collection("products").insertOne(this);
//     }

//     return dbOp.then().catch((err) => console.log(err));
//   }

//   // static means this method belongs to the class, not an instance
//   static fetchAll() {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find()
//       .toArray()
//       .then((products) => {
//         return products;
//       })
//       .catch((err) => console.log(err));
//   }

//   static findById(productId) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find({ _id: new mongodb.ObjectId(productId) })
//       .next()
//       .then((product) => {
//         return product;
//       })
//       .catch((err) => console.log(err));
//   }

//   static deleteById(productId) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .deleteOne({
//         _id: new mongodb.ObjectId(productId),
//       })
//       .then(() => {
//         console.log("deleted product");
//       })
//       .catch((err) => console.log(err));
//   }
// }

// module.exports = Product;
