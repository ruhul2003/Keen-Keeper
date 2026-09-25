import express from "express";
import { db } from "../lib/db.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// GET /api/activities - List all activities with optional filters
router.get("/", async (req, res) => {
  try {
    const { type, friendId, search, limit } = req.query;
    const query = {};

    if (type && type !== "All") {
      query.type = type;
    }

    if (friendId) {
      const parsedId = parseInt(friendId, 10);
      query.friendId = !isNaN(parsedId) ? parsedId : friendId;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [{ name: regex }, { notes: regex }, { type: regex }];
    }

    const maxResults = parseInt(limit, 10) || 100;
    const activities = await db
      .collection("activities")
      .find(query)
      .sort({ createdAt: -1 })
      .limit(maxResults)
      .toArray();

    res.json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ error: "Failed to fetch activities" });
  }
});

// POST /api/activities - Log a new interaction
router.post("/", async (req, res) => {
  try {
    const { friendId, name, type, notes, time, date } = req.body;

    if (!type) {
      return res.status(400).json({ error: "Activity type is required" });
    }

    let friendNumericId = friendId ? parseInt(friendId, 10) : null;
    let friendName = name;

    // If friendId provided, look up friend details to update contact stats
    let friend = null;
    if (friendNumericId) {
      friend = await db.collection("friends").findOne({ id: friendNumericId });
      if (friend && !friendName) {
        friendName = friend.name;
      }
    }

    const activityTime = time || new Date().toLocaleString();
    const createdAt = date ? new Date(date) : new Date();

    const newActivity = {
      id: Date.now(),
      friendId: friendNumericId || (friend ? friend.id : null),
      name: friendName || "Friend",
      type: type, // "Call" | "Text" | "Video" | "In-Person" | "Coffee/Hangout"
      notes: notes ? notes.trim() : "",
      time: activityTime,
      createdAt: createdAt,
    };

    const result = await db.collection("activities").insertOne(newActivity);

    // Update friend's contact history if friend exists
    if (friend) {
      const goal = friend.goal || 14;
      const nextDue = new Date(Date.now() + goal * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      await db.collection("friends").updateOne(
        { id: friend.id },
        {
          $set: {
            days_since_contact: 0,
            status: "On Track",
            last_contact_date: new Date(),
            next_due_date: nextDue,
            updatedAt: new Date(),
          },
        }
      );
    }

    res.status(201).json({ ...newActivity, _id: result.insertedId });
  } catch (error) {
    console.error("Error logging activity:", error);
    res.status(500).json({ error: "Failed to log interaction" });
  }
});

// DELETE /api/activities/:id - Delete an interaction entry
router.delete("/:id", async (req, res) => {
  try {
    const idParam = req.params.id;
    let query;

    if (!isNaN(idParam)) {
      query = { id: parseInt(idParam, 10) };
    } else if (ObjectId.isValid(idParam)) {
      query = { _id: new ObjectId(idParam) };
    } else {
      query = { id: idParam };
    }

    const deleted = await db.collection("activities").deleteOne(query);
    if (deleted.deletedCount === 0) {
      return res.status(404).json({ error: "Activity not found" });
    }

    res.json({ message: "Activity deleted successfully", id: idParam });
  } catch (error) {
    console.error("Error deleting activity:", error);
    res.status(500).json({ error: "Failed to delete activity" });
  }
});

export default router;
