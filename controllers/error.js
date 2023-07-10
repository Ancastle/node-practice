exports.notFound = (req, res, next) => {
  res
    .status(404)
    .render("not-found", { pageTitle: "Page Not Found", active: null });
};
