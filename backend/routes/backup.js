import express from "express";
import { db } from "../lib/db.js";

const router = express.Router();

// GET /api/backup/export - Export all friends and timeline activities as structured JSON
router.get("/export", async (req, res) => {
  try {
    const friends = await db.collection("friends").find().toArray();
    const activities = await db.collection("activities").find().sort({ createdAt: -1 }).toArray();

    const backupPayload = {
      app: "Keen-Keeper",
      version: "1.0.0",
      database: "Keen-Keeper",
      exportDate: new Date().toISOString(),
      counts: {
        friends: friends.length,
        activities: activities.length,
      },
      friends,
      activities,
    };

    res.setHeader("Content-Disposition", `attachment; filename=keen-keeper-backup-${new Date().toISOString().split("T")[0]}.json`);
    res.setHeader("Content-Type", "application/json");
    res.json(backupPayload);
  } catch (error) {
    console.error("Error exporting backup:", error);
    res.status(500).json({ error: "Failed to generate data backup" });
  }
});

export default router;
