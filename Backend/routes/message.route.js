import express from "express";
import { 
  getMessage, 
  sendMessage, 
  markMessagesAsRead, 
  addReaction, 
  editMessage 
} from "../controller/message.controller.js";
import secureRoute from "../middleware/secureRoute.js";

const router = express.Router();

router.post("/send/:id", secureRoute, sendMessage);
router.get("/get/:id", secureRoute, getMessage);
router.put("/read/:id", secureRoute, markMessagesAsRead);
router.post("/reaction/:messageId", secureRoute, addReaction);
router.put("/edit/:messageId", secureRoute, editMessage);

export default router;
