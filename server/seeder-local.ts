import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Place from "./models/Place.js";
import Meal from "./models/Meal.js";

dotenv.config();

// --- CONFIGURATION ---
// ON DEFENSE DAY: Open CMD, run 'ipconfig', and paste the IPv4 here.
const LAPTOP_IP = "192.168.1.XX";
const PORT = "5000";
const BASE_IMG_URL = `http://${LAPTOP_IP}:${PORT}/images`;

// --- SEED LOGIC ---
const seedDB = async () => {
  try {
    // FORCE LOCAL CONNECTION
    await mongoose.connect("mongodb://127.0.0.1:27017/kaintayo");
    console.log("Connected to LOCAL MongoDB");

    // 1. Clear Data
    await User.deleteMany({});
    await Place.deleteMany({});
    await Meal.deleteMany({});
    console.log("Cleared old data");

    // 2. Create Users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("123456", salt);

    const createdUsers = await User.create([
      {
        username: "Admin User",
        email: "admin@kaintayo.com",
        password: hashedPassword,
        role: "admin",
      },
      {
        username: "John Student",
        email: "student@kaintayo.com",
        password: hashedPassword,
        role: "user",
      },
    ]);

    const adminUser = createdUsers[0]._id;

    // 3. Create Places (With Local Images)
    // Note: You must ensure these images exist in server/public/images/
    const places = await Place.create([
      {
        submittedBy: adminUser,
        name: "Ate Rica's Bacsilog",
        zoneMacro: "Inside",
        zoneMicro: "Gate 1",
        amenities: ["Charging"],
        categories: ["Rice Meals"],
        status: "active",
        coverImage: `${BASE_IMG_URL}/bacsilog.jpg`,
      },
      {
        submittedBy: adminUser,
        name: "Jollibee",
        zoneMacro: "Outside",
        zoneMicro: "Gate 1",
        amenities: ["Aircon", "Wifi"],
        categories: ["Fast Food", "Chicken"],
        status: "active",
        coverImage: `${BASE_IMG_URL}/jollibee.jpg`,
      },
      {
        submittedBy: adminUser,
        name: "Dimsum Treats",
        zoneMacro: "Outside",
        zoneMicro: "Dapitan",
        amenities: ["Aircon"],
        categories: ["Siomai", "Rice Meals"],
        status: "active",
        coverImage: `${BASE_IMG_URL}/dimsum.jpg`,
      },
    ]);

    console.log("Places Seeded locally...");

    // 4. Create Meals
    await Meal.create([
      {
        submittedBy: adminUser,
        place: places[0]._id, // Bacsilog
        title: "Original Bacsilog",
        priceRegular: 69,
        isApproved: true,
      },
      {
        submittedBy: adminUser,
        place: places[0]._id,
        title: "Tapsilog",
        priceRegular: 85,
        isApproved: true,
      },
      {
        submittedBy: adminUser,
        place: places[1]._id, // Jollibee
        title: "1pc Chickenjoy w/ Rice",
        priceRegular: 89,
        isApproved: true,
      },
      {
        submittedBy: adminUser,
        place: places[2]._id, // Dimsum
        title: "Siomai Rice",
        priceRegular: 35,
        isApproved: true,
      },
    ]);

    console.log("Meals Seeded locally...");

    // 5. Force Price Recalculation
    await Meal.computePriceRange(places[0]._id);
    await Meal.computePriceRange(places[1]._id);
    await Meal.computePriceRange(places[2]._id);
    console.log("Price Ranges Calculated...");

    console.log("Local Seeding Complete!");

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
