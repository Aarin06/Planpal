export const isAuthenticated = function (req, res, next) {
  if (!req.user.id)
    return res.status(401).json({
      error: "You are not authenticated.",
    });
  next();
};
