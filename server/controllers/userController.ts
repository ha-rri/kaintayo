import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/authMiddleware.js";
import { userService } from "../services/userService.js";

// @desc    Get user favorites
// @route   GET /api/v1/users/favorites
// @access  Private
export const getFavorites = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401);
      throw new Error("Not authorized");
    }

    const favorites = await userService.getFavorites(userId.toString());

    res.json({
      success: true,
      count: favorites.length,
      data: favorites,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle favorite status
// @route   POST /api/v1/users/favorites/:placeId
// @access  Private
export const toggleFavorite = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { placeId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401);
      throw new Error("Not authorized");
    }

    const result = await userService.toggleFavorite(userId.toString(), placeId);

    res.json({
      success: true,
      isFavorite: result.isFavorite,
      message: result.isFavorite
        ? "Added to favorites"
        : "Removed from favorites",
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      res.status(404);
    }
    next(error);
  }
};
