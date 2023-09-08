const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

let _db; // holds the connection to the database

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://janaya0625:sAbmihQIpJxQDbrK@cluster0.rzdlri4.mongodb.net/shop?retryWrites=true&w=majority"
  )
    .then((client) => {
      console.log("connected");
      _db = client.db();
      callback(client);
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found";
};

exports.mongoConnect = mongoConnect;

exports.getDb = getDb;
