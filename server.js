const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

// for development
// const io = require("socket.io")(server, {
//   cors: {
//     //origin: "http://localhost:3000",
//     origin: "http://192.168.1.111:3000",
//     methods: ["GET", "POST"],
//   },
// });

// for production
const io = require("socket.io")(server);

const port = process.env.PORT || 8080;

// for production
app.use(express.static(__dirname + "/frontend/build"));
app.get("/", function (req, res) {
  res.sendFile("/index.html");
});

// Socket IO
io.on("connection", (socket) => {
  socket.on("enterUser", (name) => {
    const data = { id: socket.id, name: name };
    socket.broadcast.emit("userJoining", data);
  });

  socket.on("pitch", (data) => {
    socket.to(data.user).emit("pitch", data.pitch);
  });

  socket.on("active", (id) => {
    socket.to(id).emit("active");
  });

  socket.on("unactive", (id) => {
    socket.to(id).emit("unactive");
  });

  socket.on("env", (data) => {
    socket.broadcast.emit("env", data);
  });

  socket.on("disconnect" || "refresh", () => {
    socket.broadcast.emit("userdisconnecting", socket.id);
  });
});

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
