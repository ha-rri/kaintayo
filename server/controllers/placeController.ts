import { Request, Response, NextFunction } from "express";
import { Filter } from "mongodb";
import Place, { IPlace } from "../models/Place.js";
import Meal from "../models/Meal.js";
import { IUser } from "../models/User.js";

// Interface for Protected Request
interface AuthRequest extends Request {
  user?: IUser;
}

interface PlaceQueryParams {
  zoneMacro?: string;
  maxPrice?: string;
  search?: string;
  categories?: string;
  amenities?: string;
  scope?: "global" | "store";
}

// @desc    Get all places with filters
// @route   GET /api/v1/places
// @access  Public
export const getPlaces = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { zoneMacro, maxPrice, search, categories, amenities } =
      req.query as unknown as PlaceQueryParams;

    const query: Filter<IPlace> = { status: "active" };

    // 1. Filter by Macro Zone (Inside/Outside)
    if (zoneMacro) {
      query.zoneMacro = zoneMacro as IPlace["zoneMacro"];
    }

    // 2. Filter by Price (budget <= min price of the place)
    if (maxPrice) {
      // Mongoose supports 'priceRange.min' string path, but TS FilterQuery is stricter about keys.
      // Localized cast allows this specific operation while keeping the rest type-safe.
      query["priceRange.min"] = { $lte: Number(maxPrice) };
    }

    // 3. Filter by Categories (OR Logic - Discovery)
    // "Show me Rice Meals OR Meryenda"
    if (categories) {
      const categoryArray = categories.split(",");
      query.categories = { $in: categoryArray };
    }

    // 4. Filter by Amenities (AND Logic - Constraint)
    // "Must have Wifi AND Aircon"
    if (amenities) {
      const amenityArray = amenities.split(",");
      query.amenities = { $all: amenityArray };
    }

    // 5. Search Logic
    if (search) {
      // Escape regex characters
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      // Use Word Boundary (\b) for Name (Start of Word matching)
      const regexPattern = "\\b" + safeSearch;

      const isStoreScope = req.query.scope === "store";
      const isLongEnough = search.length >= 2;

      const orConditions: Filter<IPlace>[] = [
        { name: { $regex: regexPattern, $options: "i" } },
      ];

      // If Global Scope (Directory) AND Length >= 2, include Meals
      // (Prevents "f" matching "Chicken Fries", but allows "fri" or "fries" to match)
      if (!isStoreScope && isLongEnough) {
        // Find meals that match the search term (Start of Word)
        const matchedMeals = await Meal.find({
          title: { $regex: regexPattern, $options: "i" },
        }).select("place");
        const placeIdsFromMeals = matchedMeals.map((m) => m.place);

        orConditions.push({ _id: { $in: placeIdsFromMeals } });
      }

      query.$or = orConditions;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const places = await Place.find(query as any)
      .populate("meals") // Virtual Populate
      .populate("submittedBy", "username") // Get Username
      .sort({ "priceRange.min": 1 });

    res.json({
      success: true,
      count: places.length,
      data: places,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single place
// @route   GET /api/v1/places/:id
// @access  Public
export const getPlace = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const place = await Place.findById(req.params.id)
      .populate("meals")
      .populate("submittedBy", "username");

    if (!place) {
      res.status(404);
      throw new Error("Place not found");
    }

    res.json({ success: true, data: place });
  } catch (error) {
    next(error);
  }
};

// @desc    Update place
// @route   PUT /api/v1/places/:id
// @access  Private/Admin
export const updatePlace = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const place = await Place.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!place) {
      res.status(404);
      throw new Error("Place not found");
    }

    res.json({ success: true, data: place });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete place
// @route   DELETE /api/v1/places/:id
// @access  Private/Admin
export const deletePlace = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const place = await Place.findById(req.params.id);

    if (!place) {
      res.status(404);
      throw new Error("Place not found");
    }

    await place.deleteOne();

    res.json({ success: true, data: {}, message: "Place deleted" });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new place
// @route   POST /api/v1/places
// @access  Private
export const createPlace = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Safety First: All submissions (even Admin) start as pending
    // This allows reviewing data before it goes live.
    if (!req.user) {
      res.status(401);
      throw new Error("User not found");
    }
    const place = await Place.create({
      ...req.body,
      submittedBy: req.user._id,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      data: place,
      message: "Place submitted for review",
    });
  } catch (error) {
    next(error);
  }
};
