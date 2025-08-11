import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Allow localhost on any port for development
      if (origin.startsWith('http://localhost:')) {
        return callback(null, true);
      }
      
      // In production, you should specify exact origins
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ["GET", "POST"],
  },
});

// realtime message code goes here
export const getReceiverSocketId = (receiverId) => {
  return users[receiverId];
};

const users = {};

// used to listen events on server side.
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId) {
    users[userId] = socket.id;
    console.log("Hello ", users);
  }
  // used to send the events to all connected users
  io.emit("getOnlineUsers", Object.keys(users));

  // Handle typing events
  socket.on("typing", ({ recipientId }) => {
    const recipientSocketId = users[recipientId];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("userTyping", { senderId: userId });
    }
  });

  socket.on("stopTyping", ({ recipientId }) => {
    const recipientSocketId = users[recipientId];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("userStoppedTyping", { senderId: userId });
    }
  });

  // used to listen client side events emitted by server side (server & client)
  socket.on("disconnect", () => {
    console.log("a user disconnected", socket.id);
    delete users[userId];
    io.emit("getOnlineUsers", Object.keys(users));
  });
});

export { app, io, server };
