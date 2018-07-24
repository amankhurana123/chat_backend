import express from "express";
import socket from "socket.io";
import session from "express-session";
import connectMongo from "connect-mongo";
import passport from "passport";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./router/userRouter";
import chatRouter from "./router/chatRouter";
import userApi from "./api/userApi";
import chatApi from "./api/chatApi";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
let mongoStore = connectMongo(session);

app.use(
  cors({
    allowedOrigins: ["http://localhost:3000", "http://192.168.100.76:3000"],
    credentials: true
  })
);

app.use(
  session({
    secret: "ChatSessionKey",
    store: new mongoStore({ mongooseConnection: mongoose.connection }),
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 30 * 24 * 60 * 60 * 1000
    } //30 days
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(
  "mongodb://localhost:27017/chat",
  { useNewUrlParser: true }
);

app.use("/user", router);
app.use("/chat", chatRouter);
const server = http.Server(app);
server.listen(8081, () => {
  console.log("server is running at 8081....");
});
const io = socket(server);

io.on("connection", async function(socket) {
  console.log("====================================");
  console.log(
    ">>>>>>>>>>>>>>>>>>>>>>>>>>>connect socket<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"
  );
  console.log("====================================");
  socket.on("chat", async (formUser, toUser) => {
    console.log(
      "||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||"
    );
    const verifyFromUser = await userApi.getUsername(formUser);
    if (verifyFromUser) {
      const verifyToUser = await userApi.getUsername(toUser);
      if (verifyToUser) {
        const chat = await chatApi.chatMessageData({
          formUser: verifyFromUser._id,
          toUser: verifyToUser._id
        });

        io.emit(
          `chat${chat[0].formUser.username}`,
          chat[0].toUser.name,
          chat[0].messages
        );
        io.emit(
          `chat${chat[0].toUser.username}`,
          chat[0].formUser.name,
          chat[0].messages
        );
      }
    }
  });
});
