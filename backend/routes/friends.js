import express from "express";
import { db } from "../lib/db.js";
import { ObjectId } from "mongodb";
import { validateFriendInput } from "../lib/validation.js";

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
    const { search, status, tag, sort, archived, favorites, favorite } = req.query;
    const query = {};

    // Filter by archived status
    if (archived === "true") {
      query.isArchived = true;
    } else {
      query.isArchived = { $ne: true };
    }

    // Filter by favorites / pinned
    if (favorites === "true" || favorite === "true") {
      query.isFavorite = true;
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

    let sortQuery = { isFavorite: -1, id: 1 };
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

// Helper: calculate upcoming birthday info within 30 days
function getBirthdayDetails(birthdayStr) {
  if (!birthdayStr) return null;
  const parts = String(birthdayStr).split("-");
  let month, day, year = null;
  if (parts.length === 3) {
    year = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10);
    day = parseInt(parts[2], 10);
  } else if (parts.length === 2) {
    month = parseInt(parts[0], 10);
    day = parseInt(parts[1], 10);
  } else {
    return null;
  }

  if (isNaN(month) || isNaN(day) || month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  let nextBday = new Date(currentYear, month - 1, day);

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (nextBday < today) {
    nextBday = new Date(currentYear + 1, month - 1, day);
  }

  const diffMs = nextBday.getTime() - today.getTime();
  const daysRemaining = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (daysRemaining > 30) {
    return null;
  }

  return {
    daysRemaining,
    isToday: daysRemaining === 0,
    turningAge: year ? nextBday.getFullYear() - year : null,
    formattedDate: nextBday.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  };
}

// GET /api/friends/upcoming/birthdays - List friends with birthdays within next 30 days
router.get("/upcoming/birthdays", async (req, res) => {
  try {
    const friends = await db
      .collection("friends")
      .find({
        isArchived: { $ne: true },
        birthday: { $exists: true, $ne: "" },
      })
      .toArray();

    const upcoming = [];
    for (const friend of friends) {
      const details = getBirthdayDetails(friend.birthday);
      if (details) {
        upcoming.push({
          id: friend.id,
          name: friend.name,
          picture: friend.picture,
          birthday: friend.birthday,
          ...details,
        });
      }
    }

    upcoming.sort((a, b) => a.daysRemaining - b.daysRemaining);
    res.json(upcoming);
  } catch (error) {
    console.error("Error fetching upcoming birthdays:", error);
    res.status(500).json({ error: "Failed to fetch upcoming birthdays" });
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
    const { name, email, phone, picture, bio, goal, tags, birthday } = req.body;

    const validation = validateFriendInput(req.body, false);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.errors[0], errors: validation.errors });
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
      birthday: birthday ? String(birthday).trim() : "",
      goal: goalNum,
      next_due_date: nextDueDate,
      isArchived: false,
      isFavorite: Boolean(req.body.isFavorite || false),
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

    const validation = validateFriendInput(req.body, true);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.errors[0], errors: validation.errors });
    }

    const { name, email, phone, picture, bio, goal, tags, days_since_contact, isFavorite, birthday } = req.body;
    const updateFields = { updatedAt: new Date() };

    if (name !== undefined) updateFields.name = name.trim();
    if (email !== undefined) updateFields.email = email.trim();
    if (phone !== undefined) updateFields.phone = phone.trim();
    if (picture !== undefined) updateFields.picture = picture;
    if (bio !== undefined) updateFields.bio = bio;
    if (birthday !== undefined) updateFields.birthday = String(birthday).trim();
    if (isFavorite !== undefined) updateFields.isFavorite = Boolean(isFavorite);
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

