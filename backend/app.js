import { sequelize } from "./datasource.js";
import express from "express";
import bodyParser from "body-parser";
import { messagesRouter } from "./routers/messages_router.js";
import { usersRouter } from "./routers/users_router.js";
import { authRouter } from "./routers/auth_router.js"
import { protectedRouter } from "./routers/protected.js";
import session from "express-session";
import cors from "cors";
import {} from "./middleware/auth.js"
import { isLoggedIn } from "./middleware/isLoggedIn.js";
import passport from "passport";


const PORT = 3000;
export const app = express();
app.use(bodyParser.json());

// app.use(express.static("static"));
const corsOptions = {
  origin: "http://localhost:4200",
  credentials: true,
};
app.use(cors(corsOptions));

try {
  await sequelize.authenticate();
  await sequelize.sync({ alter: { drop: false } });
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

app.use(
  session({
    secret: process.env.SECRET_KEY || "test",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize())
app.use(passport.session())

app.use("/api/messages", messagesRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/protected", isLoggedIn, protectedRouter)

app.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
});

app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log("HTTP server on http://localhost:%s", PORT);
});
