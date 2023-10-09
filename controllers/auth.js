const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const User = require("../models/user");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "janaya0625@gmail.com",
    pass: "suqh rzvo pnzr beqq",
  },
});

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    active: "/login",
    errorMessage: req.flash("error")[0],
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password.");
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(() => {
              res.redirect("/");
            });
          }
          req.flash("error", "Invalid email or password.");
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
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
  res.render("auth/signup", {
    pageTitle: "Sign Up",
    active: "/signup",
    errorMessage: req.flash("error")[0],
  });
};

exports.postSignup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        req.flash("error", "Email already exists.");
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
          return transporter.sendMail({
            to: email,
            from: "janaya0625@gmail.com",
            subject: "heyyy good job",
            html: "<h1>GOOD JOB</h1>",
          });
        });
    })
    .catch((err) => console.log(err));
};

exports.getReset = (req, res, next) => {
  res.render("auth/reset", {
    active: "/reset",
    pageTitle: "Reset Password",
    errorMessage: req.flash("error")[0],
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (error, buffer) => {
    if (error) res.redirect("/reset");
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found.");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(() => {
        transporter.sendMail({
          to: req.body.email,
          from: "janaya0625@gmail.com",
          subject: "Password Reset",
          html: `<p>You requested a password reset</p>
          <p>Click <a href="http://localhost:3000/reset/${token}">this</a> to reset your password.`,
        });
      })
      .catch((err) => console.log(err));
  });
};
