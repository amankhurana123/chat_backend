import express from "express";
import passport from "passport";
import userApi from "../api/userApi";
const router = express.Router();

router.post("/create", async (req, res) => {
  console.log(req.body);
  const users = req.body;
  console.log(users);
  const verifyEmail = await userApi.getUsername(users.email);
  console.log("====================================");
  console.log(verifyEmail);
  console.log("====================================");
  if (!verifyEmail) {
    const user = await userApi.createUser(users);
    if (user) {
      res.status(200).send("user is Succesfully register");
    }
  } else {
    res.status(500).send("not register");
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
    res.status(500).end();
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
export default router;
