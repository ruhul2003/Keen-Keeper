# 🔐 KeenKeeper — Backend API

Express.js server with Node.js, MongoDB database integration, and Better Auth authentication.

## 🛠️ Tech Stack
- **Server Framework**: Express.js
- **Database**: MongoDB (via `mongodb` official driver)
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
MONGODB_URI=mongodb://localhost:27017/keen_keeper
BETTER_AUTH_SECRET=keen_keeper_super_secret_auth_key_2026_change_in_prod
BETTER_AUTH_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
```

### 3. Run Development Server
```bash
npm run dev
```
The server will start listening at [http://localhost:5000](http://localhost:5000).

## 📡 API Endpoints
- **Health Check**: `GET /api/health`
- **API Status**: `GET /api/status`
- **Better Auth Routes**: `/api/auth/*` (handled automatically by Better Auth)
