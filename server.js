import express from "express";
import session from "express-session";
import connectMongo from "connect-mongo";
import fs from "fs";
import path from "path";
import passport from "passport";
import mongoose from "mongoose";
import cors from "express-cors";
import bodyParser from "body-parser";
import router from "./router/userRouter";
import chatRouter from "./router/chatRouter";

const app = express();
app.use(express.static("upload"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// let imageDirectory = path.join(__dirname, "upload");

// if (!fs.existsSync(imageDirectory)) {
//   fs.mkdirSync(imageDirectory);
// }

let mongoStore = connectMongo(session);

app.use(
  cors({
    allowedOrigins: ["http://localhost:3000", "http://localhost:8080"],
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
// const server = http.Server(app);
app.listen(8081, () => {
  console.log("server is running at 8081....");
});
// const io = socket(server);

// io.on("connection", async function(socket) {
//   console.log("====================================");
//   console.log(
//     ">>>>>>>>>>>>>>>>>>>>>>>>>>>connect socket<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"
//   );
//   console.log("====================================");
//   socket.on("chat", async (fromUser, toUser) => {
//     console.log(
//       "||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||"
//     );
//     const verifyFromUser = await userApi.getUsername(fromUser);
//     if (verifyFromUser) {
//       const verifyToUser = await userApi.getUsername(toUser);
//       if (verifyToUser) {
//         const chat = await chatApi.chatMessageData({
//           fromUser: verifyFromUser._id,
//           toUser: verifyToUser._id
//         });

//         io.emit(
//           `chat${chat[0].fromUser.username}`,
//           chat[0].toUser.name,
//           chat[0].messages
//         );
//         io.emit(
//           `chat${chat[0].toUser.username}`,
//           chat[0].fromUser.name,
//           chat[0].messages
//         );
//       }
//     }
//   });
// });
