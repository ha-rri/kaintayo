import { Request, Response, NextFunction } from "express";
import Place from "../models/Place.js";
import Meal from "../models/Meal.js";

// @desc    Get all pending items (Places & Meals)
// @route   GET /api/v1/admin/pending
// @access  Private/Admin
export const getPendingItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Get Pending Places
    const pendingPlaces = await Place.find({ status: "pending" })
      .populate("submittedBy", "username email")
      .select("name zoneMicro coverImage createdAt submittedBy");

    // 2. Get Pending Meals
    const pendingMeals = await Meal.find({ isApproved: false })
      .populate("place", "name zoneMacro")
      .populate("submittedBy", "username email")
      .select("title priceRegular place createdAt submittedBy");

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
      const place = await Place.findById(id);
      if (!place) {
        res.status(404);
        throw new Error("Place not found");
      }

      place.status = "active";
      await place.save();

      return res.json({
        success: true,
        message: "Place approved!",
        data: place,
      });
    } else if (type === "meal") {
      const meal = await Meal.findById(id);
      if (!meal) {
        res.status(404);
        throw new Error("Meal not found");
      }

      meal.isApproved = true;
      await meal.save();

      // Trigger Price Calculation for the parent Place
      await Meal.computePriceRange(meal.place);

      return res.json({ success: true, message: "Meal approved!", data: meal });
    } else {
      res.status(400);
      throw new Error("Invalid type. Must be 'place' or 'meal'");
    }
  } catch (error) {
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
      const place = await Place.findById(id);
      if (!place) {
        res.status(404);
        throw new Error("Place not found");
      }

      await place.deleteOne();
      return res.json({ success: true, message: "Place rejected (deleted)." });
    } else if (type === "meal") {
      const meal = await Meal.findById(id);
      if (!meal) {
        res.status(404);
        throw new Error("Meal not found");
      }

      await meal.deleteOne();
      return res.json({ success: true, message: "Meal rejected (deleted)." });
    } else {
      res.status(400);
      throw new Error("Invalid type. Must be 'place' or 'meal'");
    }
  } catch (error) {
    next(error);
  }
};
