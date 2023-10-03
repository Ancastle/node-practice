const bcrypt = require("bcryptjs");
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

exports.postSignup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const newUser = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return newUser.save();
        })
        .then(() => {
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};
