import {
  createMatchService,
  getDiscoverUsersService,
  getMyMatchesService,
} from "../services/matching.service.js";
import logger from "../utils/logger.js";

export const getDiscoverUsers = async (req, res) => {
  try {
    const result = await getDiscoverUsersService(req.user.userId);

    return res.status(result.status).json({
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    logger.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const likeUser = async (req, res) => {
  try {
    const result = await createMatchService({
      userId: req.user.userId,
      targetUserId: req.params.targetUserId,
    });

    return res.status(result.status).json({
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    logger.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getMyMatches = async (req, res) => {
  try {
    const result = await getMyMatchesService(req.user.userId);

    return res.status(result.status).json({
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    logger.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};
