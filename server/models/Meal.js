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

module.exports = mongoose.model("Meal", MealSchema);
