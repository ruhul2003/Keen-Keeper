# 🔐 KeenKeeper — Backend API

Express.js server with Node.js, MongoDB Atlas database integration (`Keen-Keeper`), Better Auth authentication, input validation, and complete REST APIs for relationship tracking.

## 🛠️ Tech Stack
- **Server Framework**: Express.js
- **Database**: MongoDB Atlas (`Keen-Keeper` database via official `mongodb` driver)
- **Authentication**: Better Auth (`better-auth` + `@better-auth/mongo-adapter`)
- **Runtime**: Node.js (ES Modules)

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/Keen-Keeper?appName=Tilux-server
DB_NAME=Keen-Keeper
BETTER_AUTH_SECRET=keen_keeper_super_secret_auth_key_2026_change_in_prod
BETTER_AUTH_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
```

### 3. Seed Database
Populate initial sample friends and activities into MongoDB:
```bash
npm run seed
```

### 4. Run Development Server
```bash
npm run dev
```
The server will start listening at [http://localhost:5000](http://localhost:5000).

### 5. Automated API Test Suite
Verify backend functionality and endpoints:
```bash
node scripts/test-api.js
```

---

## 📡 API Endpoints Reference

### Friends
- `GET /api/friends`: List friends with search, tag, status, favorites, and sort filters
- `GET /api/friends/upcoming/birthdays`: List friends with upcoming birthdays within next 30 days
- `GET /api/friends/:id`: Get friend details by ID
- `POST /api/friends`: Create a new friend (with validation and sanitization)
- `PUT /api/friends/:id`: Update friend details
- `DELETE /api/friends/:id`: Delete friend and cleanup associated activities
- `PATCH /api/friends/:id/favorite`: Toggle or set favorite pinned status
- `PATCH /api/friends/:id/snooze`: Snooze reminders for designated day count
- `PATCH /api/friends/:id/unsnooze`: Clear snooze state
- `PATCH /api/friends/:id/archive`: Toggle or set archive status
- `PATCH /api/friends/:id/goal`: Update contact goal cadence
- `POST /api/friends/:id/notes`: Add memory note or talking point
- `DELETE /api/friends/:id/notes/:noteId`: Remove a memory note

### Activities & Timeline
- `GET /api/activities`: Fetch timeline interactions with search, type, and sentiment filtering
- `POST /api/activities`: Log new interaction touchpoint (duration, location, mood, notes)
- `DELETE /api/activities/:id`: Delete interaction record

### Analytics & Data Backup
- `GET /api/analytics/summary`: Comprehensive friendship health score, channel breakdowns, and trends
- `GET /api/backup/export`: Download full database backup as structured JSON
- `POST /api/backup/import`: Restore or merge shelf connections from a JSON backup
