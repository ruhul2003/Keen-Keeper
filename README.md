# 🌿 KeenKeeper — Personal Relationship Shelf & CRM

> **KeenKeeper** is an intentional relationship CRM designed to help you nurture and keep close the friendships that matter most in your life. Set custom cadence goals, log touchpoints with duration, location, and sentiment, track relationship momentum, celebrate upcoming birthdays, and pin your favorites to the top of your shelf.

---

## ✨ Features

- **Personal Relationship Shelf**: View all close circles and friendships with real-time status badges (`On Track`, `Almost due`, `overdue`, `Snoozed`).
- **Favorite & Pinned Friends**: Pin your closest inner-circle relationships to the top of your shelf with one-click star toggles and quick "Favorites" filter.
- **Birthday & Celebration Alerts**: Automated tracking of upcoming birthdays within 30 days with a celebratory countdown banner.
- **Live Search, Filter & Sort**: Fast client and server-side searching by name, bio, and email, with category tag pills and sorting by urgency, name, or goal.
- **Dynamic Cadence Tracking**: Smart relationship frequency goals (e.g., connect every 7, 14, 30, or 60 days) with automated due date calculation.
- **Overdue Attention Banner**: Friendly, non-intrusive reminder alerts highlighting friends who haven't been contacted within their goal window.
- **Rich Interaction Logging**:
  - Track duration (minutes), location / hangout spot, and mood/sentiment (`Great` 😍, `Good` 😊, `Neutral` 😐, `Challenging` 🫂).
  - Activity types: Phone Calls, Messages / Texts, Video Calls, Coffee Hangouts, and Gifts.
- **Interactive Modals**:
  - **Add Friend Modal**: Preset avatars, custom cadence intervals, birthday picker, and circle tags.
  - **Edit Friend & Cadence Modal**: Adjust relationship frequency goals, birthday, and profile details.
  - **Log Touchpoint Modal**: Record calls, messages, video chats, and hangouts with conversation notes, duration, and spot to reset contact clock.
  - **Snooze Reminders Modal**: Temporarily pause alerts for friends who are busy or traveling.
  - **Delete Confirmation Modal**: Safe deletion with associated activity cleanup.
  - **Keyboard Shortcuts Modal**: Quick hotkeys guide for power users.
- **Friend Memories & Notes Journal**: Keep personal memory notes on family updates, recommendations, and shared memories.
- **Interaction Timeline**: Complete chronological history of all touchpoints with duration badges, location chips, sentiment indicators, and search.
- **Friendship Analytics & Health**:
  - Relationship health score percentage.
  - Communication channel breakdown chart.
  - 6-month touchpoint momentum trends.
  - Priority reconnection radar.
- **Data Backup, Export & Restore**: One-click download of all friendship records, notes, and activity history as structured JSON, plus an import/restore system.
- **Keyboard Navigation**: Press `?` for shortcuts, `n` for new friend, `h` for home, `t` for timeline, `s` for stats.
- **MongoDB Atlas Database**: Robust persistence in the `Keen-Keeper` database on MongoDB Atlas with automatic data validation and sanitization.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `?` | Open Keyboard Shortcuts Guide |
| `n` | Open Add New Friend dialog |
| `/` | Focus search bar |
| `h` | Jump to Friends Shelf (Home) |
| `t` | Jump to Interaction Timeline |
| `s` | Jump to Analytics & Health Stats |
| `Esc` | Close any open modal |

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI & Styling**: Tailwind CSS, DaisyUI
- **Icons**: React Icons (Remix Icons, FontAwesome 6, Phosphor)
- **Charts**: React Minimal Pie Chart
- **Notifications**: React-Toastify
- **Client Auth**: Better-Auth React Client

### Backend
- **Server**: Express.js (Node.js ES Modules)
- **Database**: MongoDB Atlas (`Keen-Keeper` database via official `mongodb` driver)
- **Authentication**: Better Auth with MongoDB Adapter
- **Validation**: Custom data validator & sanitizer utility
- **Environment**: Dotenv, CORS

---

## 🚀 Getting Started

### 1. Backend Setup

```bash
cd backend
npm install
```

Configure your `.env` in `backend/`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/Keen-Keeper?appName=Tilux-server
DB_NAME=Keen-Keeper
BETTER_AUTH_SECRET=keen_keeper_super_secret_auth_key_2026_change_in_prod
BETTER_AUTH_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
```

Seed initial sample friends and activities:
```bash
npm run seed
```

Start the backend API server:
```bash
npm run dev
```
The server will run on `http://localhost:5000`.

Run backend API tests:
```bash
node scripts/test-api.js
```

---

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Ensure `.env.local` is present in `frontend/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view KeenKeeper.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/friends` | List friends with search, tag, status, favorites, and sort filters |
| `GET` | `/api/friends/upcoming/birthdays` | List friends with upcoming birthdays within next 30 days |
| `GET` | `/api/friends/:id` | Get single friend details by ID |
| `POST` | `/api/friends` | Create a new friend (with validation and sanitization) |
| `PUT` | `/api/friends/:id` | Update friend profile and contact cadence |
| `DELETE` | `/api/friends/:id` | Remove friend and associated activities |
| `PATCH` | `/api/friends/:id/favorite` | Toggle or set favorite pinned status |
| `PATCH` | `/api/friends/:id/snooze` | Snooze reminder alerts for N days |
| `PATCH` | `/api/friends/:id/unsnooze` | Remove snooze from friend |
| `PATCH` | `/api/friends/:id/archive` | Toggle archive status |
| `PATCH` | `/api/friends/:id/goal` | Quickly adjust relationship goal frequency |
| `POST` | `/api/friends/:id/notes` | Add a memory note / journal entry |
| `DELETE` | `/api/friends/:id/notes/:noteId` | Remove a memory note |
| `GET` | `/api/activities` | Get interaction timeline with filters (duration, location, sentiment) |
| `POST` | `/api/activities` | Log touchpoint with duration, location, sentiment, notes |
| `DELETE` | `/api/activities/:id` | Delete an activity entry |
| `GET` | `/api/analytics/summary` | Get friendship health score, breakdown, and trends |
| `GET` | `/api/backup/export` | Download full JSON data backup |
| `POST` | `/api/backup/import` | Restore or merge shelf connections from a JSON backup |

---

## 📄 License
MIT © 2026 KeenKeeper
