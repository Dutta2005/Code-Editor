# Code Editor (MERN)

This project now includes:
- React + Vite frontend code editor.
- Express + MongoDB backend for authentication and code history.
- Save, retrieve, and update code snippets per logged-in user.

## Features
- User registration and login with JWT auth via a dedicated `/login` page.
- Save code snippets to MongoDB history.
- Retrieve history and load snippets back into the editor.
- Update an existing saved snippet.
- Save button shows **"Please login first"** when not authenticated.

## Project Structure
- `src/` - React frontend.
- `server/` - Express + MongoDB backend.

## Setup

### 1) Frontend
```bash
npm install
npm run dev
```

### 2) Backend
```bash
cd server
npm install
cp .env.example .env
# update .env values
npm run dev
```

## Environment Variables

### Frontend (`.env` in repo root)
```bash
VITE_SERVER_URL=http://localhost:5000
```

### Backend (`server/.env`)
```bash
PORT=5000
MONGO_URI=mongodb+srv://codeeditor:codeeditor123@cluster0.k2wum.mongodb.net/code_editor
JWT_SECRET=your-strong-secret
CLIENT_URL=http://localhost:5173
```

## API Endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/history` (auth)
- `POST /api/history` (auth)
- `PUT /api/history/:id` (auth)
