import express from "express";
import { verifyUserAccessToken } from "../middlewares/user-auth.middleware.js";
import {
  getDiscoverUsers,
  getMyMatches,
  likeUser,
  unmatchUser,
} from "../controllers/matching-controller.js";

const router = express.Router();

router.use(verifyUserAccessToken);

router.get("/discover", getDiscoverUsers);

router.get("/", getMyMatches);

router.post("/like/:targetUserId", likeUser);

router.post("/unmatch/:targetUserId", unmatchUser);

export default router;
