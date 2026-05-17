import mongoose from "mongoose";
import User from "../models/user-register.js";
import UserProfile from "../models/user-profile.js";
import UserMatch from "../models/user-match.js";
import ChatConversation from "../models/chat-conversation.js";

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
      // hide matched users
      if (match.status === "MATCHED") return true;

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
      { matchId: match._id },
      {
        $setOnInsert: {
          participants: [match.userA, match.userB],
          matchId: match._id,
        },
      },
      {
        upsert: true,
      },
    );
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
