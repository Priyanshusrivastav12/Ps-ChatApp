import express from "express";
import cors from "cors";
import {
  allUsers,
  login,
  logout,
  signup,
  updateProfile,
  getUserProfile,
} from "../controller/user.controller.js";
import secureRoute from "../middleware/secureRoute.js";

const router = express.Router();

// Simple CORS for all user routes
const corsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200
};

router.use(cors(corsOptions));
router.options('*', cors(corsOptions));

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/allusers", secureRoute, allUsers);
router.get("/profile", secureRoute, getUserProfile);
router.put("/profile", secureRoute, updateProfile);

export default router;
