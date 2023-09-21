exports.getLogin = (req, res, next) => {
  const isAuthenticated = req.session.isLoggedIn;
  res.render("auth/login", {
    pageTitle: "Login",
    active: "/login",
    isAuthenticated: isAuthenticated,
  });
};

exports.postLogin = (req, res, next) => {
  req.session.isLoggedIn = true;
  res.redirect("/");
};
