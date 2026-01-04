const Meal = require("../models/Meal");
const Place = require("../models/Place");

// @desc    Get meals for a specific place
// @route   GET /api/v1/places/:placeId/meals
// @access  Public
const getMealsByPlace = async (req, res, next) => {
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
const createMeal = async (req, res, next) => {
  try {
    req.body.place = req.params.placeId;
    req.body.submittedBy = req.user.id;

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
const updateMeal = async (req, res, next) => {
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
const deleteMeal = async (req, res, next) => {
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

module.exports = {
  getMealsByPlace,
  createMeal,
  updateMeal,
  deleteMeal,
};
