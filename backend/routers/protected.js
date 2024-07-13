import { Router } from "express";

export const protectedRouter = Router();

protectedRouter.get("/", (req, res, next) => {
  // res.send(`Hello ${req.user.displayName}`);
  res.redirect("http://localhost:4200/");
  // next()
});
