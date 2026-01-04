const mongoose = require("mongoose");

const MealSchema = new mongoose.Schema(
  {
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place",
      required: true,
    },

    title: {
      type: String,
      required: [true, "Please provide a meal name"],
      trim: true,
    },

    // The Student Hack
    priceRegular: {
      type: Number,
      required: [true, "Please provide the regular price"],
    },
    priceHalf: {
      type: Number,
      // Optional: If exists, UI shows 1/2 icon
    },

    imageUrl: { type: String }, // Cloudinary URL

    // Moderation
    isApproved: {
      type: Boolean,
      default: false,
    }, // "Wizard of Oz" moderation

    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Static Method to get Price Range
MealSchema.statics.computePriceRange = async function (placeId) {
  try {
    const obj = await this.aggregate([
      {
        $match: { place: placeId, isApproved: true },
      },
      {
        $group: {
          _id: "$place",
          minPrice: { $min: "$priceRegular" },
          maxPrice: { $max: "$priceRegular" },
        },
      },
    ]);

    try {
      await mongoose.model("Place").findByIdAndUpdate(placeId, {
        priceRange: {
          min: obj[0]?.minPrice || 0,
          max: obj[0]?.maxPrice || 0,
        },
      });
    } catch (err) {
      console.error(err);
    }
  } catch (err) {
    console.error(err);
  }
};

// Call after SAVE
MealSchema.post("save", function () {
  this.constructor.computePriceRange(this.place);
});

// Call after DELETE
MealSchema.post("deleteOne", { document: true, query: false }, function () {
  this.constructor.computePriceRange(this.place);
});

module.exports = mongoose.model("Meal", MealSchema);
