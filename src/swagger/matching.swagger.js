export const matchingSwagger = {
  "/api/users/matches/discover": {
    get: {
      tags: ["Matching"],
      summary: "Discover users for matching",
      security: [{ userCookieAuth: [] }],
      responses: {
        200: {
          description: "Discover users fetched successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Discover users fetched successfully",
                  },
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        userId: {
                          type: "string",
                          example: "65f3c9e9f2a5b3d123456789",
                        },
                        fullName: {
                          type: "string",
                          example: "Rahul Sharma",
                        },
                        avatar: {
                          type: "string",
                          example: "https://example.com/avatar.jpg",
                        },
                        bio: {
                          type: "string",
                          example: "Coffee, music and long walks",
                        },
                        city: {
                          type: "string",
                          example: "Jaipur",
                        },
                        gender: {
                          type: "string",
                          example: "MALE",
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
        500: {
          description: "Internal server error",
        },
      },
    },
  },
  "/api/users/matches": {
    get: {
      tags: ["Matching"],
      summary: "Get logged-in user's matches",
      security: [{ userCookieAuth: [] }],
      responses: {
        200: {
          description: "Matches fetched successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Matches fetched successfully",
                  },
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        matchId: {
                          type: "string",
                          example: "65f3c9e9f2a5b3d123456111",
                        },
                        matchedAt: {
                          type: "string",
                          format: "date-time",
                        },
                        user: {
                          type: "object",
                          properties: {
                            userId: {
                              type: "string",
                              example: "65f3c9e9f2a5b3d123456789",
                            },
                            fullName: {
                              type: "string",
                              example: "Priya Mehta",
                            },
                            avatar: {
                              type: "string",
                              example: "https://example.com/avatar.jpg",
                            },
                          },
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
  "/api/users/matches/like/{targetUserId}": {
    post: {
      tags: ["Matching"],
      summary: "Like a user profile",
      security: [{ userCookieAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "targetUserId",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        200: {
          description: "Profile liked or matched successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "It is a match",
                  },
                  data: {
                    type: "object",
                    properties: {
                      match: {
                        type: "object",
                      },
                      conversation: {
                        type: "object",
                        nullable: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid target user id",
        },
        401: {
          description: "Authentication required",
        },
        404: {
          description: "Target user not found",
        },
        409: {
          description: "Match already unmatched",
        },
      },
    },
  },
  "/api/users/matches/unmatch/{targetUserId}": {
    post: {
      tags: ["Matching"],
      summary: "Unmatch a matched user",
      security: [{ userCookieAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "targetUserId",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        200: {
          description: "User unmatched successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Unmatched successfully",
                  },
                },
              },
            },
          },
        },

        400: {
          description:
            "Invalid user id, invalid operation, already unmatched, or users are not matched",
        },

        401: {
          description: "Authentication required",
        },

        404: {
          description: "Match not found",
        },
      },
    },
  },
};
