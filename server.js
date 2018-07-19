import express from "express";
import socket from "socket.io";
import http from "http";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import router from "./router/userRouter";
import userApi from "./api/userApi";
import chatApi from "./api/chatApi";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
mongoose.connect("mongodb://localhost:27017/chat");

app.use("/user", router);
const server = http.Server(app);
server.listen(3000, () => {
  console.log("server is running at 3000....");
});
const io = socket(server);

io.on("connection", function(socket) {
  socket.on("chat message", async function(message, formUser, toUser) {
    const verifyFromUser = await userApi.getUsername(formUser);
    if (verifyFromUser) {
      const verifyToUser = await userApi.getUsername(toUser);

      if (verifyToUser) {
        const chat = await chatApi.chatData({
          formUser: verifyFromUser._id,
          toUser: verifyToUser._id,
          message
        });
      }
    }
  });
  socket.on("find user", async username => {
    const verifyUser = await userApi.getUsername(username);
    if (verifyUser) {
      const chatdata = await chatApi.chatMessage(verifyUser._id);

      chatdata.map(item => {
        return io.emit(
          "chat messages display",
          item.message,
          verifyUser._id.toString() == item.formUser._id.toString()
            ? item.toUser.name
            : item.formUser.name
        );
      });
    }
  });
});
