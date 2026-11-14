import express from "express";
import { db } from "../lib/db.js";

const router = express.Router();

/**
 * GET /api/analytics/summary - Comprehensive stats and friendship health metrics.
 * Aggregates cadence statuses, communication breakdown, health scores, and 6-month trends.
 */
router.get("/summary", async (req, res) => {
  try {
    const friendsCol = db.collection("friends");
    const activitiesCol = db.collection("activities");

    const nonArchivedFriends = await friendsCol.find({ isArchived: { $ne: true } }).toArray();
    const totalFriends = nonArchivedFriends.length;

    let onTrack = 0;
    let almostDue = 0;
    let overdue = 0;
    let snoozed = 0;

    const overdueList = [];

    // Calculate average days since contact across all active relationships
    const totalDaysSinceContact = nonArchivedFriends.reduce((acc, f) => acc + (Number(f.days_since_contact) || 0), 0);
    const averageDaysSinceContact = totalFriends > 0 ? Math.round(totalDaysSinceContact / totalFriends) : 0;

    for (const friend of nonArchivedFriends) {
      if (friend.snoozedUntil && new Date(friend.snoozedUntil) > new Date()) {
        snoozed++;
        continue;
      }

      const days = Number(friend.days_since_contact) || 0;
      const goal = Number(friend.goal) || 14;

      if (days >= goal) {
        overdue++;
        overdueList.push({
          id: friend.id,
          name: friend.name,
          picture: friend.picture,
          days_since_contact: days,
          goal: goal,
          overdueDays: days - goal,
          status: "overdue",
        });
      } else if (days >= goal * 0.7) {
        almostDue++;
      } else {
        onTrack++;
      }
    }

    // Sort overdue friends by most urgent
    overdueList.sort((a, b) => b.overdueDays - a.overdueDays);

    // Calculate interactions this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const interactionsThisMonth = await activitiesCol.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    const totalActivities = await activitiesCol.countDocuments();

    // Interaction type breakdown
    const typeAggregation = await activitiesCol
      .aggregate([
        {
          $group: {
            _id: "$type",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    const activityBreakdown = {
      Call: 0,
      Text: 0,
      Video: 0,
      Other: 0,
    };

    typeAggregation.forEach((item) => {
      if (item._id === "Call") activityBreakdown.Call = item.count;
      else if (item._id === "Text") activityBreakdown.Text = item.count;
      else if (item._id === "Video") activityBreakdown.Video = item.count;
      else activityBreakdown.Other += item.count;
    });

    // Health Score calculation (0 to 100%)
    const healthScore =
      totalFriends > 0
        ? Math.round(((onTrack + almostDue * 0.5) / totalFriends) * 100)
        : 100;

    /**
     * Compute 6-month touchpoint momentum trends.
     * Aggregates activity counts into chronological monthly buckets.
     */
    // Monthly trends (past 6 months)
    const monthlyTrends = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextD = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const monthLabel = d.toLocaleString("default", { month: "short" });

      const count = await activitiesCol.countDocuments({
        createdAt: { $gte: d, $lt: nextD },
      });

      monthlyTrends.push({
        month: monthLabel,
        count: count,
      });
    }

    res.json({
      totalFriends,
      onTrack,
      almostDue,
      overdue,
      snoozed,
      needAttention: almostDue + overdue,
      interactionsThisMonth: interactionsThisMonth || totalActivities,
      totalActivities,
      activityBreakdown,
      healthScore,
        averageDaysSinceContact,
      overdueList: overdueList.slice(0, 5),
      monthlyTrends,
    });
  } catch (error) {
    console.error("Error generating analytics summary:", error);
    res.status(500).json({ error: "Failed to compute analytics" });
  }
});

export default router;
