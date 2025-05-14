import express from "express";
import roomRoutes from "./room.routes";

const router = express.Router();

// Health check route
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

// Mount room routes
router.use("/rooms", roomRoutes);

// Booking routes
router.get("/bookings", async (req, res) => {
  try {
    res.status(200).json({
      status: "success",
      message: "Bookings retrieved successfully",
      data: [] // We'll implement the actual data fetching later
    });
  } catch (error) {
    console.error("Error getting bookings:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to get bookings"
    });
  }
});

// User routes
router.get("/users", async (req, res) => {
  try {
    res.status(200).json({
      status: "success",
      message: "Users retrieved successfully",
      data: [] // We'll implement the actual data fetching later
    });
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to get users"
    });
  }
});

export default router; 