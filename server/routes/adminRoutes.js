const express = require("express");
const router = express.Router();
const {
  getPendingItems,
  approveItem,
  rejectItem,
} = require("../controllers/adminController");
const { protect, admin } = require("../middleware/authMiddleware");

// All routes are protected and admin-only
router.use(protect);
router.use(admin);

router.get("/pending", getPendingItems);
router.patch("/approve/:type/:id", approveItem);
router.delete("/reject/:type/:id", rejectItem);

module.exports = router;
