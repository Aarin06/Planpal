export const isAuthenticated = function (req, res, next) {
  if (!req.session.userId)
    return res.status(401).json({
      error: "You are not authenticated.",
    });
  next();
};
