import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// CORS setup for Frontend integration
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

// Better Auth handler - MUST be placed before express.json()
app.all("/api/auth/*", toNodeHandler(auth));

// Express JSON middleware for custom routes
app.use(express.json());

// Health Check Route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Sample Protected / General API route
app.get("/api/status", (req, res) => {
  res.json({
    message: "Keen-Keeper Backend API is running",
    environment: process.env.NODE_ENV || "development",
  });
});

// Connect Database and Start Server
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Backend server listening on http://localhost:${PORT}`);
    console.log(`🔐 Better Auth handling requests on http://localhost:${PORT}/api/auth/*`);
  });
}

startServer();
