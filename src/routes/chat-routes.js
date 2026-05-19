import express from "express";
import { verifyUserAccessToken } from "../middlewares/user-auth.middleware.js";
import { validate } from "../middlewares/validate.js";
import { sendMessageSchema } from "../user-validation.js";
import {
  getConversations,
  getMessages,
  sendMessage,
} from "../controllers/chat-controller.js";

const router = express.Router();

router.use(verifyUserAccessToken);

router.get("/conversations", getConversations);
router.get("/conversations/messages/:conversationId", getMessages);
router.post(
  "/conversations/messages/:conversationId",
  validate(sendMessageSchema),
  sendMessage,
);

export default router;
