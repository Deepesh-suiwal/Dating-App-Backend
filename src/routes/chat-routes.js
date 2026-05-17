import express from "express";
import { verifyUserAccessToken } from "../middlewares/user-auth.middleware.js";
import { validate } from "../middlewares/validate.js";
import { sendMessageSchema } from "../user-validation.js";
import {
  getConversations,
  getMessages,
  markConversationRead,
  sendMessage,
} from "../controllers/chat-controller.js";

const router = express.Router();

router.use(verifyUserAccessToken);

router.get("/conversations", getConversations);
router.get("/conversations/:conversationId/messages", getMessages);
router.post(
  "/conversations/:conversationId/messages",
  validate(sendMessageSchema),
  sendMessage,
);
router.patch("/conversations/:conversationId/read", markConversationRead);

export default router;
