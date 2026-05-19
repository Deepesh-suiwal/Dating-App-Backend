import express from "express";

import { syncFcmToken } from "../controllers/notification.controller.js";

import { verifyUserAccessToken } from "../middlewares/user-auth.middleware.js";

import { validate } from "../middlewares/validate.js";

import { syncFcmTokenSchema } from "../user-validation.js";

const router = express.Router();

router.use(verifyUserAccessToken);

router.post(
  "/sync-token",

  validate(syncFcmTokenSchema),

  syncFcmToken,
);

export default router;
