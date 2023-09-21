exports.getLogin = (req, res, next) => {
  let isAuthenticated;
  if (req.get("Cookie")) {
    isAuthenticated = req.get("Cookie").split("=")[1] === "true";
  } else {
    isAuthenticated = false;
  }
  res.render("auth/login", {
    pageTitle: "Login",
    active: "/login",
    isAuthenticated: isAuthenticated,
  });
};

exports.postLogin = (req, res, next) => {
  req.session.isLoggedIn = true;
  res.setHeader("Set-Cookie", "loggedIn=true; Max-Age=10");
  res.redirect("/");
};
