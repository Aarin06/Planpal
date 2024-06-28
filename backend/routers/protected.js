import { Router } from "express";

export const protectedRouter = Router();

protectedRouter.get("/", (req, res, next) => {
  console.log("okokok");
  console.log("jacky",req.user);
  // res.send(`Hello ${req.user.displayName}`);
  res.redirect("http://localhost:4200/");
  // next()
});
