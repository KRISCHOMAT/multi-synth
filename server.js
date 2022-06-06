const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const port = process.env.PORT || 8080;

// for development
// const io = require("socket.io")(server, {
//   cors: {
//     //origin: "http://localhost:3000",
//     origin: "http://192.168.1.111:3000",
//     methods: ["GET", "POST"],
//   },
// });
// **** //

// for production && remove nodemon from script!
const io = require("socket.io")(server);
app.use(express.static(path.join(__dirname, "/frontend/build")));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "frontend/build", "/index.html"));
});
// **** //

// Socket IO
io.on("connection", (socket) => {
  socket.on("enterUser", (data) => {
    const values = { id: socket.id, name: data.name };
    socket.join(data.roomId);
    socket.to(data.roomId).emit("userJoining", values);
  });

  socket.on("createRoom", (data) => {
    socket.join(data.uuid);
  });

  socket.on("initUser", (data) => {
    const values = {
      name: data.name,
      attack: data.attack,
      release: data.release,
      hold: data.hold,
      basePitch: data.basePitch,
    };
    socket.to(data.id).emit("initUser", values);
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

  socket.on("removeUser", (id) => {
    socket.to(id).emit("removeUser");
  });

  socket.on("leaving", (data) => {
    socket.to(data).emit("leaving", socket.id);
  });

  socket.on("data", (data) => {
    const values = {
      attack: data.attack,
      release: data.release,
      hold: data.hold,
      basePitch: data.basePitch,
    };
    socket.to(data.room).emit("data", values);
  });
});

server.listen(port, () => {});
