exports.notFound = (req, res, next) => {
  const isAuthenticated = req.session.isLoggedIn;
  res.status(404).render("404", {
    pageTitle: "Page Not Found",
    active: null,
  });
};
