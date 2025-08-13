import express from "express";
import cors from "cors";
import { 
  getMessage, 
  sendMessage, 
  markMessagesAsRead, 
  addReaction, 
  editMessage 
} from "../controller/message.controller.js";
import secureRoute from "../middleware/secureRoute.js";

const router = express.Router();

// Simple CORS for all message routes
const corsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200
};

router.use(cors(corsOptions));
router.options('*', cors(corsOptions));

router.post("/send/:id", secureRoute, sendMessage);
router.get("/get/:id", secureRoute, getMessage);
router.put("/read/:id", secureRoute, markMessagesAsRead);
router.post("/reaction/:messageId", secureRoute, addReaction);
router.put("/edit/:messageId", secureRoute, editMessage);

export default router;
