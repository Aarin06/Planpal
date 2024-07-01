import { Router } from "express";

export const protectedRouter = Router();

protectedRouter.get("/", (req, res, next) => {
  // res.send(`Hello ${req.user.displayName}`);
  console.log("confirmed login")
  console.log(`Hello ${req.user}`)
  res.redirect("http://localhost:4200/");
  // next()
});
