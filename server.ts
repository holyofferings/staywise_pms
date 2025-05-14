import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { parseRooms } from './src/lib/roomParserService.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
config({ path: ".env.local" });

// Create a mock DB object since we don't have the actual DB implementation
const mockDb = {
  query: {
    rooms: {
      findMany: async () => [],
      findFirst: async () => null
    },
    bookings: {
      findMany: async () => []
    },
    users: {
      findMany: async () => []
    }
  }
};

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger middleware
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Error handling middleware
app.use((err, _req, res, _next) => {
  console.error("Server error:", err);
  res.status(500).json({
    status: "error",
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

// API Routes
const apiRouter = express.Router();

// Health check route
apiRouter.get("/health", (_req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

// Room routes
apiRouter.get("/rooms", async (_req, res, next) => {
  try {
    const rooms = await mockDb.query.rooms.findMany();
    res.status(200).json({
      status: "success",
      message: "Rooms retrieved successfully",
      data: rooms
    });
  } catch (error) {
    next(error);
  }
});

apiRouter.get("/rooms/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const room = await mockDb.query.rooms.findFirst({
      where: (fields, { eq }) => eq(fields.id, id)
    });
    
    if (!room) {
      return res.status(404).json({
        status: "error",
        message: `Room with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      status: "success",
      message: "Room retrieved successfully",
      data: room
    });
  } catch (error) {
    next(error);
  }
});

// Booking routes
apiRouter.get("/bookings", async (_req, res, next) => {
  try {
    const bookings = await mockDb.query.bookings.findMany();
    res.status(200).json({
      status: "success",
      message: "Bookings retrieved successfully",
      data: bookings
    });
  } catch (error) {
    next(error);
  }
});

// User routes
apiRouter.get("/users", async (_req, res, next) => {
  try {
    const users = await mockDb.query.users.findMany();
    res.status(200).json({
      status: "success",
      message: "Users retrieved successfully",
      data: users
    });
  } catch (error) {
    next(error);
  }
});

// Room parsing endpoint
apiRouter.post('/rooms/parse', async (req, res, next) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    console.log("Parsing prompt:", prompt);
    const parsedRooms = await parseRooms(prompt);
    console.log("Generated rooms:", parsedRooms);
    
    return res.status(200).json({ 
      success: true, 
      rooms: parsedRooms,
      message: `Successfully parsed ${parsedRooms.length} room(s) from prompt`
    });
  } catch (error) {
    console.error("Error in /rooms/parse endpoint:", error);
    next(error);
  }
});

// Room creation endpoint
apiRouter.post('/rooms/create', async (req, res, next) => {
  try {
    const { rooms } = req.body;
    
    if (!rooms || !Array.isArray(rooms) || rooms.length === 0) {
      return res.status(400).json({ error: 'Valid rooms data is required' });
    }
    
    // In a real app, you would save these to a database
    // For now, we'll just echo them back
    
    return res.status(201).json({ 
      success: true, 
      rooms: rooms,
      message: `Successfully created ${rooms.length} room(s)`
    });
  } catch (error) {
    next(error);
  }
});

// Set the API router at the /api path
app.use("/api", apiRouter);

// Serve static files from the 'public' directory
if (fs.existsSync(path.join(__dirname, "public"))) {
  app.use(express.static(path.join(__dirname, "public")));
  
  // For SPA - redirect all non-API routes to index.html
  app.get("*", (req, res) => {
    // Skip API routes
    if (!req.path.startsWith("/api")) {
      res.sendFile(path.join(__dirname, "public", "index.html"));
    }
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} - http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled rejection at:", promise, "reason:", reason);
}); 