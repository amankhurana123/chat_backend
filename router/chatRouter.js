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
  console.log("photo", req.file);
  let messages = req.body;
  messages.message = req.file.filename;
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
    let data = { groupId: `chat_${chat.toUser}`, data: chat };
    const options = {
      method: "post",
      url: "/notifySocket",
      data
    };
    console.log("the options are", options);
    apiInstance(options)
      .then(response => {
        console.log("resonpone-0--------------", response);
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
