import { Router } from "express";
import passport from "passport";
import {} from "../middleware/auth.js";

export const authRouter = Router();

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] }),
  (req, res) => {
    console.log("redirecing to frontend");
    res.redirect("http://localhost:4200/");
  }
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/protected",
    failureRedirect: "/auth/google/failure",
  })
);

authRouter.get("/google/failure", (req, res) => {
  res.status(401).json({ error: "Something went wrong" });
});
