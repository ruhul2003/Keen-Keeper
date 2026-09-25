# 🔐 KeenKeeper — Backend API

Express.js server with Node.js, MongoDB Atlas database integration (`Keen-Keeper`), Better Auth authentication, and complete REST APIs for relationship tracking.

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

## 📡 API Endpoints

### Friends
- `GET /api/friends`: List friends with search, tag, status, and sort filters
- `GET /api/friends/:id`: Get friend by ID
- `POST /api/friends`: Create a new friend
- `PUT /api/friends/:id`: Update friend details
- `DELETE /api/friends/:id`: Delete friend and activities
- `PATCH /api/friends/:id/snooze`: Snooze reminders
- `PATCH /api/friends/:id/unsnooze`: Clear snooze
- `PATCH /api/friends/:id/archive`: Archive or unarchive
- `PATCH /api/friends/:id/goal`: Update contact goal cadence
- `POST /api/friends/:id/notes`: Add memory note
- `DELETE /api/friends/:id/notes/:noteId`: Remove note

### Activities & Timeline
- `GET /api/activities`: Fetch timeline interactions
- `POST /api/activities`: Log new interaction touchpoint
- `DELETE /api/activities/:id`: Delete interaction

### Analytics & Backup
- `GET /api/analytics/summary`: Comprehensive friendship health score and metrics
- `GET /api/backup/export`: JSON data backup download
