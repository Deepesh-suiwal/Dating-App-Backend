import userSession from "../models/user-session.js";
import logger from "../utils/logger.js";

const findActiveSession = async ({ sessionId, userId }) => {
  return userSession.findOne({
    _id: sessionId,
    userId,
    isActive: true,
  });
};

export const syncFcmTokenService = async ({ sessionId, userId, fcmToken }) => {
  const session = await findActiveSession({
    sessionId,
    userId,
  });

  if (!session) {
    logger.warn(
      {
        sessionId,
        userId,
      },
      "Active session not found",
    );

    return null;
  }

  // Prevent unnecessary DB update
  if (session.fcmToken === fcmToken) {
    logger.info({ sessionId }, "FCM token already synced");

    return session;
  }

  session.fcmToken = fcmToken;

  await session.save();

  logger.info(
    {
      sessionId,
      userId,
    },
    "FCM token synced",
  );

  return session;
};
