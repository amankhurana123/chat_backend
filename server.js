import express from "express";
import socket from "socket.io";
import http from "http";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import router from "./router/userRouter";
import chatRouter from "./router/chatRouter";
import userApi from "./api/userApi";
import chatApi from "./api/chatApi";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
mongoose.connect("mongodb://localhost:27017/chat");

app.use("/user", router);
app.use("/chat", chatRouter);
const server = http.Server(app);
server.listen(3000, () => {
  console.log("server is running at 3000....");
});
const io = socket(server);

io.on("connection", async function(socket) {
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
  // socket.on("chat", async function() {
  // const chatdata = await chatApi.chatMessage({});
  // console.log("data>>>>>>>>>>>", chatdata);
  // chatdata.map(item => {
  //   let {} = item;
  //   return io.emit(
  //     `chat${item.formUser.username}`,
  //     message,
  //     item.formUser.username
  //   );
  //    io.emit(`chat${item.toUser.username}`, {});
  // });
  // const verifyFromUser = await userApi.getUsername(formUser);
  // if (verifyFromUser) {
  //   const verifyToUser = await userApi.getUsername(toUser);
  //   if (verifyToUser) {
  //     const chat = await chatApi.chatData({
  //       formUser: verifyFromUser._id,
  //       toUser: verifyToUser._id,
  //       message
  //     });
  // io.emit(
  //   "chat messages",
  //   chat.message,
  //   verifyToUser.name,
  //   verifyToUser.username,
  //   verifyFromUser.username,
  //   verifyFromUser.name,
  //   url
  // );
  // }
  // });
  // socket.on("chat schema", async (username, url) => {
  //   const verifyUser = await userApi.getUsername(username);
  //   if (verifyUser) {
  //     const chatdata = await chatApi.chatMessage(verifyUser._id);
  //     chatdata.map(item => {
  //       return io.emit(
  //         "chat messages display",
  //         item.message,
  //         verifyUser._id.toString() == item.formUser._id.toString()
  //           ? item.toUser.name
  //           : item.formUser.name,
  //         url
  //       );
  //     });
  //   }
  // });
});
