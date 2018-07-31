import express from "express";
import multer from "multer";
import chatApi from "../api/chatApi";
import { apiInstance } from "../utilities/utility";
import { isString } from "lodash";

const router = express.Router();

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  }
});
let upload = multer({ storage: storage });

router.post("/messages", upload.single("message"), async (req, res) => {
  let messages = req.body;
  console.log("message", messages);
  if (req.file) {
    messages.message = req.file.filename;
  }
  console.log("message", messages);
  const chat = await chatApi.chatData(messages);

  if (chat) {
    let data = { groupId: `chat_${chat.toUser}`, data: chat };
    const options = {
      method: "post",
      url: "/notifySocket",
      data
    };
    console.log("the options are", options);
    apiInstance(options)
      .then(response => {
        // console.log("resonpone-0--------------", response);
      })
      .catch(error => {
        console.error("error", error);
      });
    res.status(200).send(chat);
  } else {
    res.status(500).end();
  }
});
router.get("/chatdata", async (req, res) => {
  const { fromUser, toUser, option } = JSON.parse(req.query.params);
  console.log("req,parmas", fromUser, toUser, option);
  const message = await chatApi.chatMessage(fromUser, toUser, option);
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