// PATCH /api/friends/:id/snooze - Snooze reminders for a friend
router.patch("/:id/snooze", async (req, res) => {
  try {
    const idParam = req.params.id;
    const days = parseInt(req.body.days, 10) || 7;
    const query = !isNaN(idParam) ? { id: parseInt(idParam, 10) } : { _id: new ObjectId(idParam) };

    const snoozedUntil = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    const updateResult = await db.collection("friends").findOneAndUpdate(
      query,
      {
        $set: {
          snoozedUntil: snoozedUntil,
          status: "Snoozed",
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    res.json(updateResult.value || updateResult);
  } catch (error) {
    console.error("Error snoozing friend:", error);
    res.status(500).json({ error: "Failed to snooze friend" });
  }
});

// PATCH /api/friends/:id/unsnooze - Remove snooze
router.patch("/:id/unsnooze", async (req, res) => {
  try {
    const idParam = req.params.id;
    const query = !isNaN(idParam) ? { id: parseInt(idParam, 10) } : { _id: new ObjectId(idParam) };

    const friend = await db.collection("friends").findOne(query);
    if (!friend) return res.status(404).json({ error: "Friend not found" });

    const newStatus = calculateStatus(friend.days_since_contact, friend.goal, null);
    const updateResult = await db.collection("friends").findOneAndUpdate(
      query,
      {
        $set: {
          snoozedUntil: null,
          status: newStatus,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    res.json(updateResult.value || updateResult);
  } catch (error) {
    console.error("Error un-snoozing friend:", error);
    res.status(500).json({ error: "Failed to un-snooze friend" });
  }
});

// PATCH /api/friends/:id/archive - Toggle or set archive status
router.patch("/:id/archive", async (req, res) => {
  try {
    const idParam = req.params.id;
    const query = !isNaN(idParam) ? { id: parseInt(idParam, 10) } : { _id: new ObjectId(idParam) };

    const friend = await db.collection("friends").findOne(query);
    if (!friend) return res.status(404).json({ error: "Friend not found" });

    const newArchived = req.body.isArchived !== undefined ? Boolean(req.body.isArchived) : !friend.isArchived;

    await db.collection("friends").updateOne(query, {
      $set: { isArchived: newArchived, updatedAt: new Date() },
    });

    const updated = await db.collection("friends").findOne(query);
    res.json(updated);
  } catch (error) {
    console.error("Error archiving friend:", error);
    res.status(500).json({ error: "Failed to update archive status" });
  }
});

// PATCH /api/friends/:id/favorite - Toggle or set favorite/pin status
router.patch("/:id/favorite", async (req, res) => {
  try {
    const idParam = req.params.id;
    const query = !isNaN(idParam) ? { id: parseInt(idParam, 10) } : { _id: new ObjectId(idParam) };

    const friend = await db.collection("friends").findOne(query);
    if (!friend) return res.status(404).json({ error: "Friend not found" });

    const newFavorite = req.body.isFavorite !== undefined ? Boolean(req.body.isFavorite) : !friend.isFavorite;

    await db.collection("friends").updateOne(query, {
      $set: { isFavorite: newFavorite, updatedAt: new Date() },
    });

    const updated = await db.collection("friends").findOne(query);
    res.json(updated);
  } catch (error) {
    console.error("Error updating favorite status:", error);
    res.status(500).json({ error: "Failed to update favorite status" });
  }
});

// PATCH /api/friends/:id/goal - Quickly update relationship cadence goal
router.patch("/:id/goal", async (req, res) => {
  try {
    const idParam = req.params.id;
    const goal = parseInt(req.body.goal, 10);
    if (!goal || goal <= 0) {
      return res.status(400).json({ error: "A positive goal day count is required" });
    }

    const query = !isNaN(idParam) ? { id: parseInt(idParam, 10) } : { _id: new ObjectId(idParam) };
    const friend = await db.collection("friends").findOne(query);
    if (!friend) return res.status(404).json({ error: "Friend not found" });

    const nextDueDate = new Date(Date.now() + goal * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    const newStatus = calculateStatus(friend.days_since_contact, goal, friend.snoozedUntil);

    await db.collection("friends").updateOne(query, {
      $set: {
        goal: goal,
        next_due_date: nextDueDate,
        status: newStatus,
        updatedAt: new Date(),
      },
    });

    const updated = await db.collection("friends").findOne(query);
    res.json(updated);
  } catch (error) {
    console.error("Error updating goal:", error);
    res.status(500).json({ error: "Failed to update relationship goal" });
  }
});

// POST /api/friends/:id/notes - Add a relationship memory / note
router.post("/:id/notes", async (req, res) => {
  try {
    const idParam = req.params.id;
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Note text is required" });
    }

    const query = !isNaN(idParam) ? { id: parseInt(idParam, 10) } : { _id: new ObjectId(idParam) };
    const newNote = {
      id: "note_" + Date.now(),
      text: text.trim(),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      createdAt: new Date(),
    };

    await db.collection("friends").updateOne(query, {
      $push: { notes: { $each: [newNote], $position: 0 } },
    });

    res.status(201).json(newNote);
  } catch (error) {
    console.error("Error adding note:", error);
    res.status(500).json({ error: "Failed to add note" });
  }
});

// DELETE /api/friends/:id/notes/:noteId - Remove a note
router.delete("/:id/notes/:noteId", async (req, res) => {
  try {
    const { id: idParam, noteId } = req.params;
    const query = !isNaN(idParam) ? { id: parseInt(idParam, 10) } : { _id: new ObjectId(idParam) };

    await db.collection("friends").updateOne(query, {
      $pull: { notes: { id: noteId } },
    });

    res.json({ message: "Note removed successfully", noteId });
  } catch (error) {
    console.error("Error removing note:", error);
    res.status(500).json({ error: "Failed to remove note" });
  }
});

export default router;
