import { Router } from "express";
import passport from "passport";
import {} from "../middleware/auth.js";

export const authRouter = Router();

authRouter.get(
  "/google",
  passport.authenticate("google", { 
    scope: ["email", "profile"],
    accessType: 'offline',
    prompt: 'consent' 
  }),
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:4200/home",
    failureRedirect: "/auth/google/failure",
  }),
);

authRouter.get("/google/failure", (req, res) => {
  res.status(401).json({ error: "Something went wrong" });
});
