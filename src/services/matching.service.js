import mongoose from "mongoose";
import User from "../models/user-register.js";
import UserProfile from "../models/user-profile.js";
import UserMatch from "../models/user-match.js";
import ChatConversation from "../models/chat-conversation.js";
import { sendPushNotification } from "./push-notification.service.js";

const { ObjectId } = mongoose.Types;

const getPair = (userId, targetUserId) => {
  const ids = [userId.toString(), targetUserId.toString()].sort();

  return {
    userA: ids[0],
    userB: ids[1],
  };
};

export const getDiscoverUsersService = async (userId) => {
  const matches = await UserMatch.find({
    $or: [{ userA: userId }, { userB: userId }],
  });

  const hiddenUserIds = matches
    .filter((match) => {
      // show unmatched users again
      if (match.status === "UNMATCHED") {
        return false;
      }

      // hide matched users
      if (match.status === "MATCHED") {
        return true;
      }

      // hide users already liked by current user
      return match.likedBy.some((id) => id.toString() === userId.toString());
    })
    .map((match) =>
      match.userA.toString() === userId.toString() ? match.userB : match.userA,
    );

  const users = await User.find({
    _id: {
      $nin: [userId, ...hiddenUserIds],
    },
    status: "ACTIVE",
    deletedAt: null,
  }).select("_id");

  const profiles = await UserProfile.find({
    userId: {
      $in: users.map((u) => u._id),
    },
  }).populate("userId", "email");

  return {
    status: 200,
    message: "Discover users fetched",
    data: profiles,
  };
};

export const createMatchService = async ({ userId, targetUserId }) => {
  if (!ObjectId.isValid(targetUserId)) {
    return {
      status: 400,
      message: "Invalid user id",
    };
  }

  if (userId.toString() === targetUserId.toString()) {
    return {
      status: 400,
      message: "You cannot like yourself",
    };
  }

  const targetUser = await User.findOne({
    _id: targetUserId,
    status: "ACTIVE",
    deletedAt: null,
  });

  if (!targetUser) {
    return {
      status: 404,
      message: "User not found",
    };
  }

  const pair = getPair(userId, targetUserId);

  let match = await UserMatch.findOne(pair);

  if (!match) {
    match = await UserMatch.create({
      ...pair,
      likedBy: [userId],
    });

    return {
      status: 200,
      message: "User liked",
      data: match,
    };
  }
  // If users unmatched before, restart match flow
  if (match?.status === "UNMATCHED") {
    match.status = "PENDING";
    match.unmatchedAt = null;
    match.unmatchedBy = null;
    match.matchedAt = null;

    // restart like flow
    match.likedBy = [userId];

    await match.save();

    return {
      status: 200,
      message: "User liked",
      data: match,
    };
  }
  const alreadyLiked = match.likedBy.some(
    (id) => id.toString() === userId.toString(),
  );

  if (alreadyLiked) {
    return {
      status: 400,
      message: "Already liked",
    };
  }

  match.likedBy.push(userId);

  if (match.likedBy.length === 2) {
    match.status = "MATCHED";
    match.matchedAt = new Date();

    await ChatConversation.findOneAndUpdate(
      {
        matchId: match._id,
      },
      {
        $set: {
          isActive: true,
        },
        $setOnInsert: {
          participants: [match.userA, match.userB],
          matchId: match._id,
        },
      },
      {
        upsert: true,
        new: true,
      },
    );
    // SEND PUSH TO BOTH USERS
    await Promise.all([
      sendPushNotification({
        userId: match.userA,
        title: "It's a Match 🎉",
        body: "You both liked each other",
        data: {
          type: "MATCH",
          matchId: match._id.toString(),
        },
      }),

      sendPushNotification({
        userId: match.userB,
        title: "It's a Match 🎉",
        body: "You both liked each other",
        data: {
          type: "MATCH",
          matchId: match._id.toString(),
        },
      }),
    ]);
  }

  await match.save();

  return {
    status: 200,
    message: match.status === "MATCHED" ? "It's a match" : "User liked",
    data: match,
  };
};

export const getMyMatchesService = async (userId) => {
  const matches = await UserMatch.find({
    status: "MATCHED",
    $or: [{ userA: userId }, { userB: userId }],
  });

  const userIds = matches.map((match) =>
    match.userA.toString() === userId.toString() ? match.userB : match.userA,
  );

  const profiles = await UserProfile.find({
    userId: { $in: userIds },
  }).populate("userId", "email");

  return {
    status: 200,
    message: "Matches fetched",
    data: profiles,
  };
};

export const unmatchService = async ({ userId, targetUserId }) => {
  if (!ObjectId.isValid(targetUserId)) {
    return {
      status: 400,
      message: "Invalid user id",
    };
  }

  if (userId.toString() === targetUserId.toString()) {
    return {
      status: 400,
      message: "Invalid operation",
    };
  }

  const pair = getPair(userId, targetUserId);

  const match = await UserMatch.findOne(pair);

  if (!match) {
    return {
      status: 404,
      message: "Match not found",
    };
  }

  // only matched users can unmatch
  if (match.status === "UNMATCHED") {
    return {
      status: 400,
      message: "Already unmatched",
    };
  }

  if (match.status !== "MATCHED") {
    return {
      status: 400,
      message: "You are not matched",
    };
  }

  // update match
  match.status = "UNMATCHED";
  match.unmatchedBy = userId;
  match.unmatchedAt = new Date();

  await match.save();

  // hide chat instead of deleting
  await ChatConversation.findOneAndUpdate(
    {
      matchId: match._id,
    },
    {
      $set: {
        isActive: false,
      },
    },
  );

  return {
    status: 200,
    message: "Unmatched successfully",
  };
};
