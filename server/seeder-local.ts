import mongoose from "mongoose";
import dotenv from "dotenv";
import chalk from "chalk";
import User from "./models/User.js";
import Place from "./models/Place.js";
import Meal from "./models/Meal.js";
import { MASTER_PLACES, MASTER_USERS } from "./data/masterSeed.js";

dotenv.config();

// --- CONFIGURATION ---
// ON DEFENSE DAY: Open CMD, run 'ipconfig', and paste the IPv4 here.
const LAPTOP_IP = "192.168.1.XX";
const PORT = "5000";
const BASE_IMG_URL = `http://${LAPTOP_IP}:${PORT}/images`;

// Map Place Names to Local Image Files
// Uncomment these lines when you have the corresponding images in server/public/images/
const LOCAL_IMAGE_MAP: Record<string, string> = {
  // Existing Local Images (from previous version)
  // Note: These names must match MASTER_PLACES names exactly to take effect
  // "Ate Rica's Bacsilog": "/bacsilog.jpg", // Not in MASTER_PLACES currently

  // MASTER_PLACES Mapping
  "Streetside Lomi Haus": "/lomi.jpg",
  "Campus Canteen": "/canteen.jpg",
  "Coffee Bean Café": "/coffeebean.jpg",
  "Burger King Express": "/burgerking.jpg",
  "Tapa King": "/tapaking.jpg",
  "Student Hub Cafeteria": "/studenthub.jpg",
  "Mang Inasal": "/manginasal.jpg",
  "Milk Tea House": "/milktea.jpg",
};

// --- SEED LOGIC ---
const seedDB = async () => {
  try {
    // FORCE LOCAL CONNECTION
    await mongoose.connect("mongodb://127.0.0.1:27017/kaintayo");
    console.log(chalk.yellow("Connected to LOCAL MongoDB"));

    // 1. Clear Data
    await User.deleteMany({});
    await Place.deleteMany({});
    await Meal.deleteMany({});
    console.log(chalk.red("Cleared old data"));

    // 2. Create Users
    console.log(chalk.green("Creating Users..."));
    // Middleware wraps User.create, so plain text password will be hashed automatically
    const createdUsers = await User.create(MASTER_USERS);
    const mainUser = createdUsers[0]._id;

    console.log(
      chalk.green(`Seeding ${MASTER_PLACES.length} Places locally...`)
    );

    for (const placeData of MASTER_PLACES) {
      // 1. Determine Image URL: Local vs Remote
      // We check if the place name exists in our LOCAL_IMAGE_MAP (and is uncommented/truthy)
      const localImageName = LOCAL_IMAGE_MAP[placeData.name];

      // If found in map, use LOCAL URL. Else, use REMOTE URL (Unsplash).
      const finalCoverImage = localImageName
        ? `${BASE_IMG_URL}${localImageName}`
        : placeData.coverImage;

      // 2. Create Place
      const place = await Place.create({
        name: placeData.name,
        zoneMacro: placeData.zoneMacro,
        nearestLandmark: placeData.nearestLandmark,
        priceRange: placeData.priceRange,
        amenities: placeData.amenities,
        categories: placeData.categories,
        coverImage: finalCoverImage,
        status: placeData.status,
        submittedBy: mainUser,
      });

      // 3. Create Meals for this Place
      if (placeData.meals && placeData.meals.length > 0) {
        const mealsWithPlaceId = placeData.meals.map((meal) => ({
          ...meal,
          place: place._id,
          submittedBy: mainUser,
        }));
        await Meal.create(mealsWithPlaceId);
      }

      // 4. Force Recalculation
      await Meal.computePriceRange(place._id as mongoose.Types.ObjectId);
    }

    console.log(chalk.cyan.inverse("Local Seeding Complete!"));

    process.exit();
  } catch (err) {
    console.error(chalk.red.inverse(`Error: ${err}`));
    process.exit(1);
  }
};

// --- DESTROY LOGIC ---
const destroyData = async () => {
  try {
    // FORCE LOCAL CONNECTION
    await mongoose.connect("mongodb://127.0.0.1:27017/kaintayo");
    console.log(chalk.yellow("Connected to LOCAL MongoDB"));

    // Clear Data
    await User.deleteMany({});
    await Place.deleteMany({});
    await Meal.deleteMany({});

    console.log(chalk.red.inverse("Local Data Destroyed!"));
    process.exit();
  } catch (err) {
    console.error(chalk.red.inverse(`Error: ${err}`));
    process.exit(1);
  }
};

// --- EXECUTION ---
if (process.argv[2] === "-d") {
  destroyData();
} else {
  seedDB();
}
