import express from "express";
import chatApi from "../api/chatApi";
import { apiInstance } from "../utilities/utility";
import axios from "axios";
import { isString } from "lodash";

const router = express.Router();

router.post("/messages", async (req, res) => {
  const messages = req.body;
  console.log("message", messages);

  const chat = await chatApi.chatData(messages);
  console.log("===============================================");

  console.log("chat", isString(chat));
  console.log("============================================");
  if (chat) {
    // const headers = {
    //   "content-type": "application/json",
    //   Accept: "application/json"
    // };
    // console.log("headers-----------", headers);
    let data = chat;
    const options = {
      method: "post",
      url: "/notify",
      data
    };
    console.log("the options are", options);
    apiInstance(options)
      .then(response => {
        console.log("resonpone-0--------------", response);
        res.status(200).send(chat);
      })
      .catch(error => {
        console.error("error", error);
      });
  } else {
    res.status(500).end();
  }
});
router.get("/chatdata", async (req, res) => {
  const { fromUser, toUser } = JSON.parse(req.query.params);
  const message = await chatApi.chatMessage(fromUser, toUser);
  console.log("===================================================");
  console.log("message", message);
  console.log("===================================================");
  if (message.length) {
    res.send(message);
  } else {
    res.status(200).end();
  }
});

export default router;
