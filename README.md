# 🎬 Movie App — MERN Stack Movie Management Platform

A fully responsive, feature-rich movie management application built using the **MERN Stack**, inspired by IMDb’s UI patterns.  
Includes **JWT authentication**, **admin/user roles**, **pagination**, **sorting**, **search**, and a clean modern UI built in **React + MUI**.

🚀 **Live Frontend:** https://mern-movie-application.vercel.app  
🔗 **Backend API:** https://mern-movie-app-backend.vercel.app  
📦 **GitHub Repository:** https://github.com/sharmasagarr/mern-movie-app

---

## 📘 Table of Contents

- [Overview](#-Overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#%EF%B8%8F-architecture)
- [Frontend Structure](#-frontend-structure)
- [Backend Structure](#-backend-structure)
- [Installation](#%EF%B8%8F-installation)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Authentication Routes](#-authentication-routes)
- [Movie Routes](#-movie-routes)
- [Database Schema](#%EF%B8%8F-database-schema)
- [Authentication Flow](#-authentication-flow)
- [Admin Features](#%EF%B8%8F-admin-features)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

# 📖 Overview

**Movie App** allows users to browse movies in both **Table View** (IMDb style) and **Grid View** (Netflix card grid).  
Admins can manage movies with **Add / Edit / Delete** functionalities.

Users can:
- Browse paginated movie lists  
- View movie details  
- Search & sort  
- Enjoy a mobile-responsive UI  
- Login/Register with JWT  

Admins additionally can:
- Add movies  
- Edit movies  
- Delete movies  

---

# ✨ Features

### 👤 User Features
- View movies in table & grid layout  
- Pagination  
- Search by title  
- Sort by rating, year, duration  
- Movie detail page  
- Responsive mobile-friendly UI  
- JWT authentication  

### 👨‍💼 Admin Features
- Add new movie  
- Edit movie  
- Delete movie  
- Admin-only actions on UI

### ⚙️ Backend Features
- Secure JWT authentication  
- Password hashing via bcrypt  
- Protected routes  
- Role-based authorization  
- Mongoose schemas + indexes  

---

# 🧰 Tech Stack

### Frontend
- React 19
- Material UI
- Axios
- React Router v7
- Context API
- Vite

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose ORM
- JWT + bcrypt
- CORS middleware

### Deployment
- Vercel (Frontend)
- Vercel (Backend)
- MongoDB Atlas

---

# 🏗️ Architecture

```
React (UI) → Axios → Express API → MongoDB
```

---

# 📁 Frontend Structure

```
frontend/
└── src/
    ├── api/
    │   └── axiosClient.js
    │
    ├── components/
    │   ├── Layout/
    │   │   ├── Navbar.jsx
    │   │   └── ProtectedRoute.jsx
    │   │
    │   └── Movies/
    │       ├── MovieDetailView.jsx
    │       ├── MovieGridView.jsx
    │       └── MovieCompactView.jsx
    │
    ├── context/
    │   └── AuthContext.jsx
    │
    ├── pages/
    │   ├── HomePage.jsx
    │   ├── SearchPage.jsx
    │   ├── AddMoviePage.jsx
    │   ├── EditMoviePage.jsx
    │   ├── LoginPage.jsx
    │   └── MovieDetailPage.jsx
    │
    ├── App.jsx
    └── main.jsx
```

---

# 📁 Backend Structure

```
backend/
│
├── models/
│   ├── Movie.js
│   └── User.js
│
├── utils/
│   └── job.js
│
├── controllers/
│   ├── movieController.js
│   └── authController.js
│
├── middleware/
│   ├── auth.js
│   └── errorHandler.js
│
├── routes/
│   ├── movieRoutes.js
│   └── authRoutes.js
│
├── queue/
│   └── movieQueue.js
│
├── config/
│   └── db.js
│
└── index.js
```

---

# ⚙️ Installation

Clone the project:

```bash
git clone https://github.com/sharmasagarr/mern-movie-app.git
cd mern-movie-app
```

---

# 🛠️ Backend Setup

```bash
cd backend
npm install
```

Create `.env`:

```
PORT=5000
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret_key
CLIENT_ORIGIN=http://localhost:4000
NODE_ENV=development
```

Run backend:

```bash
npm run dev
```

---

# 🎨 Frontend Setup

```bash
cd frontend
npm install
```

Create `.env`:

```
VITE_API_URL=http://localhost:5000/api
NODE_ENV=development
```

Run frontend:

```bash
npm run dev
```

---

# 🔐 Environment Variables

### Backend

| Key | Description |
|-----|-------------|
| MONGODB_URI | MongoDB Atlas URL |
| JWT_SECRET | Secret for signing JWT |
| CLIENT_ORIGIN | Allowed frontend URL |
| PORT | Backend server port |

### Frontend

| Key | Description |
|-----|-------------|
| VITE_API_URL | Base API URL |

---

# 📚 API Documentation

### Base URL  
`https://mern-movie-app-backend.vercel.app`

---

## 🔑 Authentication Routes

### POST `/auth/register`

### POST `/auth/login`

---

## 🎬 Movie Routes

### GET /movies?page=1&limit=10

### GET /movies/sorted?sortBy=rating&order=desc&page=1&limit=10

### GET /movies/search?q=keyword

### GET /movies/:id

### POST /movies (Admin only)

### PUT /movies/:id (Admin only)

### DELETE /movies/:id (Admin only)

---

# 🗄️ Database Schema

### Movie

```js
{
  title: String,
  description: String,
  releaseDate: Date,
  rating: Number,
  duration: Number,
  imdbId: String,
  posterUrl: String,
  jobId: String
}
```

### User

```js
{
  name: String,
  email: String,
  password: String,
  role: "user" | "admin"
}
```

---

# 🔐 Authentication Flow

```
User logs in → Backend issues JWT → Stored in frontend context → Axios sends token in headers → Protected routes checked via middleware
```

---

# 🛠️ Admin Features

- Add movies  
- Edit movie details  
- Delete movies  
- Access admin-only actions in UI  

---

# 🚀 Deployment

### Frontend (Vercel)
- Set env: `VITE_API_URL`
- Deploy

### Backend (Vercel)
- Add `.env` vars  
- Deploy  
- Ensure CORS reflects frontend URL  

### Database (MongoDB Atlas)
- Add IP whitelist  
- Replace cluster URL in `.env`  

---

# 🧩 Troubleshooting

| Issue | Fix |
|-------|-----|
| Movies not showing | Check API URL in frontend |
| CORS blocked | Add frontend URL to backend CORS |
| JWT invalid | Re-login; token expired |
| MongoDB error | Verify correct connection string |

---

# 📄 License

MIT License © 2025

---

# 🎉 Final Notes

This project uses **clean code**, **modular architecture**, and modern **React + MUI** standards.  
The README is formatted to be professional and hiring-manager friendly.

Enjoy building! 🚀