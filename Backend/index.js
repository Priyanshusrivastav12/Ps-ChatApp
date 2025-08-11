import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import userRoute from "./routes/user.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./SocketIO/server.js";

dotenv.config();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
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
  credentials: true
}));

// Development CSP headers
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:* ws://localhost:* data:; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:* data:; " +
      "style-src 'self' 'unsafe-inline' http://localhost:* data:; " +
      "img-src 'self' http://localhost:* data: blob:; " +
      "connect-src 'self' http://localhost:* ws://localhost:*; " +
      "font-src 'self' http://localhost:* data:; " +
      "media-src 'self' http://localhost:* data:"
    );
    next();
  });
}

const PORT = process.env.PORT || 4001;
const URI = process.env.MONGODB_URI;

if (!URI) {
  console.error("MONGODB_URI environment variable is not set");
  process.exit(1);
}

mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to MongoDB");
    console.log("Database:", URI.split('/')[3].split('?')[0]);
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
    console.error("Make sure your IP is whitelisted in MongoDB Atlas");
    console.error("Check: https://www.mongodb.com/docs/atlas/security-whitelist/");
    process.exit(1);
  });

//routes
app.use("/api/user", userRoute);
app.use("/api/message", messageRoute);

// Root route for basic health check
app.get("/", (req, res) => {
  res.json({ message: "Chat App Backend Server is running!" });
});

server.listen(PORT, () => {
  console.log(`Server is Running on port ${PORT}`);
});

//...... code for deployment
if (process.env.NODE_ENV === "production") {
  const dirPath = path.resolve();

  app.use(express.static("./Frontend/dist"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(dirPath, "./Frontend/dist","index.html"));
  })
} else {
  // Development mode - serve frontend routes through React Router
  app.get(["/login", "/signup", "/dashboard", "/chat"], (req, res) => {
    res.json({ 
      message: "This is a frontend route. Please access it through the React dev server on port 3001.",
      redirectTo: `http://localhost:3001${req.path}`
    });
  });
}
