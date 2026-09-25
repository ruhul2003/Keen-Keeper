import express from "express";
import { db } from "../lib/db.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Helper: Calculate friend status dynamically based on days_since_contact and goal
function calculateStatus(daysSinceContact, goal, snoozedUntil) {
  if (snoozedUntil && new Date(snoozedUntil) > new Date()) {
    return "Snoozed";
  }
  const days = Number(daysSinceContact) || 0;
  const target = Number(goal) || 14;

  if (days >= target) {
    return "overdue";
  } else if (days >= target * 0.7) {
    return "Almost due";
  }
  return "On Track";
}

// GET /api/friends - List all friends with optional search, filtering, and sorting
router.get("/", async (req, res) => {
  try {
    const { search, status, tag, sort, archived } = req.query;
    const query = {};

    // Filter by archived status
    if (archived === "true") {
      query.isArchived = true;
    } else {
      query.isArchived = { $ne: true };
    }

    // Search by name, email, or bio
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [{ name: regex }, { email: regex }, { bio: regex }, { tags: regex }];
    }

    // Filter by tag
    if (tag && tag !== "All") {
      query.tags = { $in: [new RegExp(`^${tag}$`, "i")] };
    }

    // Filter by status
    if (status && status !== "All") {
      query.status = status;
    }

    let sortQuery = { id: 1 };
    if (sort === "name-asc") {
      sortQuery = { name: 1 };
    } else if (sort === "name-desc") {
      sortQuery = { name: -1 };
    } else if (sort === "urgency") {
      sortQuery = { days_since_contact: -1 };
    } else if (sort === "goal") {
      sortQuery = { goal: 1 };
    }

    const friends = await db.collection("friends").find(query).sort(sortQuery).toArray();

    // Ensure status is normalized
    const enriched = friends.map((f) => {
      const dynamicStatus = calculateStatus(f.days_since_contact, f.goal, f.snoozedUntil);
      return {
        ...f,
        status: f.status || dynamicStatus,
      };
    });

    res.json(enriched);
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({ error: "Failed to fetch friends" });
  }
});

// GET /api/friends/:id - Get single friend by ID
router.get("/:id", async (req, res) => {
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

    const friend = await db.collection("friends").findOne(query);
    if (!friend) {
      return res.status(404).json({ error: "Friend not found" });
    }

    res.json(friend);
  } catch (error) {
    console.error("Error fetching friend:", error);
    res.status(500).json({ error: "Failed to retrieve friend" });
  }
});

// POST /api/friends - Create a new friend
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, picture, bio, goal, tags } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Friend name is required" });
    }

    // Determine the next integer ID
    const highestFriend = await db
      .collection("friends")
      .find({ id: { $type: "number" } })
      .sort({ id: -1 })
      .limit(1)
      .toArray();

    const nextId = highestFriend.length > 0 ? (highestFriend[0].id || 0) + 1 : 1;

    const goalNum = parseInt(goal, 10) || 14;
    const defaultPicture =
      picture && picture.trim()
        ? picture.trim()
        : `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80`;

    const nextDueDate = new Date(Date.now() + goalNum * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const parsedTags = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
      ? tags.split(",").map((t) => t.trim().toUpperCase()).filter(Boolean)
      : ["FRIEND"];

    const newFriend = {
      id: nextId,
      name: name.trim(),
      email: (email || "").trim(),
      phone: (phone || "").trim(),
      picture: defaultPicture,
      days_since_contact: 0,
      status: "On Track",
      tags: parsedTags,
      bio: (bio || "").trim(),
      goal: goalNum,
      next_due_date: nextDueDate,
      isArchived: false,
      snoozedUntil: null,
      notes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("friends").insertOne(newFriend);
    res.status(201).json({ ...newFriend, _id: result.insertedId });
  } catch (error) {
    console.error("Error creating friend:", error);
    res.status(500).json({ error: "Failed to create friend" });
  }
});

// PUT /api/friends/:id - Update friend
router.put("/:id", async (req, res) => {
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

    const { name, email, phone, picture, bio, goal, tags, days_since_contact } = req.body;
    const updateFields = { updatedAt: new Date() };

    if (name !== undefined) updateFields.name = name.trim();
    if (email !== undefined) updateFields.email = email.trim();
    if (phone !== undefined) updateFields.phone = phone.trim();
    if (picture !== undefined) updateFields.picture = picture;
    if (bio !== undefined) updateFields.bio = bio;
    if (days_since_contact !== undefined) updateFields.days_since_contact = Number(days_since_contact);

    if (goal !== undefined) {
      const g = parseInt(goal, 10) || 14;
      updateFields.goal = g;
      updateFields.next_due_date = new Date(Date.now() + g * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
    }

    if (tags !== undefined) {
      updateFields.tags = Array.isArray(tags)
        ? tags
        : typeof tags === "string"
        ? tags.split(",").map((t) => t.trim().toUpperCase()).filter(Boolean)
        : [];
    }

    // Re-evaluate status if goal or days_since_contact changed
    const current = await db.collection("friends").findOne(query);
    if (!current) {
      return res.status(404).json({ error: "Friend not found" });
    }

    const effectiveDays = updateFields.days_since_contact ?? current.days_since_contact;
    const effectiveGoal = updateFields.goal ?? current.goal;
    updateFields.status = calculateStatus(effectiveDays, effectiveGoal, current.snoozedUntil);

    await db.collection("friends").updateOne(query, { $set: updateFields });
    const updated = await db.collection("friends").findOne(query);
    res.json(updated);
  } catch (error) {
    console.error("Error updating friend:", error);
    res.status(500).json({ error: "Failed to update friend" });
  }
});

// DELETE /api/friends/:id - Delete friend and their activities
router.delete("/:id", async (req, res) => {
  try {
    const idParam = req.params.id;
    let query;
    let numericId = null;

    if (!isNaN(idParam)) {
      numericId = parseInt(idParam, 10);
      query = { id: numericId };
    } else if (ObjectId.isValid(idParam)) {
      query = { _id: new ObjectId(idParam) };
    } else {
      query = { id: idParam };
    }

    const friend = await db.collection("friends").findOne(query);
    if (!friend) {
      return res.status(404).json({ error: "Friend not found" });
    }

    await db.collection("friends").deleteOne(query);

    // Delete associated activities
    const activityQuery = numericId ? { friendId: numericId } : { friendId: friend.id };
    await db.collection("activities").deleteMany(activityQuery);

    res.json({ message: "Friend and associated activities removed successfully", id: friend.id });
  } catch (error) {
    console.error("Error deleting friend:", error);
    res.status(500).json({ error: "Failed to delete friend" });
  }
});

export default router;
