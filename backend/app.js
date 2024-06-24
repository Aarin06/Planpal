import { sequelize } from "./datasource.js";
import { messagesRouter } from "./routers/messages_router.js";
import { usersRouter } from "./routers/users_router.js";
import session from "express-session";
import express from "express";
import bodyParser from "body-parser";
import { authRouter } from "./routers/auth_router.js";
import { itinerariesRouter } from "./routers/itineraries_router.js";
import { protectedRouter } from "./routers/protected.js";

import cors from "cors";
import "./middleware/auth.js";
import { isLoggedIn } from "./middleware/isLoggedIn.js";
import passport from "passport";

const PORT = 3000;
export const app = express();
app.use(bodyParser.json());

const corsOptions = {
  origin: "http://localhost:4200",
  credentials: true,
};
// app.use(cors(corsOptions));

app.use(
  session({
    secret: process.env.SECRET_KEY || "test",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);
app.use("/protected", isLoggedIn, protectedRouter);
app.use("/itineraries", itinerariesRouter);
app.use("/users", usersRouter);

app.get("/logout", (req) => {
  req.logout();
  req.session.destroy();
});

app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log("HTTP server on http://localhost:%s", PORT);
});

// app.use(express.static("static"));

// try {
//   await sequelize.authenticate();
//   await sequelize.sync({ alter: { drop: false } });
//   console.log("Connection has been established successfully.");
// } catch (error) {
//   console.error("Unable to connect to the database:", error);
// }

// app.use("/api/messages", messagesRouter);
