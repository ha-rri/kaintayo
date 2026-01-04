const Place = require("../models/Place");

// @desc    Get all places with filters
// @route   GET /api/v1/places
// @access  Public
const getPlaces = async (req, res) => {
  try {
    const { macro, micro, maxPrice, search, categories, amenities } = req.query;

    let query = { status: "active" };

    // 1. Filter by Macro Zone (Inside/Outside)
    if (macro) {
      query.zoneMacro = macro;
    }

    // 2. Filter by Price (budget <= min price of the place)
    if (maxPrice) {
      query["priceRange.min"] = { $lte: Number(maxPrice) };
    }

    // 3. Filter by Micro Zone (Exact Match)
    if (micro) {
      query.zoneMicro = micro;
    }

    // 4. Filter by Categories (OR Logic - Discovery)
    // "Show me Rice Meals OR Meryenda"
    if (categories) {
      const categoryArray = categories.split(",");
      query.categories = { $in: categoryArray };
    }

    // 5. Filter by Amenities (AND Logic - Constraint)
    // "Must have Wifi AND Aircon"
    if (amenities) {
      const amenityArray = amenities.split(",");
      query.amenities = { $all: amenityArray };
    }

    // 6. Search by Name
    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }];
    }

    const places = await Place.find(query).sort({ "priceRange.min": 1 });

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
const getPlace = async (req, res, next) => {
  try {
    const place = await Place.findById(req.params.id);

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
const updatePlace = async (req, res, next) => {
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
const deletePlace = async (req, res, next) => {
  try {
    const place = await Place.findById(req.params.id);

    if (!place) {
      res.status(404);
      throw new Error("Place not found");
    }

    // Trigger middleware to delete meals?
    // Place.js doesn't have a pre-remove hook for meals yet, but usually we should.
    // For MVP, simplistic delete is fine, or we can add logic here.
    // Ideally, we delete associated meals.
    // const Meal = require('../models/Meal');
    // await Meal.deleteMany({ place: req.params.id });

    // Using findByIdAndDelete vs remove()
    // remove triggers hooks, findByIdAndDelete might not depending on config.
    // Let's use deleteOne() on the document to be safe if we add hooks later.
    await place.deleteOne();

    res.json({ success: true, data: {}, message: "Place deleted" });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new place
// @route   POST /api/v1/places
// @access  Private
const createPlace = async (req, res, next) => {
  try {
    // Safety First: All submissions (even Admin) start as pending
    // This allows reviewing data before it goes live.
    const place = await Place.create({
      ...req.body,
      submittedBy: req.user.id,
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

module.exports = {
  getPlaces,
  getPlace,
  createPlace,
  updatePlace,
  deletePlace,
};
