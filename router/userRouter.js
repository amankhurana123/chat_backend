import express from "express";
import userApi from "../api/userApi";
const router = express.Router();

router.post("/create", async (req, res) => {
  const userData = req.body;

  const verifyUserName = await userApi.getUsername(userData.username);

  if (!verifyUserName) {
    const user = await userApi.createUser(userData);
    if (user) {
      res.status(200).send("user is Succesfully register");
    }
  } else {
    res.status(500).send("not register");
  }
});
router.get("/chat", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

router.get("/chat1", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

export default router;
