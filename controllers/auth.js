const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  const isAuthenticated = req.session.isLoggedIn;
  res.render("auth/login", {
    pageTitle: "Login",
    active: "/login",
    isAuthenticated: isAuthenticated,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("650221d98cd9482ffd5836ee")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save(() => {
        res.redirect("/");
      });
    })
    .catch((error) => console.log(error));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
