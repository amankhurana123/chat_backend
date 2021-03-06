import express from "express";
import passport from "passport";
import userApi from "../api/userApi";
const router = express.Router();

router.post("/create", async (req, res) => {
  const users = req.body;
  const verifyEmail = await userApi.getUsername(users.email);
  console.log("====================================");
  console.log(verifyEmail);
  console.log("====================================");
  if (!verifyEmail) {
    const user = await userApi.createUser(users);
    if (user) {
      console.log("user1", user);
      res.status(200).send("user is Succesfully register");
    }
  } else {
    res.status(500).end();
  }
});

router.post("/login", async (req, res) => {
  console.log("====================================");
  console.log(req.body);
  console.log("====================================");
  const userData = req.body;
  const verifyUser = await userApi.getUserVerification(userData);
  console.log("====================================");
  console.log(verifyUser);
  console.log("====================================");
  if (verifyUser) {
    res.status(200).send(verifyUser);
  } else {
    res.status(200).send();
  }
});

router.get("/getUser", async (req, res) => {
  const userID = JSON.parse(req.query.params);

  const user = await userApi.getUser(userID);
  console.log("====================================");
  console.log("user are", user);
  console.log("====================================");
  if (user.length) {
    res.status(200).send(user);
  } else {
    res.status(500).end();
  }
});
router.get("/logout", (req, res) => {
  req.logout();
  res.status(200).send(res);
});
export default router;
