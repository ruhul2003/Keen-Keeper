import dotenv from "dotenv";
import { client, db, connectDB } from "../lib/db.js";

dotenv.config();

const initialFriends = [
  {
    id: 1,
    name: "John Doe",
    picture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    email: "john@example.com",
    phone: "+1-555-0101",
    days_since_contact: 12,
    status: "overdue",
    tags: ["CLOSE FRIEND", "HIKING"],
    bio: "Met in university. Love hiking together in national parks.",
    goal: 14,
    next_due_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    isArchived: false,
    snoozedUntil: null,
    notes: [
      { id: "note_1", text: "Planning summer camping trip to Yosemite", date: new Date().toLocaleDateString() }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: "Sarah Khan",
    picture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    email: "sarah@example.com",
    phone: "+1-555-0102",
    days_since_contact: 5,
    status: "Almost due",
    tags: ["WORK", "MARKETING"],
    bio: "Colleague from office. Works in growth & digital marketing.",
    goal: 10,
    next_due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    isArchived: false,
    snoozedUntil: null,
    notes: [
      { id: "note_2", text: "Shared notes on the upcoming product launch campaign", date: new Date().toLocaleDateString() }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    name: "Ali Rahman",
    picture: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
    email: "ali@example.com",
    phone: "+1-555-0103",
    days_since_contact: 20,
    status: "overdue",
    tags: ["SCHOOL", "SPORTS"],
    bio: "School friend. Plays Sunday football and enjoys barbecue.",
    goal: 15,
    next_due_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    isArchived: false,
    snoozedUntil: null,
    notes: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4,
    name: "Emily Smith",
    picture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    email: "emily@example.com",
    phone: "+1-555-0104",
    days_since_contact: 2,
    status: "Almost due",
    tags: ["GYM", "FITNESS"],
    bio: "Met at local gym. Morning workout partner and marathon trainer.",
    goal: 7,
    next_due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    isArchived: false,
    snoozedUntil: null,
    notes: [
      { id: "note_3", text: "Aiming for 10k run together next weekend", date: new Date().toLocaleDateString() }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 5,
    name: "David Lee",
    picture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    email: "david@example.com",
    phone: "+1-555-0105",
    days_since_contact: 30,
    status: "overdue",
    tags: ["BUSINESS", "TECH"],
    bio: "Client & collaborator from freelance open-source project.",
    goal: 20,
    next_due_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    isArchived: false,
    snoozedUntil: null,
    notes: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 6,
    name: "Nusrat Jahan",
    picture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    email: "nusrat@example.com",
    phone: "+1-555-0106",
    days_since_contact: 8,
    status: "Almost due",
    tags: ["FAMILY"],
    bio: "Cousin living in upstate. Always brings homemade sweets.",
    goal: 12,
    next_due_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    isArchived: false,
    snoozedUntil: null,
    notes: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 7,
    name: "Michael Brown",
    picture: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
    email: "michael@example.com",
    phone: "+1-555-0107",
    days_since_contact: 16,
    status: "On Track",
    tags: ["ONLINE", "GAMING"],
    bio: "Met through online gaming Discord community. Co-op strategist.",
    goal: 10,
    next_due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    isArchived: false,
    snoozedUntil: null,
    notes: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 8,
    name: "Ayesha Islam",
    picture: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
    email: "ayesha@example.com",
    phone: "+1-555-0108",
    days_since_contact: 3,
    status: "Almost due",
    tags: ["UNIVERSITY", "RESEARCH"],
    bio: "Classmate at university. Collaborating on AI ethics paper.",
    goal: 7,
    next_due_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    isArchived: false,
    snoozedUntil: null,
    notes: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 9,
    name: "Rahul Sharma",
    picture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    email: "rahul@example.com",
    phone: "+1-555-0109",
    days_since_contact: 25,
    status: "On Track",
    tags: ["NEIGHBOR", "COMMUNITY"],
    bio: "Lives next door. Passionate about community gardening & books.",
    goal: 14,
    next_due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    isArchived: false,
    snoozedUntil: null,
    notes: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 10,
    name: "Fatima Noor",
    picture: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce",
    email: "fatima@example.com",
    phone: "+1-555-0110",
    days_since_contact: 6,
    status: "On Track",
    tags: ["FRIEND", "TRAVEL"],
    bio: "Travel buddy. Loves exploring historical cities and food markets.",
    goal: 10,
    next_due_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    isArchived: false,
    snoozedUntil: null,
    notes: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const initialActivities = [
  {
    id: 1001,
    friendId: 1,
    name: "John Doe",
    type: "Call",
    notes: "Discussed upcoming weekend hike and gear check.",
    time: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toLocaleString(),
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
  },
  {
    id: 1002,
    friendId: 2,
    name: "Sarah Khan",
    type: "Text",
    notes: "Quick check-in about presentation slides.",
    time: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleString(),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 1003,
    friendId: 4,
    name: "Emily Smith",
    type: "Video",
    notes: "Virtual workout session and nutrition tips catchup.",
    time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 1004,
    friendId: 10,
    name: "Fatima Noor",
    type: "Call",
    notes: "Shared photos from Kyoto and discussed next itinerary.",
    time: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toLocaleString(),
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
  },
  {
    id: 1005,
    friendId: 8,
    name: "Ayesha Islam",
    type: "Text",
    notes: "Sent paper references on algorithmic fairness.",
    time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleString(),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
];

async function seed() {
  console.log("🌱 Starting database seed for Keen-Keeper...");
  await connectDB();

  const friendsCol = db.collection("friends");
  const activitiesCol = db.collection("activities");

  // Create indexes
  await friendsCol.createIndex({ id: 1 }, { unique: true });
  await friendsCol.createIndex({ name: "text", email: "text", bio: "text" });
  await activitiesCol.createIndex({ friendId: 1 });
  await activitiesCol.createIndex({ createdAt: -1 });

  // Upsert initial friends
  for (const friend of initialFriends) {
    await friendsCol.updateOne(
      { id: friend.id },
      { $set: friend },
      { upsert: true }
    );
  }
  console.log(`✅ Seeded ${initialFriends.length} friends into 'friends' collection.`);

  // Upsert initial activities
  for (const activity of initialActivities) {
    await activitiesCol.updateOne(
      { id: activity.id },
      { $set: activity },
      { upsert: true }
    );
  }
  console.log(`✅ Seeded ${initialActivities.length} activities into 'activities' collection.`);

  console.log("🎉 Seeding completed successfully!");
  await client.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
