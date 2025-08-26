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

// Utility function to get online users count and list
const getOnlineUsersInfo = () => {
  const userIds = Object.keys(users);
  return {
    count: userIds.length,
    users: userIds
  };
};

//ueg used to listen events on server side.
io.on("connection", (socket) => {
  console.log("🔗 User connected:", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId) {
    users[userId] = socket.id;
    const onlineInfo = getOnlineUsersInfo();
    console.log(`👥 User ${userId} connected. Online users: ${onlineInfo.count} [${onlineInfo.users.join(', ')}]`);
  } else {
    console.log("⚠️ User connected without userId");
  }
  // used to send the events to all connected users
  io.emit("getOnlineUsers", Object.keys(users));

  // Handle typing events with better error handling
  socket.on("typing", ({ recipientId }) => {
    // Only log and process if both users exist
    if (!userId || !recipientId) {
      console.log(`⚠️ Invalid typing event: userId=${userId}, recipientId=${recipientId}`);
      return;
    }

    console.log(`⌨️ User ${userId} is typing to ${recipientId}`);
    const recipientSocketId = users[recipientId];
    if (recipientSocketId) {
      try {
        console.log(`📤 Sending userTyping event to ${recipientId} (socketId: ${recipientSocketId})`);
        io.to(recipientSocketId).emit("userTyping", { senderId: userId });
      } catch (error) {
        console.error(`❌ Error sending typing event to ${recipientId}:`, error);
      }
    } else {
      // Only log as warning instead of error for better UX
      const onlineInfo = getOnlineUsersInfo();
      console.log(`⚠️ Recipient ${recipientId} not currently online (${onlineInfo.count} users online: [${onlineInfo.users.join(', ')}])`);
    }
  });

  socket.on("stopTyping", ({ recipientId }) => {
    // Only log and process if both users exist
    if (!userId || !recipientId) {
      console.log(`⚠️ Invalid stopTyping event: userId=${userId}, recipientId=${recipientId}`);
      return;
    }

    console.log(`⌨️ User ${userId} stopped typing to ${recipientId}`);
    const recipientSocketId = users[recipientId];
    if (recipientSocketId) {
      try {
        console.log(`📤 Sending userStoppedTyping event to ${recipientId} (socketId: ${recipientSocketId})`);
        io.to(recipientSocketId).emit("userStoppedTyping", { senderId: userId });
      } catch (error) {
        console.error(`❌ Error sending stopTyping event to ${recipientId}:`, error);
      }
    } else {
      // Only log as warning instead of error for better UX
      const onlineInfo = getOnlineUsersInfo();
      console.log(`⚠️ Recipient ${recipientId} not currently online (${onlineInfo.count} users online: [${onlineInfo.users.join(', ')}])`);
    }
  });

  // used to listen client side events emitted by server side (server & client)
  socket.on("disconnect", () => {
    console.log("🔌 User disconnected:", socket.id);
    
    if (userId) {
      // Clean up user from users object
      delete users[userId];
      
      // Notify all connected users that this user stopped typing (cleanup)
      Object.values(users).forEach(socketId => {
        try {
          io.to(socketId).emit("userStoppedTyping", { senderId: userId });
        } catch (error) {
          console.error(`❌ Error cleaning up typing state for disconnected user ${userId}:`, error);
        }
      });
      
      console.log(`👤 User ${userId} removed from online users (${getOnlineUsersInfo().count} users remaining)`);
    } else {
      console.log("⚠️ User disconnected without valid userId");
    }
    
    // Emit updated online users list
    io.emit("getOnlineUsers", Object.keys(users));
  });
});

export { app, io, server };
