export const chatSwagger = {
  "/api/users/chat/conversations": {
    get: {
      tags: ["Chat"],
      summary: "Get 1:1 chat conversations",
      security: [{ userCookieAuth: [] }],
      responses: {
        200: {
          description: "Conversations fetched successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Conversations fetched successfully",
                  },
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        _id: {
                          type: "string",
                          example: "65f3c9e9f2a5b3d123456222",
                        },
                        participants: {
                          type: "array",
                          items: {
                            type: "object",
                          },
                        },
                        lastMessage: {
                          type: "string",
                          example: "Hey, how are you?",
                        },
                        lastMessageAt: {
                          type: "string",
                          format: "date-time",
                        },
                      },
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
      },
    },
  },
  "/api/users/chat/conversations/messages/{conversationId}": {
    get: {
      tags: ["Chat"],
      summary: "Get messages for a 1:1 conversation",
      security: [{ userCookieAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "conversationId",
          required: true,
          schema: {
            type: "string",
          },
        },
        {
          in: "query",
          name: "page",
          required: false,
          schema: {
            type: "integer",
            example: 1,
          },
        },
        {
          in: "query",
          name: "limit",
          required: false,
          schema: {
            type: "integer",
            example: 30,
          },
        },
      ],
      responses: {
        200: {
          description: "Messages fetched successfully",
        },
        400: {
          description: "Invalid conversation id",
        },
        401: {
          description: "Authentication required",
        },
        404: {
          description: "Conversation not found",
        },
      },
    },
    post: {
      tags: ["Chat"],
      summary: "Send a 1:1 message",
      security: [{ userCookieAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "conversationId",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["text"],
              properties: {
                text: {
                  type: "string",
                  example: "Hey, nice to match with you!",
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Message sent successfully",
        },
        400: {
          description: "Validation error or invalid conversation id",
        },
        401: {
          description: "Authentication required",
        },
        403: {
          description: "You can only message active matches",
        },
        404: {
          description: "Conversation not found",
        },
      },
    },
  },
};
