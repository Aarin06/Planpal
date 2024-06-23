import { Router } from "express";

export const protectedRouter = Router()

protectedRouter.get('/', (req, res) => {
  console.log("okokok")
  res.send(`Hello ${req.user.displayName}`);
});