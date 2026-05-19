import mongoose from "mongoose";

const { Schema, model } = mongoose;

const chatConversationSchema = new Schema(
  {
    participants: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      ],
      validate: {
        validator: function (value) {
          return value.length === 2;
        },
        message: "Conversation must have exactly 2 participants",
      },
      required: true,
    },

    matchId: {
      type: Schema.Types.ObjectId,
      ref: "UserMatch",
      required: true,
      unique: true,
    },

    lastMessage: {
      type: String,
      default: "",
      trim: true,
    },

    lastMessageAt: {
      type: Date,
      default: null,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Fast query for user chat list
chatConversationSchema.index({
  participants: 1,
  lastMessageAt: -1,
});

const ChatConversation = model("ChatConversation", chatConversationSchema);

export default ChatConversation;
