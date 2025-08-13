import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// Get environment configuration
const NODE_ENV = process.env.NODE_ENV || 'development';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Simple CORS configuration for Socket.IO - Allow all origins
function getCorsConfig() {
  return {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With', 'Accept', 'Origin']
  };
}

const io = new Server(server, {
  cors: getCorsConfig()
});

console.log(`🔌 Socket.IO configured for ${NODE_ENV} environment`);
console.log(`🌐 CORS enabled for all origins:`, getCorsConfig().origin);

// realtime message code goes here
export const getReceiverSocketId = (receiverId) => {
  return users[receiverId];
};

const users = {};

// used to listen events on server side.
io.on("connection", (socket) => {
  console.log("🔗 User connected:", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId) {
    users[userId] = socket.id;
    console.log("👥 Online users:", Object.keys(users).length);
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
    console.log("🔌 User disconnected:", socket.id);
    delete users[userId];
    io.emit("getOnlineUsers", Object.keys(users));
  });
});

export { app, io, server };
