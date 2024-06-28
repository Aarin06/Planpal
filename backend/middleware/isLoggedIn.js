export function isLoggedIn(req, res, next) {
  console.log("in middle ware");
  console.log("aarin",req.user);
  req.user ? next() : res.status(401).json({ error: "Something went wrong" });
}
