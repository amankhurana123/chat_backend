import express from "express";
import chatApi from "../api/chatApi";
import userApi from "../api/userApi";
const router = express.Router();

router.post("/messages", async (req, res) => {
  const messages = req.body;

  const verifyFromUser = await userApi.getUsername(messages.fromUser);
  if (verifyFromUser) {
    const verifyToUser = await userApi.getUsername(messages.toUser);
    if (verifyToUser) {
      const chat = await chatApi.chatData({
        formUser: verifyFromUser._id,
        toUser: verifyToUser._id,
        message: messages.message
      });
      if (chat) {
        res.status(200).sendFile(__dirname + "/index.html");
      } else {
        console.log("chat", chat);

        res.status(500).send("no chat");
      }
    }
  }
});
router.get("/chatdata", async (req, res) => {
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

  console.log("chat server", decodeURI(JSON.parse(req.query.params)));
  // const verifyFromUser = await userApi
  //   .getUsername
  //   // JSON.parse(req.query.params).name
  //   ();
  // if (verifyFromUser) {
  //   // const message = await chatApi.chatMessage(verifyFromUser._id);
  //   if (message) {
  //     console.log(message);
  //     res.status(200).send(message);
  //   } else {
  //     res.status(500).send();
  //   }
  // }
});

export default router;
