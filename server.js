import express from "express";
import socket from "socket.io";
import http from "http";

const app = express();

const server = http.Server(app);
server.listen(3000, () => {
  console.log("server is running at 3000....");
});
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const io = socket(server);

io.on("connection", function(socket) {
  socket.on("chat message", function(msg) {
    io.emit("chat message", msg);
  });
  socket.on("chat user id", name => {
    io.emit("chat user id", name);
  });
});
