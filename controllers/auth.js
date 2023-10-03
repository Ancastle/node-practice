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

exports.getSignup = (req, res, next) => {
  const isAuthenticated = req.session.isLoggedIn;
  res.render("auth/signup", {
    pageTitle: "Sign Up",
    active: "/signup",
    isAuthenticated: isAuthenticated,
  });
};

exports.postSignup = (req, res, next) => {};
