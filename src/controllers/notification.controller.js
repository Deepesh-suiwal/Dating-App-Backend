import { syncFcmTokenService } from "../services/notification.service.js";
import logger from "../utils/logger.js";

export const syncFcmToken = async (req, res, next) => {
  try {
    const { fcmToken } = req.body;

    await syncFcmTokenService({
      sessionId: req.session._id,

      userId: req.user.userId,

      fcmToken,
    });

    logger.info(
      {
        userId: req.user._id,

        sessionId: req.session._id,
      },
      "FCM token synced",
    );

    return res.status(200).json({
      success: true,
      message: "FCM token synced successfully",
    });
  } catch (error) {
    logger.error(
      {
        error: error.message,
        stack: error.stack,
      },
      "Failed to sync FCM token",
    );

    next(error);
  }
};
