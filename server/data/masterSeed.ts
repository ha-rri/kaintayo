export interface SeedMeal {
  title: string;
  priceRegular: number;
  priceHalf?: number;
  isApproved: boolean;
}

export interface SeedPlace {
  name: string;
  zoneMacro: string;
  nearestLandmark: string;
  priceRange: {
    min: number;
    max: number;
  };
  amenities: string[];
  categories: string[];
  coverImage: string;
  status: "active" | "pending";
  meals: SeedMeal[];
}

export const MASTER_USERS = [
  {
    username: "StudentFoodie",
    email: "student@university.edu.ph",
    password: "password123",
    role: "user",
  },
  {
    username: "AdminUser",
    email: "admin@university.edu.ph",
    password: "password123",
    role: "admin",
  },
];

// Standardized Constants
// Categories: Rice Meals, Karinderya, Cafe, Meryenda, Drinks, Konbini, Fast Food, Unli Rice
// Amenities: Aircon, Wifi, Charging
// Zones: Gate 1 Side, Gate 2 Side, Gate 3 Side, Main Building, Library, Student Center

export const MASTER_PLACES: SeedPlace[] = [
  {
    name: "Streetside Lomi Haus",
    zoneMacro: "outside",
    nearestLandmark: "Gate 1 Side",
    priceRange: { min: 0, max: 0 },
    amenities: [],
    categories: ["Karinderya", "Meryenda"],
    coverImage:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400",
    status: "active",
    meals: [
      {
        title: "4pc Teriyaki Chicken w/ Rice",
        priceRegular: 169,
        isApproved: true,
      },
      { title: "Spamsilog", priceRegular: 89, isApproved: true },
      { title: "Sisigsilog", priceRegular: 89, isApproved: true },
      { title: "Lomi Solo", priceRegular: 89, priceHalf: 50, isApproved: true },
    ],
  },
  {
    name: "Campus Canteen",
    zoneMacro: "inside",
    nearestLandmark: "Main Building",
    priceRange: { min: 40, max: 70 },
    amenities: [],
    categories: ["Rice Meals", "Karinderya"],
    coverImage:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400",
    status: "active",
    meals: [
      {
        title: "Chicken Adobo",
        priceRegular: 65,
        priceHalf: 40,
        isApproved: true,
      },
      {
        title: "Pork Sinigang",
        priceRegular: 70,
        priceHalf: 45,
        isApproved: true,
      },
      { title: "Lumpia Shanghai", priceRegular: 40, isApproved: true },
    ],
  },
  {
    name: "Coffee Bean Café",
    zoneMacro: "inside",
    nearestLandmark: "Library",
    priceRange: { min: 85, max: 120 },
    amenities: ["Wifi", "Aircon", "Charging"],
    categories: ["Cafe", "Drinks"],
    coverImage:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",
    status: "active",
    meals: [
      { title: "Iced Caramel Latte", priceRegular: 120, isApproved: true },
      { title: "Blueberry Muffin", priceRegular: 85, isApproved: true },
    ],
  },
  {
    name: "Burger King Express",
    zoneMacro: "outside",
    nearestLandmark: "Gate 2 Side",
    priceRange: { min: 120, max: 180 },
    amenities: ["Aircon", "Wifi"],
    categories: ["Fast Food"],
    coverImage:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    status: "active",
    meals: [
      { title: "Whopper Meal", priceRegular: 180, isApproved: true },
      { title: "Chicken Fries", priceRegular: 120, isApproved: true },
    ],
  },
  {
    name: "Tapa King",
    zoneMacro: "outside",
    nearestLandmark: "Gate 3 Side",
    priceRange: { min: 90, max: 95 },
    amenities: ["Aircon"],
    categories: ["Rice Meals"],
    coverImage:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
    status: "active",
    meals: [
      { title: "Tapsilog", priceRegular: 95, isApproved: true },
      { title: "Bangsilog", priceRegular: 90, isApproved: true },
    ],
  },
  {
    name: "Student Hub Cafeteria",
    zoneMacro: "inside",
    nearestLandmark: "Student Center",
    priceRange: { min: 25, max: 50 },
    amenities: ["Wifi", "Aircon", "Charging"],
    categories: ["Karinderya", "Meryenda", "Drinks"],
    coverImage:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400",
    status: "active",
    meals: [
      {
        title: "Pancit Canton",
        priceRegular: 45,
        priceHalf: 25,
        isApproved: true,
      },
      { title: "Palabok", priceRegular: 50, priceHalf: 30, isApproved: true },
    ],
  },
  {
    name: "Mang Inasal",
    zoneMacro: "outside",
    nearestLandmark: "Gate 1 Side",
    priceRange: { min: 69, max: 159 },
    amenities: ["Aircon"],
    categories: ["Rice Meals", "Unli Rice", "Fast Food"],
    coverImage:
      "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400",
    status: "active",
    meals: [
      { title: "PM1 (Chicken Inasal)", priceRegular: 159, isApproved: true },
      { title: "Halo-Halo", priceRegular: 69, isApproved: true },
    ],
  },
  {
    name: "Milk Tea House",
    zoneMacro: "outside",
    nearestLandmark: "Gate 3 Side",
    priceRange: { min: 80, max: 90 },
    amenities: ["Aircon", "Wifi"],
    categories: ["Drinks"],
    coverImage:
      "https://images.unsplash.com/photo-1525385444071-b092b93ca120?w=400",
    status: "active",
    meals: [
      { title: "Classic Milk Tea", priceRegular: 80, isApproved: true },
      { title: "Taro Milk Tea", priceRegular: 90, isApproved: true },
    ],
  },
];
