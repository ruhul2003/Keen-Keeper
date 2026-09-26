const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Fetch friends from backend API with fallback to public/friends.json
 */
export async function fetchFriends(filters = {}) {
  const queryParams = new URLSearchParams();
  if (filters.search) queryParams.set("search", filters.search);
  if (filters.status && filters.status !== "All") queryParams.set("status", filters.status);
  if (filters.tag && filters.tag !== "All") queryParams.set("tag", filters.tag);
  if (filters.sort) queryParams.set("sort", filters.sort);
  if (filters.archived) queryParams.set("archived", "true");
  if (filters.favorites) queryParams.set("favorites", "true");

  try {
    const res = await fetch(`${API_BASE}/api/friends?${queryParams.toString()}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn("Backend API unavailable, falling back to local dataset:", err.message);
    // Fallback to local static json
    try {
      const res = await fetch("/friends.json");
      let data = await res.json();

      // Apply client-side filtering if backend fallback
      if (filters.favorites) {
        data = data.filter((f) => f.isFavorite === true);
      }
      if (filters.search) {
        const s = filters.search.toLowerCase();
        data = data.filter(
          (f) =>
            f.name.toLowerCase().includes(s) ||
            f.email.toLowerCase().includes(s) ||
            (f.bio && f.bio.toLowerCase().includes(s))
        );
      }
      if (filters.status && filters.status !== "All") {
        data = data.filter((f) => f.status === filters.status);
      }
      if (filters.tag && filters.tag !== "All") {
        data = data.filter((f) => f.tags && f.tags.includes(filters.tag));
      }
      return data;
    } catch (fallbackErr) {
      console.error("Failed to load local fallback:", fallbackErr);
      return [];
    }
  }
}

/**
 * Fetch single friend by ID
 */
export async function fetchFriendById(id) {
  try {
    const res = await fetch(`${API_BASE}/api/friends/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("Backend API unavailable, fetching friend from fallback:", err.message);
    const res = await fetch("/friends.json");
    const data = await res.json();
    return data.find((f) => String(f.id) === String(id)) || null;
  }
}

/**
 * Create a new friend
 */
export async function createFriend(friendData) {
  try {
    const res = await fetch(`${API_BASE}/api/friends`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(friendData),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || "Failed to create friend");
    }
    return await res.json();
  } catch (err) {
    console.error("Error creating friend:", err);
    throw err;
  }
}

/**
 * Update friend details
 */
export async function updateFriend(id, updateData) {
  try {
    const res = await fetch(`${API_BASE}/api/friends/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });
    if (!res.ok) throw new Error("Failed to update friend");
    return await res.json();
  } catch (err) {
    console.error("Error updating friend:", err);
    throw err;
  }
}

/**
 * Delete friend
 */
export async function deleteFriend(id) {
  try {
    const res = await fetch(`${API_BASE}/api/friends/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete friend");
    return await res.json();
  } catch (err) {
    console.error("Error deleting friend:", err);
    throw err;
  }
}

/**
 * Snooze friend reminders
 */
export async function snoozeFriend(id, days = 7) {
  const res = await fetch(`${API_BASE}/api/friends/${id}/snooze`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ days }),
  });
  if (!res.ok) throw new Error("Failed to snooze friend");
  return await res.json();
}

/**
 * Remove snooze from friend
 */
export async function unsnoozeFriend(id) {
  const res = await fetch(`${API_BASE}/api/friends/${id}/unsnooze`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error("Failed to unsnooze friend");
  return await res.json();
}

/**
 * Archive or unarchive a friend
 */
export async function archiveFriend(id, isArchived) {
  const res = await fetch(`${API_BASE}/api/friends/${id}/archive`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isArchived }),
  });
  if (!res.ok) throw new Error("Failed to update archive status");
  return await res.json();
}

/**
 * Toggle or set favorite/pinned status for a friend
 */
export async function toggleFavoriteFriend(id, isFavorite) {
  const res = await fetch(`${API_BASE}/api/friends/${id}/favorite`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isFavorite }),
  });
  if (!res.ok) throw new Error("Failed to update favorite status");
  return await res.json();
}

/**
 * Update relationship frequency goal
 */
export async function updateGoal(id, goal) {
  const res = await fetch(`${API_BASE}/api/friends/${id}/goal`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ goal }),
  });
  if (!res.ok) throw new Error("Failed to update goal");
  return await res.json();
}

/**
 * Add a note to friend
 */
