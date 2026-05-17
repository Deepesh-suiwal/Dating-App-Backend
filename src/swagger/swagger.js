import swaggerUi from "swagger-ui-express";

import { userAuthSwagger } from "./user-auth.swagger.js";
import { userProfileSwagger } from "./user-profile.swagger.js";
import { env } from "../config/env.js";

export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Dating App API",
    version: "1.0.0",
    description: "API documentation for backend",
  },

  servers: [
    {
      url: env.BACKEND_URL || "http://localhost:3000",
      description: `${env.NODE_ENV} server`,
    },
  ],

  tags: [
    {
      name: "User Auth",
      description: "User authentication APIs",
    },
    {
      name: "User Profile",
      description: "User profile APIs",
    },
  ],
  components: {
    securitySchemes: {
      adminCookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "adminAccessToken",
      },
      userCookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "userAccessToken",
      },
      userResetPasswordAuth: {
        type: "apiKey",
        in: "cookie",
        name: "userResetToken",
      },
    },
  },
  paths: {
    ...userAuthSwagger,
    ...userProfileSwagger,
  },
};

export const swaggerUiServe = swaggerUi.serve;
export const swaggerUiSetup = swaggerUi.setup(swaggerSpec, {
  explorer: true,
});
