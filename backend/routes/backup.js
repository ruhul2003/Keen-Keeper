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

// POST /api/backup/import - Restore friends and activities from JSON backup
router.post("/import", async (req, res) => {
  try {
    const { friends, activities, mode } = req.body;

    if (!Array.isArray(friends) && !Array.isArray(activities)) {
      return res.status(400).json({ error: "Invalid backup format: missing friends or activities array." });
    }

    let importedFriends = 0;
    let importedActivities = 0;

    // If mode is 'replace', clear existing data
    if (mode === "replace") {
      await db.collection("friends").deleteMany({});
      await db.collection("activities").deleteMany({});
    }

    if (Array.isArray(friends) && friends.length > 0) {
      for (const friend of friends) {
        const { _id, ...friendData } = friend;
        if (!friendData.name) continue;

        if (friendData.id) {
          await db.collection("friends").updateOne(
            { id: friendData.id },
            { $set: { ...friendData, updatedAt: new Date() } },
            { upsert: true }
          );
        } else {
          await db.collection("friends").insertOne({ ...friendData, createdAt: new Date() });
        }
        importedFriends++;
      }
    }

    if (Array.isArray(activities) && activities.length > 0) {
      for (const act of activities) {
        const { _id, ...actData } = act;
        if (!actData.type) continue;

        if (actData.id) {
          await db.collection("activities").updateOne(
            { id: actData.id },
            { $set: { ...actData } },
            { upsert: true }
          );
        } else {
          await db.collection("activities").insertOne({ ...actData, createdAt: new Date() });
        }
        importedActivities++;
      }
    }

    res.json({
      message: "Data backup restored successfully",
      importedFriends,
      importedActivities,
    });
  } catch (error) {
    console.error("Error importing backup:", error);
    res.status(500).json({ error: "Failed to restore backup data" });
  }
});

export default router;
