import admin from "../config/firebase.js";
import UserSession from "../models/user-session.js";

export const sendPushNotification = async ({
  userId,
  title,
  body,
  data = {},
}) => {
  try {
    // Get all active sessions having fcm token
    const sessions = await UserSession.find({
      userId,
      isActive: true,
      fcmToken: {
        $ne: null,
      },
    }).select("fcmToken");

    if (!sessions.length) {
      console.log("No active FCM tokens found");
      return;
    }

    // Remove duplicate tokens
    const tokens = [
      ...new Set(sessions.map((session) => session.fcmToken).filter(Boolean)),
    ];

    if (!tokens.length) {
      return;
    }

    // Send notification to all devices
    const response = await admin.messaging().sendEachForMulticast({
      tokens,

      notification: {
        title,
        body,
      },

      data: Object.keys(data).reduce((acc, key) => {
        acc[key] = String(data[key]);
        return acc;
      }, {}),
    });

    console.log(
      `Push sent: ${response.successCount} success, ${response.failureCount} failed`,
    );

    // Remove invalid tokens automatically
    if (response.failureCount > 0) {
      const failedTokens = [];

      response.responses.forEach((resp, index) => {
        if (!resp.success) {
          console.error(`Failed token: ${tokens[index]}`, resp.error?.message);

          // Invalid / expired token
          if (
            resp.error?.code ===
              "messaging/registration-token-not-registered" ||
            resp.error?.code === "messaging/invalid-registration-token"
          ) {
            failedTokens.push(tokens[index]);
          }
        }
      });

      // Remove invalid tokens from DB
      if (failedTokens.length) {
        await UserSession.updateMany(
          {
            fcmToken: {
              $in: failedTokens,
            },
          },
          {
            $set: {
              fcmToken: null,
            },
          },
        );

        console.log("Invalid FCM tokens removed");
      }
    }
  } catch (error) {
    console.error("Push notification error:", error);
  }
};
