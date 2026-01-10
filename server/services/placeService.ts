import Place, { IPlace } from "../models/Place.js";

interface ShakeCriteria {
  maxBudget?: number;
  zoneMacro?: string;
}

interface GetAllPlacesParams {
  zoneMacro?: string;
  maxPrice?: string;
  search?: string;
  categories?: string;
  amenities?: string;
  scope?: "global" | "store";
  page?: number;
  limit?: number;
}

export const placeService = {
  /**
   * Get random places for the Shake feature
   */
  async getShakePlaces(criteria: ShakeCriteria) {
    // ✅ FIX: Define query as 'any' to bypass Mongoose type conflicts
    const query: any = { status: "active" };

    // 1. Budget Filter
    if (criteria.maxBudget) {
      query["priceRange.min"] = { $lte: criteria.maxBudget };
    }

    // 2. Zone Filter
    if (criteria.zoneMacro) {
      query.zoneMacro = criteria.zoneMacro;
    }

    // 3. Fetch minimal data needed for the Shake card
    return Place.find(query)
      .select("name zoneMacro nearestLandmark priceRange coverImage amenities categories")
      .lean();
  },

  /**
   * Get all places with full filtering (Search, Pagination, etc.)
   */
  async getAllPlaces(params: GetAllPlacesParams) {
    const {
      zoneMacro,
      maxPrice,
      search,
      categories,
      amenities,
      page = 1,
      limit = 10,
    } = params;

    // Build Query
    const query: any = { status: "active" };

    if (zoneMacro) query.zoneMacro = zoneMacro;
    
    if (maxPrice) {
      query["priceRange.min"] = { $lte: Number(maxPrice) };
    }

    if (search) {
      query.$text = { $search: search };
    }

    if (categories) {
      const cats = categories.split(",");
      query.categories = { $in: cats };
    }

    if (amenities) {
      const amens = amenities.split(",");
      query.amenities = { $in: amens };
    }

    // Execute Query with Pagination
    const skip = (page - 1) * limit;
    
    const places = await Place.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("submittedBy", "username");

    const total = await Place.countDocuments(query);

    return {
      count: places.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: places,
    };
  },

  /**
   * Check for duplicate pending places
   */
  async checkDuplicatePending(name: string) {
    const existing = await Place.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      status: "pending",
    });
    return existing;
  },
};