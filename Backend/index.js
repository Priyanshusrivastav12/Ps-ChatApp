import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";

import userRoute from "./routes/user.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./SocketIO/server.js";

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: envFile });

// Environment variables with fallbacks
const PORT = process.env.PORT || 4001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4001';
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// Validate required environment variables
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI environment variable is not set");
  process.exit(1);
}

if (!JWT_SECRET) {
  console.error("❌ JWT_SECRET environment variable is not set");
  process.exit(1);
}

console.log(`🚀 Starting server in ${NODE_ENV} mode`);
console.log(`📡 Backend URL: ${BACKEND_URL}`);
console.log(`🌐 Frontend URL: ${FRONTEND_URL}`);

// middleware
app.use(express.json());
app.use(cookieParser());

// Dynamic CORS configuration based on environment
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = NODE_ENV === 'production' 
      ? [
          'https://ps-chatapp.onrender.com',
          process.env.PRODUCTION_FRONTEND_URL
        ].filter(Boolean)
      : [
          'http://localhost:3000',
          'http://localhost:3001', 
          'http://localhost:5173',
          'http://127.0.0.1:5173',
          FRONTEND_URL
        ].filter(Boolean);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // In development, allow any localhost origin
    if (NODE_ENV !== 'production' && origin && origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    
    console.warn(`❌ CORS blocked origin: ${origin}`);
    return callback(new Error(`Not allowed by CORS. Origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
};

app.use(cors(corsOptions));

// Environment-specific CSP headers
if (NODE_ENV !== "production") {
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
} else {
  // Production CSP headers
  app.use((req, res, next) => {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self' 'unsafe-inline' https://ps-chatapp.onrender.com; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://ps-chatapp.onrender.com; " +
      "style-src 'self' 'unsafe-inline' https://ps-chatapp.onrender.com; " +
      "img-src 'self' https://ps-chatapp.onrender.com data: blob:; " +
      "connect-src 'self' https://ps-chatapp.onrender.com wss://ps-chatapp.onrender.com; " +
      "font-src 'self' https://ps-chatapp.onrender.com data:;"
    );
    next();
  });
}

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    console.log(`📦 Database: ${MONGODB_URI.split('/')[3].split('?')[0]}`);
  })
  .catch((error) => {
    console.error("❌ Error connecting to MongoDB:", error.message);
    console.error("💡 Make sure your IP is whitelisted in MongoDB Atlas");
    console.error("🔗 Check: https://www.mongodb.com/docs/atlas/security-whitelist/");
    process.exit(1);
  });

//routes
app.use("/api/user", userRoute);
app.use("/api/message", messageRoute);

// Root route for basic health check
app.get("/", (req, res) => {
  res.json({ 
    message: "🚀 Chat App Backend Server is running!",
    environment: NODE_ENV,
    version: "1.0.0",
    backend_url: BACKEND_URL,
    frontend_url: FRONTEND_URL,
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK",
    environment: NODE_ENV,
    database: "Connected",
    timestamp: new Date().toISOString()
  });
});

// API information endpoint
app.get("/api", (req, res) => {
  res.json({
    message: "Chat App API",
    version: "1.0.0",
    environment: NODE_ENV,
    endpoints: {
      auth: "/api/user/signup, /api/user/login, /api/user/logout",
      users: "/api/user/allusers",
      messages: "/api/message/send/:id, /api/message/get/:id"
    }
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`🔗 Backend URL: ${BACKEND_URL}`);
  console.log(`🌐 Frontend URL: ${FRONTEND_URL}`);
});

//...... code for deployment
const isProduction = NODE_ENV === "production";
console.log(`🏗️  Environment: ${NODE_ENV}`);
console.log(`🏭 Is Production: ${isProduction}`);

if (isProduction) {
  const dirPath = path.resolve();
  const frontendPath = path.join(dirPath, "Frontend", "dist");
  
  console.log(`📁 Frontend build path: ${frontendPath}`);
  console.log(`✅ Frontend build exists: ${fs.existsSync(frontendPath)}`);

  // Serve static files from the frontend build
  app.use(express.static(frontendPath));

  // Handle all other routes by serving the React app
  app.get("*", (req, res) => {
    try {
      const indexPath = path.join(frontendPath, "index.html");
      console.log(`📄 Serving index.html from: ${indexPath}`);
      res.sendFile(indexPath);
    } catch (error) {
      console.error("❌ Error serving index.html:", error);
      res.status(500).json({ 
        error: "Internal Server Error", 
        path: frontendPath,
        environment: NODE_ENV 
      });
    }
  });
} else {
  // Development mode - provide helpful information for frontend routes
  app.get(["/login", "/signup", "/dashboard", "/chat"], (req, res) => {
    res.json({ 
      message: "🚧 This is a frontend route. Please access it through the React dev server.",
      environment: NODE_ENV,
      frontend_dev_server: FRONTEND_URL,
      redirectTo: `${FRONTEND_URL}${req.path}`,
      note: "Make sure your frontend dev server is running on " + FRONTEND_URL
    });
  });
}