export async function addFriendNote(id, text) {
  const res = await fetch(`${API_BASE}/api/friends/${id}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error("Failed to add note");
  return await res.json();
}

/**
 * Delete a friend note
 */
export async function deleteFriendNote(id, noteId) {
  const res = await fetch(`${API_BASE}/api/friends/${id}/notes/${noteId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete note");
  return await res.json();
}

/**
 * Fetch timeline activities
 */
export async function fetchActivities(filters = {}) {
  const queryParams = new URLSearchParams();
  if (filters.type && filters.type !== "All") queryParams.set("type", filters.type);
  if (filters.friendId) queryParams.set("friendId", filters.friendId);
  if (filters.search) queryParams.set("search", filters.search);

  try {
    const res = await fetch(`${API_BASE}/api/activities?${queryParams.toString()}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();

    // Also sync to localStorage for offline cache
    if (typeof window !== "undefined" && Array.isArray(data)) {
      try {
        localStorage.setItem("timeline", JSON.stringify(data));
      } catch {
        // ignore storage quota error
      }
    }
    return data;
  } catch (err) {
    console.warn("Backend API unavailable, falling back to localStorage timeline:", err.message);
    if (typeof window !== "undefined") {
      try {
        let local = JSON.parse(localStorage.getItem("timeline")) || [];
        if (filters.type && filters.type !== "All") {
          local = local.filter((item) => item.type === filters.type);
        }
        return local;
      } catch {
        return [];
      }
    }
    return [];
  }
}

/**
 * Log interaction activity
 */
export async function logActivity(activityData) {
  // Always update localStorage first for instantaneous responsiveness
  if (typeof window !== "undefined") {
    try {
      const existing = JSON.parse(localStorage.getItem("timeline")) || [];
      const newEntry = {
        id: Date.now(),
        name: activityData.name,
        type: activityData.type,
        time: activityData.time || new Date().toLocaleString(),
        notes: activityData.notes || "",
      };
      existing.unshift(newEntry);
      localStorage.setItem("timeline", JSON.stringify(existing));
    } catch (e) {
      console.error("Local storage error:", e);
    }
  }

  // Then send to backend
  try {
    const res = await fetch(`${API_BASE}/api/activities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(activityData),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Could not sync activity to backend:", err.message);
  }
  return { success: true };
}

/**
 * Delete activity
 */
export async function deleteActivity(id) {
  // Remove from localStorage
  if (typeof window !== "undefined") {
    try {
      let existing = JSON.parse(localStorage.getItem("timeline")) || [];
      existing = existing.filter((item) => String(item.id) !== String(id));
      localStorage.setItem("timeline", JSON.stringify(existing));
    } catch (e) {
      console.error(e);
    }
  }

  try {
    const res = await fetch(`${API_BASE}/api/activities/${id}`, {
      method: "DELETE",
    });
    return res.ok;
  } catch {
    return true;
  }
}

/**
 * Fetch analytics summary
 */
export async function fetchAnalyticsSummary() {
  try {
    const res = await fetch(`${API_BASE}/api/analytics/summary`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch analytics");
    return await res.json();
  } catch (err) {
    console.warn("Failed to fetch analytics summary, calculating fallback:", err.message);
    return null;
  }
}

/**
 * Fetch upcoming birthdays within 30 days
 */
export async function fetchUpcomingBirthdays() {
  try {
    const res = await fetch(`${API_BASE}/api/friends/upcoming/birthdays`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch birthdays");
    return await res.json();
  } catch (err) {
    console.warn("Backend birthdays endpoint unavailable, calculating locally:", err.message);
    try {
      const friends = await fetchFriends();
      const upcoming = [];
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      for (const friend of friends) {
        if (!friend.birthday) continue;
        const parts = String(friend.birthday).split("-");
        let month, day, year = null;
        if (parts.length === 3) {
          year = parseInt(parts[0], 10);
          month = parseInt(parts[1], 10);
          day = parseInt(parts[2], 10);
        } else if (parts.length === 2) {
          month = parseInt(parts[0], 10);
          day = parseInt(parts[1], 10);
        } else {
          continue;
        }

        if (isNaN(month) || isNaN(day)) continue;

        let nextBday = new Date(now.getFullYear(), month - 1, day);
        if (nextBday < today) {
          nextBday = new Date(now.getFullYear() + 1, month - 1, day);
        }

        const diffDays = Math.round((nextBday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays <= 30) {
          upcoming.push({
            id: friend.id,
            name: friend.name,
            picture: friend.picture,
            birthday: friend.birthday,
            daysRemaining: diffDays,
            isToday: diffDays === 0,
            turningAge: year ? nextBday.getFullYear() - year : null,
            formattedDate: nextBday.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          });
        }
      }

      upcoming.sort((a, b) => a.daysRemaining - b.daysRemaining);
      return upcoming;
    } catch {
      return [];
    }
  }
}

