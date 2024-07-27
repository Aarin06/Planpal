export function isLoggedIn(req, res, next) {
  req.user ? next() : res.status(401).json({ error: "Something went wrong" });
}
