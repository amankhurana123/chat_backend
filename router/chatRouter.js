import express from "express";
import chatApi from "../api/chatApi";
import userApi from "../api/userApi";
const router = express.Router();

router.post("/messages", async (req, res) => {
  const messages = req.body;
  console.log("message", messages);
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
        res.status(200).send("saved");
      } else {
        res.status(500).send();
      }
    }
  }
});
router.get("/chatdata", async (req, res) => {
  const { username } = JSON.parse(req.query.params);
  const verifyFromUser = await userApi.getUsername(username);
  if (verifyFromUser) {
    const message = await chatApi.chatMessage(verifyFromUser._id);
    if (message) {
      console.log(":::::::::::::::::::::::::::::::::::::::::::::::::::::");
      console.log(message);
      console.log("====================================");
      res.send(message);
    } else {
      console.log("not send");
      res.send("error");
    }
  }
});

export default router;
