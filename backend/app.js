import { sequelize } from "./datasource.js";
import { messagesRouter } from "./routers/messages_router.js";
import { usersRouter } from "./routers/users_router.js";
import session from "express-session";
import express from "express";
import bodyParser from "body-parser";
import { authRouter } from "./routers/auth_router.js";
import { itinerariesRouter } from "./routers/itineraries_router.js";
import { protectedRouter } from "./routers/protected.js";
import { eventsRouter } from "./routers/events_router.js";
import { googleRouter } from "./routers/google_router.js";
import { stripeRouter } from "./routers/stripe_router.js";

import { config } from "dotenv";
import cors from "cors";
import "./middleware/auth.js";
import { isLoggedIn } from "./middleware/isLoggedIn.js";
import passport from "passport";
import { createServer } from "http";
import { Server } from "socket.io";
import DefaultSocket from "./sockets/socket.js";

config();
const PORT = 3000;
export const app = express();

const corsOptions = {
  origin: "https://planpal.tech",
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
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
    secret: "your_secret_key", // Replace with your own secret
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 60 * 10000, // 1 minute in milliseconds
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/stripe", stripeRouter);
app.use(bodyParser.json());

app.use("/auth", authRouter);
app.use("/protected", isLoggedIn, protectedRouter);
app.use("/itineraries", itinerariesRouter);
app.use("/events", eventsRouter);
app.use("/users", usersRouter);
app.use("/google", googleRouter);

app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log("HTTP server on http://localhost:%s", PORT);
});

// app.use(express.static("static"));

// app.use("/api/messages", messagesRouter);

// Socket.io server configuration
const httpServer = createServer(app); // Pass the express app to the HTTP server
const io = new Server(httpServer, {
  cors: {
    origin: "https://planpal.tech",
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  },
});

let connected = [];
const connectedInverse = {};

io.on("connection", (socket) => {
  connected.push(socket);
  console.log("a user connected", socket.id);
  socket.on("disconnect", () => {
    console.log("a user disconnected", socket.id);
    connected = connected.filter((con) => con.id !== socket.id);
  });

  DefaultSocket(connected, connectedInverse, socket, io);
});

httpServer.listen(8443, () => {
  console.log("Socket.io server is running on http://localhost:4001");
});
