import express from "express";
import socket from "socket.io";
import bodyParser from "body-parser";
import http from "http";

const app = express();
app.use(express.static("upload"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/notifySocket", (req, res) => {
  console.log("req.body---------------", req.body);
  const { groupId, data } = req.body;
  emitUpdate(groupId, data);
  res.send({ done: true });
});

const server = http.Server(app);

const io = socket(server);

io.on("connection", socket => {
  // console.log("socket is connected", socket.id);
  io.emit("chat", {});
  io.emit("subscription_id", socket.id);
});

const emitUpdate = function(groupId, data) {
  io.emit(groupId, { groupId, data });
};

server.listen(8080, () => {
  console.log("Socket Server is running 8080....");
});
