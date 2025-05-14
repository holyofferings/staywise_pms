import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { config } from "dotenv";
import path from "path";
import fs from "fs";

// Routes
import apiRoutes from "./routes";

// Load environment variables
config({ path: ".env.local" });

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use("/api", apiRoutes);

// Serve static files from the 'public' directory
if (fs.existsSync(path.join(__dirname, "../../public"))) {
  app.use(express.static(path.join(__dirname, "../../public")));
  
  // For SPA - redirect all non-API routes to index.html
  app.get("*", (req: Request, res: Response) => {
    // Skip API routes
    if (!req.path.startsWith("/api")) {
      res.sendFile(path.join(__dirname, "../../public", "index.html"));
    }
  });
}

// Error handling middleware - must be after routes
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Server error:", err);
  res.status(500).json({
    status: "error",
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

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