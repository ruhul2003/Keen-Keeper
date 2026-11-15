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
  - Track duration (minutes), location / hangout spot, and mood/sentiment (`Great` 🌟, `Good` 😊, `Neutral` 😐, `Challenging` 🫂).
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

## 🛠️ Architecture & Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS, Lucide / React Icons, React Toastify
- **Backend**: Express.js, Node.js ES Modules, Better Auth
- **Database**: MongoDB Atlas (`Keen-Keeper` cluster)
- **Data Safety**: Automated data export and import with validation

---

## 🚀 Getting Started

### 1. Backend Setup
```bash
cd backend
npm install
npm run seed  # (optional initial seed)
npm run dev   # starts backend on port 5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev   # starts Next.js app on port 3000
```

Open [http://localhost:3000](http://localhost:3000) to view your relationship shelf!

---

## 🤝 Contributing Guidelines

1. **Code Standards**: Maintain modern ES Modules syntax across backend and frontend code.
2. **Commit Style**: Write clear, simple single-sentence commit messages in the imperative mood.
3. **Validation**: Always validate and sanitize user inputs before writing records to MongoDB.

---

## 🔒 Security & Data Privacy

- **Data Privacy**: All friend data and relationship logs remain under your control in your own database.
- **Backups**: Built-in JSON export and import allows offline portability and offline data backups anytime.
- **Authentication**: Modern session-based authentication powered by Better Auth.
