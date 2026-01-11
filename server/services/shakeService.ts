import Place, { IPlace } from "../models/Place.js";

interface ShakeCriteria {
  budget: number;
  zone?: "All" | "Inside Campus" | "Outside Campus";
  categories?: string; // Comma separated
  amenities?: string; // Comma separated
}

export const shakeService = {
  /**
   * Get a count of places matching the criteria
   */
  async getMatchCount(criteria: ShakeCriteria): Promise<number> {
    const query = buildQuery(criteria);
    return await Place.countDocuments(query);
  },

  /**
   * Get a single random place matching the criteria
   */
  async getRandomPlace(criteria: ShakeCriteria): Promise<IPlace | null> {
    const matchStage = { $match: buildQuery(criteria) };

    // 1. Get a random ID
    const [randomResult] = await Place.aggregate([
      matchStage,
      { $sample: { size: 1 } },
      { $project: { _id: 1 } }, // Optimization: Only fetch ID
    ]);

    if (!randomResult) return null;

    // 2. Fetch full document with virtuals populated
    return await Place.findById(randomResult._id).populate("meals");
  },
};

/**
 * Helper to build the Mongoose query object
 * Matches logic in placeService.ts
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildQuery(criteria: ShakeCriteria): any {
  const { budget, zone, categories, amenities } = criteria;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: any = {
    status: "active",
    "priceRange.min": { $lte: budget },
  };

  if (zone && zone !== "All") {
    // Map Frontend "Inside Campus" -> Backend "inside"
    const zoneKey = zone === "Inside Campus" ? "inside" : "outside";
    query.zoneMacro = zoneKey;
  }

  // Category Filter
  if (categories) {
    const categoryArray = categories.split(",");
    query.categories = { $in: categoryArray };
  }

  // Amenities Filter
  if (amenities) {
    const amenityArray = amenities.split(",");
    query.amenities = { $all: amenityArray };
  }

  return query;
}
