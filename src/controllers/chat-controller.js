import {
  getConversationsService,
  getMessagesService,
  markConversationReadService,
  sendMessageService,
} from "../services/chat.service.js";
import logger from "../utils/logger.js";

export const getConversations = async (req, res) => {
  try {
    const result = await getConversationsService(req.user.userId);

    return res.status(result.status).json({
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    logger.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const result = await getMessagesService({
      userId: req.user.userId,
      conversationId: req.params.conversationId,
      page: req.query.page,
      limit: req.query.limit,
    });

    return res.status(result.status).json({
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    logger.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const result = await sendMessageService({
      userId: req.user.userId,
      conversationId: req.params.conversationId,
      text: req.body.text,
    });

    return res.status(result.status).json({
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    logger.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const markConversationRead = async (req, res) => {
  try {
    const result = await markConversationReadService({
      userId: req.user.userId,
      conversationId: req.params.conversationId,
    });

    return res.status(result.status).json({
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    logger.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};
