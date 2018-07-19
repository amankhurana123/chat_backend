import express from "express";
import chatApi from "../api/chatApi";
const router = express.Router();

router.post("/messages", async (req, res) => {
  const messages = req.body();
  const messagesCB = await chatApi.chatData(messages);
  if (messagesCB) {
    res.status(200).send(messagesCB);
  } else {
    res.status(500).send("");
  }
});

export default router;
