import mongoose from "mongoose";
import ChatConversation from "../models/chat-conversation.js";
import ChatMessage from "../models/chat-message.js";
import UserMatch from "../models/user-match.js";
import { getIO } from "../sockets/socket.js";
import logger from "../utils/logger.js";

const { ObjectId } = mongoose.Types;

const isValidObjectId = (id) => ObjectId.isValid(id);

const isParticipant = (conversation, userId) =>
  conversation.participants.some(
    (participant) => participant._id?.toString() === userId.toString() || participant.toString() === userId.toString(),
  );

const getReceiverId = (conversation, userId) =>
  conversation.participants.find(
    (participant) => participant._id?.toString() !== userId.toString() && participant.toString() !== userId.toString(),
  );

export const getConversationsService = async (userId) => {
  const conversations = await ChatConversation.find({
    participants: userId,
  })
    .populate("participants", "fullName email")
    .sort({ lastMessageAt: -1, updatedAt: -1 });

  return {
    status: 200,
    message: "Conversations fetched successfully",
    data: conversations,
  };
};

export const getMessagesService = async ({
  userId,
  conversationId,
  page = 1,
  limit = 30,
}) => {
  if (!isValidObjectId(conversationId)) {
    return {
      status: 400,
      message: "Invalid conversation id",
    };
  }

  const conversation = await ChatConversation.findById(conversationId);

  if (!conversation || !isParticipant(conversation, userId)) {
    return {
      status: 404,
      message: "Conversation not found",
    };
  }

  const currentPage = Math.max(Number(page) || 1, 1);
  const pageLimit = Math.min(Math.max(Number(limit) || 30, 1), 100);

  const messages = await ChatMessage.find({ conversationId })
    .sort({ createdAt: -1 })
    .skip((currentPage - 1) * pageLimit)
    .limit(pageLimit);

  return {
    status: 200,
    message: "Messages fetched successfully",
    data: {
      page: currentPage,
      limit: pageLimit,
      messages: messages.reverse(),
    },
  };
};

export const sendMessageService = async ({ userId, conversationId, text }) => {
  if (!isValidObjectId(conversationId)) {
    return {
      status: 400,
      message: "Invalid conversation id",
    };
  }

  const conversation = await ChatConversation.findById(conversationId);

  if (!conversation || !isParticipant(conversation, userId)) {
    return {
      status: 404,
      message: "Conversation not found",
    };
  }

  if (conversation.matchId) {
    const match = await UserMatch.findById(conversation.matchId).select("status");

    if (!match || match.status !== "MATCHED") {
      return {
        status: 403,
        message: "You can only message active matches",
      };
    }
  }

  const receiverId = getReceiverId(conversation, userId);

  if (!receiverId) {
    return {
      status: 400,
      message: "Receiver not found",
    };
  }

  const message = await ChatMessage.create({
    conversationId,
    senderId: userId,
    receiverId,
    text,
  });

  conversation.lastMessage = text;
  conversation.lastMessageAt = message.createdAt;
  await conversation.save();

  try {
    const io = getIO();

    io.to(`user:${receiverId.toString()}`).emit("receive_message", {
      conversationId,
      message,
    });
    io.to(`user:${userId.toString()}`).emit("message_sent", {
      conversationId,
      message,
    });
  } catch (error) {
    logger.error(error, "Socket emit failed");
  }

  return {
    status: 201,
    message: "Message sent successfully",
    data: message,
  };
};

export const markConversationReadService = async ({
  userId,
  conversationId,
}) => {
  if (!isValidObjectId(conversationId)) {
    return {
      status: 400,
      message: "Invalid conversation id",
    };
  }

  const conversation = await ChatConversation.findById(conversationId);

  if (!conversation || !isParticipant(conversation, userId)) {
    return {
      status: 404,
      message: "Conversation not found",
    };
  }

  const result = await ChatMessage.updateMany(
    {
      conversationId,
      receiverId: userId,
      readAt: null,
    },
    {
      readAt: new Date(),
    },
  );

  return {
    status: 200,
    message: "Conversation marked as read",
    data: {
      modifiedCount: result.modifiedCount,
    },
  };
};
