import { User } from "../models/users.js";
import { Router } from "express";
import multer from "multer";
import bcrypt from "bcrypt";
import path from "path";

export const usersRouter = Router();
const upload = multer({ dest: "uploads/" });

usersRouter.post("/signup", async (req, res) => {
  console.log("signing up")
  const user = User.build({
    username: req.body.username,
  });
  // generate password - salted and hashed
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(10);
  user.password = bcrypt.hashSync(password, salt);
  try {
    await user.save();
  } catch (err) {
    console.log(err);
    return res.status(422).json({ error: "User creation failed." });
  }
  req.session.userId = user.id;
  return res.json({
    username: user.username,
  });
});

usersRouter.post("/signin", async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.body.username,
    },
  });
  if (user === null) {
    return res.status(401).json({ error: "Incorrect username or password." });
  }
  // password incorrect
  if (!bcrypt.compareSync(req.body.password, user.password)) {
    return res.status(401).json({ error: "Incorrect username or password." });
  }
  req.session.userId = user.id;
  return res.json(user);
});

usersRouter.get("/signout", function (req, res, next) {
  req.session.destroy();
  return res.json({ message: "Signed out." });
});

// need to change when we store session id instead of entire user
usersRouter.get("/me", async (req, res) => {
  console.log("user me")
  console.log(req.session?.passport?.user?.id)
  if (!req.session?.passport?.user?.id) {
    return res.status(401).json({ errors: "Not Authenticaed" });
  }
  return res.json({
    userId: req.session?.passport.user.id,
  });
});

// old version from lab
// usersRouter.get("/me", async (req, res) => {
//   console.log("user me")
//   console.log(req.session)
//   if (!req.session.userId) {
//     return res.status(401).json({ errors: "Not Authenticaed" });
//   }
//   return res.json({
//     userId: req.session.userId,
//   });
// });
