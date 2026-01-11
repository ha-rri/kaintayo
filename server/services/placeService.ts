import { Filter } from "mongodb";
import mongoose from "mongoose";
import Place, { IPlace } from "../models/Place.js";
import Meal from "../models/Meal.js";
import { createAccentRegex } from "../utils/stringUtils.js";

interface GetAllPlacesParams {
  zoneMacro?: string;
  maxPrice?: string;
  search?: string;
  categories?: string;
  amenities?: string;
  scope?: "global" | "store" | string;
  page?: number;
  limit?: number;
  includePendingForUser?: string;
}

export const placeService = {
  /**
   * Get All Places with Advanced Filtering, Search, and Pagination
   */
  async getAllPlaces(params: GetAllPlacesParams) {
    const {
      zoneMacro,
      maxPrice,
      search,
      categories,
      amenities,
      scope,
      page = 1,
      limit = 10, // Default Limit
      includePendingForUser,
    } = params;

    const query: Filter<IPlace> = { status: "active" };

    // List of conditions to be combined with AND
    const andConditions: Filter<IPlace>[] = [];

    // 0. Base Status Scope Logic
    if (includePendingForUser) {
      // Hybrid Scope: Active Places OR My Pending Places
      delete query.status; // Remove strict "active" constraint
      andConditions.push({
        $or: [
          { status: "active" },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          { status: "pending", submittedBy: includePendingForUser as any },
        ],
      });
    } else {
      // Default: Strict Active
      // Logic handled by initial `query` { status: "active" }
      // But if we use $and, we might want to be explicit here if conflict arises,
      // though sticking to `query.status` is fine unless overwritten.
    }

    // 1. Zone Filter
    if (zoneMacro) {
      query.zoneMacro = zoneMacro as IPlace["zoneMacro"];
    }

    // 2. Price Filter
    if (maxPrice) {
      query["priceRange.min"] = { $lte: Number(maxPrice) };
    }

    // 3. Category Filter
    if (categories) {
      const categoryArray = categories.split(",");
      query.categories = { $in: categoryArray };
    }

    // 4. Amenities Filter
    if (amenities) {
      const amenityArray = amenities.split(",");
      query.amenities = { $all: amenityArray };
    }

    // 5. Search Logic (Accent Insensitive via Regex)
    if (search) {
      const regexPattern = "\\b" + createAccentRegex(search);
      const isStoreScope = scope === "store";
      const isLongEnough = search.length >= 2;

      const searchOrConditions: Filter<IPlace>[] = [
        { name: { $regex: regexPattern, $options: "i" } },
      ];

      if (!isStoreScope && isLongEnough) {
        // Only match APPROVED meals in search
        const matchedMeals = await Meal.find({
          title: { $regex: regexPattern, $options: "i" },
          isApproved: true,
        }).select("place");
        const placeIdsFromMeals = matchedMeals.map((m) => m.place);
        searchOrConditions.push({ _id: { $in: placeIdsFromMeals } });
      }

      // Add Search Scope to AND list
      andConditions.push({ $or: searchOrConditions });
    }

    // Final Assembly
    if (andConditions.length > 0) {
      if (andConditions.length === 1 && !query.status) {
        // Optimization: If only one complex condition and no status conflict
        query.$or = andConditions[0].$or;
      } else {
        query.$and = andConditions;
      }
    }

    // 6. Pagination Logic
    const skip = (page - 1) * limit;

    // Execute Query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const places = await Place.find(query as any)
      .populate({
        path: "meals",
        match: { isApproved: true }, // Filter: Only approved meals visible in directory
      })
      .populate("submittedBy", "username")
      .sort({ "priceRange.min": 1 })
      .skip(skip)
      .limit(limit);

    // Get Total Count for Meta
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const total = await Place.countDocuments(query as any);

    return {
      data: places,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Check for duplicate pending places (Fuzzy Match)
   */
  async checkDuplicatePending(name: string) {
    // Simple exact match check (case insensitive) for now.
    // Levinshtein distance would be overkill without a library.
    const existing = await Place.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      status: "pending",
    });

    return existing;
  },

  /**
   * Get Pending Places for a specific user
   */
  async getMyPendingPlaces(userId: string) {
    return Place.find({
      status: "pending",
      submittedBy: new mongoose.Types.ObjectId(userId),
    }).sort({ createdAt: -1 });
  },

  /**
   * Get all pending places for Admin
   */
  async getPendingPlaces() {
    return Place.find({ status: "pending" })
      .populate("submittedBy", "username email")
      .select(
        "name nearestLandmark coverImage startPhoto images createdAt submittedBy amenities categories zoneMacro"
      );
  },

  /**
   * Approve a place
   */
  async approvePlace(id: string) {
    const place = await Place.findById(id);
    if (!place) {
      throw new Error("Place not found");
    }

    place.status = "active";
    await place.save();
    return place;
  },

  /**
   * Delete (Reject) a place
   */
  async deletePlace(id: string) {
    const place = await Place.findById(id);
    if (!place) {
      throw new Error("Place not found");
    }

    // Cascade Delete: Delete all meals associated with this place
    await Meal.deleteMany({ place: id });

    await place.deleteOne();
    return { message: "Place and associated meals deleted" };
  },
};
