import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { db } from "./db/db";

// Load environment variables
config({ path: ".env.local" });

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Basic routes
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running"
  });
});

// Room routes
app.get("/api/rooms", async (req, res) => {
  try {
    const rooms = await db.query.rooms.findMany();
    res.status(200).json({
      status: "success",
      message: "Rooms retrieved successfully",
      data: rooms
    });
  } catch (error) {
    console.error("Error getting rooms:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to get rooms"
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 