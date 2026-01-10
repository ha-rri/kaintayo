import Meal from "../models/Meal.js";
import Place from "../models/Place.js";
import { createAccentRegex } from "../utils/stringUtils.js";

export const mealService = {
  /**
   * Get meals for a specific place (Approved only)
   */
  async getMealsByPlace(placeId: string) {
    return Meal.find({
      place: placeId,
      isApproved: true,
    }).sort({ priceRegular: 1 });
  },

  /**
   * Get all pending meals for Admin
   */
  async getPendingMeals() {
    return Meal.find({ isApproved: false })
      .populate("place", "name zoneMacro")
      .populate("submittedBy", "username email")
      .select("title priceRegular place createdAt submittedBy");
  },

  /**
   * Get Pending Meals for a specific user
   */
  async getMyPendingMeals(userId: string) {
    return Meal.find({
      isApproved: false,
      submittedBy: userId,
    })
      .populate("place", "name")
      .sort({ createdAt: -1 });
  },

  /**
   * Create a new meal (Always sets isApproved=false)
   */
  async createMeal(
    placeId: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any,
    userId: string
  ) {
    const place = await Place.findById(placeId);
    if (!place) {
      throw new Error("Place not found");
    }

    // Duplicate Check
    const regex = new RegExp(`^${createAccentRegex(data.title)}$`, "i");
    const existing = await Meal.findOne({
      place: placeId,
      title: { $regex: regex },
    });

    if (existing) {
      if (existing.isApproved) {
        throw new Error("DuplicateApproved");
      } else {
        throw new Error("DuplicatePending");
      }
    }

    const meal = await Meal.create({
      ...data,
      place: placeId,
      submittedBy: userId,
      isApproved: false, // Force moderation
    });

    return meal;
  },

  /**
   * Update a meal & Recalculate Place Price Range
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async updateMeal(id: string, data: any) {
    const meal = await Meal.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!meal) {
      throw new Error("Meal not found");
    }

    // Trigger price recalc for the place
    await Meal.computePriceRange(meal.place);

    return meal;
  },

  /**
   * Delete a meal & Recalculate Place Price Range
   */
  async deleteMeal(id: string) {
    const meal = await Meal.findById(id);

    if (!meal) {
      throw new Error("Meal not found");
    }

    await meal.deleteOne(); // Triggers computePriceRange middleware in Model
    return { message: "Meal deleted" };
  },

  /**
   * Approve a meal & Recalculate Price
   */
  async approveMeal(id: string) {
    const meal = await Meal.findById(id);
    if (!meal) {
      throw new Error("Meal not found");
    }

    meal.isApproved = true;
    await meal.save();

    // Trigger Price Calculation for the parent Place
    await Meal.computePriceRange(meal.place);

    return meal;
  },
};
