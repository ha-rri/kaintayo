import { Request, Response, NextFunction } from "express";
import { placeService } from "../services/placeService.js";
import { mealService } from "../services/mealService.js";

// @desc    Get all pending items (Places & Meals)
// @route   GET /api/v1/admin/pending
// @access  Private/Admin
export const getPendingItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Get Pending Places & Meals via Services
    const [pendingPlaces, pendingMeals] = await Promise.all([
      placeService.getPendingPlaces(),
      mealService.getPendingMeals(),
    ]);

    res.json({
      success: true,
      lastUpdated: new Date(),
      count: pendingPlaces.length + pendingMeals.length,
      data: {
        places: pendingPlaces,
        meals: pendingMeals,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve an item
// @route   PATCH /api/v1/admin/approve/:type/:id
// @access  Private/Admin
export const approveItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type, id } = req.params;

    if (type === "place") {
      const place = await placeService.approvePlace(id);
      return res.json({
        success: true,
        message: "Place approved!",
        data: place,
      });
    } else if (type === "meal") {
      const meal = await mealService.approveMeal(id);
      return res.json({ success: true, message: "Meal approved!", data: meal });
    } else {
      res.status(400);
      throw new Error("Invalid type. Must be 'place' or 'meal'");
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      res.status(404);
    }
    next(error);
  }
};

// @desc    Reject (Delete) an item
// @route   DELETE /api/v1/admin/reject/:type/:id
// @access  Private/Admin
export const rejectItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type, id } = req.params;

    if (type === "place") {
      await placeService.deletePlace(id);
      return res.json({ success: true, message: "Place rejected (deleted)." });
    } else if (type === "meal") {
      await mealService.deleteMeal(id);
      return res.json({ success: true, message: "Meal rejected (deleted)." });
    } else {
      res.status(400);
      throw new Error("Invalid type. Must be 'place' or 'meal'");
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      res.status(404);
    }
    next(error);
  }
};
