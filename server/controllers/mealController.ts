import { Request, Response, NextFunction } from "express";
import { mealService } from "../services/mealService.js";
import { AuthRequest } from "../middleware/authMiddleware.js";

// @desc    Get meals for a specific place
// @route   GET /api/v1/places/:placeId/meals
// @access  Public
export const getMealsByPlace = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const meals = await mealService.getMealsByPlace(req.params.placeId);
    res.json({ success: true, count: meals.length, data: meals });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's pending meals
// @route   GET /api/v1/meals/my-pending
// @access  Private
export const getMyPendingMeals = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as AuthRequest).user?._id.toString();
    if (!userId) {
      res.status(401);
      throw new Error("Not authorized");
    }

    const meals = await mealService.getMyPendingMeals(userId);

    res.json({
      success: true,
      count: meals.length,
      data: meals,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a meal
// @route   POST /api/v1/places/:placeId/meals
// @access  Private
export const createMeal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as AuthRequest).user?._id.toString();
    const meal = await mealService.createMeal(
      req.params.placeId,
      req.body,
      userId!
    );
    res.status(201).json({
      success: true,
      data: meal,
      message: "Meal submitted for approval",
    });
  } catch (error) {
    // Convert duplicate error to 409
    if (
      error instanceof Error &&
      (error.message === "DuplicateApproved" ||
        error.message === "DuplicatePending")
    ) {
      res.status(409).json({
        success: false,
        message:
          error.message === "DuplicateApproved"
            ? "This meal already exists and is approved."
            : "This meal is already pending approval.",
      });
      return;
    }
    next(error);
  }
};

// @desc    Update a meal
// @route   PUT /api/v1/meals/:id
// @access  Private/Admin
export const updateMeal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const meal = await mealService.updateMeal(req.params.id, req.body);
    res.json({ success: true, data: meal });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a meal
// @route   DELETE /api/v1/meals/:id
// @access  Private/Admin
export const deleteMeal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await mealService.deleteMeal(req.params.id);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};
