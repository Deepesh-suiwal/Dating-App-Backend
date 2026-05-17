import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userMatchSchema = new Schema(
  {
    userA: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    userB: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    likedBy: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },

    status: {
      type: String,
      enum: ["PENDING", "MATCHED"],
      default: "PENDING",
    },

    matchedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

userMatchSchema.index({ userA: 1, userB: 1 }, { unique: true });

const UserMatch = model("UserMatch", userMatchSchema);

export default UserMatch;
