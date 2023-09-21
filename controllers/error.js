exports.notFound = (req, res, next) => {
  let isAuthenticated;
  if (req.get("Cookie")) {
    isAuthenticated = req.get("Cookie").split("=")[1] === "true";
  } else {
    isAuthenticated = false;
  }

  res.status(404).render("404", {
    pageTitle: "Page Not Found",
    active: null,
    isAuthenticated: isAuthenticated,
  });
};
