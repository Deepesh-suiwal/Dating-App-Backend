import express from "express";
import { verifyUserAccessToken } from "../middlewares/user-auth.middleware.js";
import {
  getDiscoverUsers,
  getMyMatches,
  likeUser,
} from "../controllers/matching-controller.js";

const router = express.Router();

router.use(verifyUserAccessToken);

router.get("/discover", getDiscoverUsers);

router.get("/", getMyMatches);

router.post("/like/:targetUserId", likeUser);

export default router;
