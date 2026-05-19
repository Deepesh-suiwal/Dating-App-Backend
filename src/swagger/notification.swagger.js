export const notificationSwagger = {
  "/api/users/notifications/sync-token": {
    post: {
      tags: ["Notifications"],

      summary: "Sync FCM token",

      description:
        "Save or update the FCM token for the currently active session",

      security: [
        {
          userCookieAuth: [],
        },
      ],

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              type: "object",

              required: ["fcmToken"],

              properties: {
                fcmToken: {
                  type: "string",

                  example: "fcm_token_abc123xyz",
                },
              },
            },
          },
        },
      },

      responses: {
        200: {
          description: "FCM token synced successfully",

          content: {
            "application/json": {
              schema: {
                type: "object",

                properties: {
                  success: {
                    type: "boolean",

                    example: true,
                  },

                  message: {
                    type: "string",

                    example: "FCM token synced successfully",
                  },
                },
              },
            },
          },
        },

        400: {
          description: "Validation error",

          content: {
            "application/json": {
              schema: {
                type: "object",

                properties: {
                  errors: {
                    type: "array",

                    items: {
                      type: "object",
                    },
                  },
                },
              },
            },
          },
        },

        401: {
          description: "Authentication required",
        },

        404: {
          description: "Active session not found",
        },

        500: {
          description: "Internal server error",
        },
      },
    },
  },
};
