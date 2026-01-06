import { Request, Response, NextFunction } from "express";
import Meal from "../models/Meal.js";
import Place from "../models/Place.js";
import { IUser } from "../models/User.js";

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
    // Check if place exists for the Menu Screen; only Approved Meals
    const meals = await Meal.find({
      place: req.params.placeId,
      isApproved: true,
    }).sort({ priceRegular: 1 });

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
    req.body.place = req.params.placeId;

    // Ensure user exists (should be handled by protect, but for TS safety)
    if (!req.user) {
      res.status(401);
      throw new Error("User not authenticated");
    }
    req.body.submittedBy = req.user._id;

    const place = await Place.findById(req.params.placeId);
    if (!place) {
      res.status(404);
      throw new Error("Place not found");
    }

    // Moderation Logic: Always pending
    req.body.isApproved = false;

    const meal = await Meal.create(req.body);

    res.status(201).json({
      success: true,
      data: meal,
      message: "Meal submitted for review",
    });
  } catch (error) {
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
    const meal = await Meal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!meal) {
      res.status(404);
      throw new Error("Meal not found");
    }

    // Trigger price recalc for the place
    await Meal.computePriceRange(meal.place);

    res.json({ success: true, data: meal });
  } catch (error) {
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
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      res.status(404);
      throw new Error("Meal not found");
    }

    await meal.deleteOne(); // Triggers computePriceRange middleware

    res.json({ success: true, data: {}, message: "Meal deleted" });
  } catch (error) {
    next(error);
  }
};
