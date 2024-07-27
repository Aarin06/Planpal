export const isAuthenticated = function (req, res, next) {
  console.log("function is called");
  if (!req.user.id)
    return res.status(401).json({
      error: "You are not authenticated.",
    });
  next();
};
