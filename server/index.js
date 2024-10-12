import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import csrf from "csurf";

const app = express();
dotenv.config();

const csrfProtection = csrf({ cookie: true });

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

let connectedUsers = [];
let dailyUsers = [];

const DAY_IN_MS = 24 * 60 * 60 * 1000;

import authRouter from "./router/authRoute.js";
import dataRoute from "./router/dataRoute.js";

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("Bir kullanıcı bağlandı!", userId);

  connectedUsers.push(socket.id);

  if (!dailyUsers.some((user) => user.id === userId)) {
    dailyUsers.push({ id: userId, time: Date.now() });
  }

  io.emit("visitorCount", connectedUsers.length);
  io.emit("dailyVisitorCount", dailyUsers.length);

  socket.on("disconnect", () => {
    console.log("Bir kullanıcı bağlantısını kopardı!");
    const index = connectedUsers.indexOf(socket.id);
    if (index !== -1) {
      connectedUsers.splice(index, 1);
      io.emit("visitorCount", connectedUsers.length);
    }
  });
});

setInterval(() => {
  const now = Date.now();
  dailyUsers = dailyUsers.filter((user) => now - user.time < DAY_IN_MS);
  io.emit("dailyVisitorCount", dailyUsers.length);
}, DAY_IN_MS);

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const sessionOptions = {
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionOptions));
app.use(express.static(process.cwd() + "/media"));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.get("/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.use("/data", dataRoute);
app.use("/", authRouter);

const port = process.env.PORT || 5001;

httpServer.listen(port, () => {
  console.log(`${port} is running!`);
});
