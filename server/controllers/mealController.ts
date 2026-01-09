import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/User.js";
import { mealService } from "../services/mealService.js";

// Interface for Protected Request (has user)
interface AuthRequest extends Request {
  user?: IUser;
}

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

    res.json({
      success: true,
      count: meals.length,
      data: meals,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a meal to a place
// @route   POST /api/v1/places/:placeId/meals
// @access  Private
export const createMeal = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      res.status(401);
      throw new Error("User not authenticated");
    }

    const meal = await mealService.createMeal(
      req.params.placeId,
      req.body,
      req.user._id.toString()
    );

    res.status(201).json({
      success: true,
      data: meal,
      message: "Meal submitted for review",
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Place not found") {
        res.status(404);
      }
      if (error.message === "DuplicateApproved") {
        res.status(409).json({
          success: false,
          message: "This meal is already on the menu.",
        });
        return;
      }
      if (error.message === "DuplicatePending") {
        res.status(409).json({
          success: false,
          message: "A request for this meal is currently pending review.",
        });
        return;
      }
    }
    next(error);
  }
};

// @desc    Update meal
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
    if (error instanceof Error && error.message === "Meal not found") {
      res.status(404);
    }
    next(error);
  }
};

// @desc    Delete meal
// @route   DELETE /api/v1/meals/:id
// @access  Private/Admin
export const deleteMeal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await mealService.deleteMeal(req.params.id);
    res.json({ success: true, data: {}, message: result.message });
  } catch (error) {
    if (error instanceof Error && error.message === "Meal not found") {
      res.status(404);
    }
    next(error);
  }
};
