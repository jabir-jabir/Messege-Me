const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // পরবর্তীতে এখানে ফ্রন্টএন্ড লিঙ্ক দিতে হবে
    methods: ["GET", "POST"],
  },
});

// Socket.io কানেকশন
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // জয়েন রুম (ব্যক্তিগত চ্যাটের জন্য)
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User ID: ${socket.id} joined room: ${data}`);
  });

  // মেসেজ পাঠানো
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
