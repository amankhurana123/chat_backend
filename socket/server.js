import express from "express";
import socket from "socket.io";
import bodyParser from "body-parser";
import http from "http";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const users = {};

app.post("/notify", (req, res) => {
  console.log("req.body---------------", req.body);
  res.send({ done: true });
});

app.get("/test", (req, res) => {
  console.log("req.body-------------------->>>>>", req.query.params);
  res.send({ accepted: true });
});
const server = http.Server(app);

const io = socket(server);

io.on("connection", socket => {});

server.listen(8080, () => {
  console.log("Socket Server is running 8080....");
});
