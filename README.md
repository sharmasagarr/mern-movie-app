# 🎬 MERN Stack Movie Application

A full-stack movie web application built with MERN (MongoDB, Express, React, Node.js) stack featuring role-based access control, advanced search/filtering, and admin management capabilities.

**Live Demo:** [Your Deployed Frontend URL]  
**API Documentation:** [Your API Base URL]  
**GitHub Repository:** [Your GitHub Link]

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [Authentication & Authorization](#authentication--authorization)
- [Features Guide](#features-guide)
- [Deployment](#deployment)
- [Performance Optimization](#performance-optimization)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### 👤 User Features
- ✅ View all movies with pagination (IMDb Top 250 reference)
- ✅ Search movies by title or description
- ✅ Filter movies by year, rating, and duration
- ✅ Sort movies by name, rating, release date, and duration
- ✅ View detailed movie information
- ✅ Responsive mobile-friendly UI
- ✅ JWT-based secure authentication

### 👨‍💼 Admin Features
- ✅ Add new movies to the database
- ✅ Edit existing movie details
- ✅ Delete movies
- ✅ Manage user roles and permissions
- ✅ View all users in the system
- ✅ Admin-only dashboard

### 🔒 Security Features
- ✅ JWT Authentication with refresh tokens
- ✅ Role-based access control (RBAC)
- ✅ Protected admin routes
- ✅ Input validation and sanitization
- ✅ CORS protection
- ✅ Password hashing with bcrypt

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Material-UI (MUI)** - Component library & styling
- **React Router v7** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management for authentication
- **React Query** - Server state management (optional)
- **Tailwind CSS** - Utility-first styling

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication token
- **bcrypt** - Password hashing
- **Cors** - Cross-origin resource sharing
- **Dotenv** - Environment variables
- **Joi** - Input validation

### DevOps & Deployment
- **GitHub** - Version control
- **Vercel** - Frontend hosting
- **Vercel** - Backend hosting
- **MongoDB Atlas** - Cloud database
- **Postman** - API testing

---

## 📁 Project Structure

```
movie-app/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Movies/
│   │   │   │   ├── MovieTable.jsx
│   │   │   │   ├── MovieGridView.jsx
│   │   │   │   └── MovieCard.jsx
│   │   │   ├── Auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   └── RegisterForm.jsx
│   │   │   ├── Layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   └── Common/
│   │   │       ├── LoadingSpinner.jsx
│   │   │       └── ErrorBoundary.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── SearchPage.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AddMoviePage.jsx
│   │   │   ├── EditMoviePage.jsx
│   │   │   ├── MovieDetailPage.jsx
│   │   │   └── LoginPage.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── MovieContext.jsx
│   │   ├── api/
│   │   │   ├── axiosClient.js
│   │   │   └── movieApi.js
│   │   ├── styles/
│   │   │   └── globals.css
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── .env.local
│
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── Movie.js
│   │   │   ├── User.js
│   │   │   └── AuditLog.js
│   │   ├── routes/
│   │   │   ├── movies.js
│   │   │   ├── auth.js
│   │   │   └── users.js
│   │   ├── controllers/
│   │   │   ├── movieController.js
│   │   │   ├── authController.js
│   │   │   └── userController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── roleMiddleware.js
│   │   │   ├── errorHandler.js
│   │   │   └── validation.js
│   │   ├── services/
│   │   │   ├── movieService.js
│   │   │   ├── authService.js
│   │   │   └── emailService.js
│   │   ├── queue/
│   │   │   └── movieQueue.js
│   │   ├── utils/
│   │   │   ├── logger.js
│   │   │   └── helpers.js
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── .env
│
├── .gitignore
├── README.md
└── DOCUMENTATION.md
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community) or use MongoDB Atlas
- **Git** - [Download](https://git-scm.com/)
- **Postman** (optional) - For API testing - [Download](https://www.postman.com/downloads/)

**Verify installation:**
```bash
node --version
npm --version
git --version
```

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/sharmasagarr/mern-movie-app.git
cd mern-movie-app
```

### Backend Setup

#### Step 1: Navigate to Backend Directory

```bash
cd backend
```

#### Step 2: Install Dependencies

```bash
npm install
```

#### Step 3: Create Environment Variables File

Create a `.env` file in the `backend` directory:

```bash
touch .env
```

#### Step 4: Add Configuration

```env
# MongoDB Configuration
PORT=5000
MONGODB_URI=your_mongo_db_uri
JWT_SECRET=your_super_secret_key
QUEUE_INTERVAL_MS=2000
CLIENT_ORIGIN=http://localhost:4000
```

#### Step 5: Start MongoDB

**If using local MongoDB:**
```bash
mongod
```

**Or use MongoDB Atlas** (recommended):
- Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster and get connection string
- Add connection string to `.env`

#### Step 6: Run Backend Server

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start
```

**Expected Output:**
```
Server running on http://localhost:5000
Connected to MongoDB
```

---

### Frontend Setup

#### Step 1: Navigate to Frontend Directory

```bash
cd ../frontend
```

#### Step 2: Install Dependencies

```bash
npm install
```

#### Step 3: Create Environment Variables File

Create a `.env.local` file in the `frontend` directory:

```bash
touch .env.local
```

#### Step 4: Add Configuration

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
```

#### Step 5: Start Frontend Development Server

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**Expected Output:**
```
VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:4000/
➜  press h to show help
```

---

## 🔧 Configuration

### JWT Configuration

The application uses JWT for secure authentication. Tokens are stored in:
- **Access Token**: Browser memory (returned in response)
- **Refresh Token**: HttpOnly cookies (secure, not accessible via JavaScript)

**Token Structure:**
```javascript
{
  payload: {
    userId: "user_id",
    email: "user@example.com",
    role: "user" | "admin"
  },
  expiresIn: "7d"
}
```

### CORS Configuration

Add your deployment URLs to the CORS whitelist in `backend/app.js`:

```javascript
const corsOptions = {
  origin: [
    'http://localhost:4000',
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
```

### Database Indexing

For optimal performance, ensure these indexes are created:

```javascript
// Movie model
db.movies.createIndex({ "title": "text", "description": "text" })
db.movies.createIndex({ "releaseDate": 1 })
db.movies.createIndex({ "rating": -1 })

// User model
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "createdAt": -1 })
```

---

## ▶️ Running the Application

### Development Environment

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Access the application:**
- Frontend: http://localhost:4000
- Backend API: http://localhost:5000/api
- MongoDB: mongodb://localhost:27017

### Production Environment

**Build frontend:**
```bash
cd frontend
npm run build
```

---

## 📚 API Documentation

### Base URL
- **Development:** `http://localhost:5000/api`
- **Production:** `https://your-backend-url.com/api`

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "confirmPassword": "securePassword123"
}

Response: 201 Created
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "xxx",
    "email": "john@example.com",
    "token": "jwt_token"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "userId": "xxx",
    "email": "john@example.com",
    "role": "user",
    "token": "jwt_token"
  }
}
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Movie Endpoints

#### Get All Movies (Paginated)
```http
GET /movies?page=1&limit=10
Authorization: Bearer {token} (optional)

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "_id": "xxx",
      "title": "The Shawshank Redemption",
      "description": "...",
      "releaseDate": "1994-09-23",
      "rating": 9.3,
      "duration": 142,
      "posterUrl": "...",
      "genre": ["Drama"],
      "director": "Frank Darabont"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 250,
    "pages": 25
  }
}
```

#### Search Movies
```http
GET /movies/search?q=shawshank&year=1994&ratingMin=9&ratingMax=10&durationMin=120&durationMax=300
Authorization: Bearer {token} (optional)

Response: 200 OK
{
  "success": true,
  "data": [...]
}
```

#### Get Sorted Movies
```http
GET /movies/sorted?sortBy=rating&order=desc&page=1&limit=10
Authorization: Bearer {token} (optional)

Options for sortBy: name, rating, releaseDate, duration
Options for order: asc, desc

Response: 200 OK
{
  "success": true,
  "data": [...],
  "pagination": {...}
}
```

#### Get Movie By ID
```http
GET /movies/:id
Authorization: Bearer {token} (optional)

Response: 200 OK
{
  "success": true,
  "data": { movie object }
}
```

#### Add Movie (Admin Only)
```http
POST /movies
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "New Movie",
  "description": "Movie description",
  "releaseDate": "2024-01-01",
  "rating": 8.5,
  "duration": 120,
  "posterUrl": "https://...",
  "genre": ["Action", "Drama"],
  "director": "Director Name"
}

Response: 201 Created
{
  "success": true,
  "message": "Movie added successfully",
  "data": { movie object }
}
```

#### Update Movie (Admin Only)
```http
PUT /movies/:id
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "Updated Title",
  "rating": 8.8
}

Response: 200 OK
{
  "success": true,
  "message": "Movie updated successfully",
  "data": { updated movie object }
}
```

#### Delete Movie (Admin Only)
```http
DELETE /movies/:id
Authorization: Bearer {admin_token}

Response: 200 OK
{
  "success": true,
  "message": "Movie deleted successfully"
}
```

---

## 🔐 Environment Variables

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | JWT signing secret | `your_secret_key_min_32_chars` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` or `production` |
| `CLIENT_ORIGIN` | Frontend URL for CORS | `http://localhost:4000` |

### Frontend (.env.local)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | API base URL | `http://localhost:5000/api` |
| `VITE_APP_NAME` | App name | `Movie App` |

---

## 💾 Database Schema

### Movie Model
```javascript
{
  _id: ObjectId,
  title: String (required, indexed),
  description: String,
  releaseDate: Date,
  rating: Number (0-10),
  duration: Number (in minutes),
  posterUrl: String,
  isActive: Boolean (default: true),
  createdBy: ObjectId (ref: User),
  createdAt: Date (default: now),
  updatedAt: Date (default: now)
}
```

### User Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique, indexed),
  password: String (hashed, required),
  role: String (enum: ['user', 'admin'], default: 'user'),
  avatar: String,
  isActive: Boolean (default: true),
  lastLogin: Date,
  createdAt: Date (default: now),
  updatedAt: Date (default: now)
}
```

---

## 🔐 Authentication & Authorization

### User Roles

**User Role:**
- View all movies
- Search and filter movies
- View movie details
- View own profile

**Admin Role:**
- All user permissions
- Add movies
- Edit movies
- Delete movies
- View all users
- Manage user roles

### Protected Routes (Frontend)

```javascript
// Protected Route Component
<ProtectedRoute>
  <AdminDashboard />
</ProtectedRoute>

// Admin Only Route
<AdminRoute requiredRole="admin">
  <AddMoviePage />
</AdminRoute>
```

### Protected Endpoints (Backend)

```javascript
// Middleware usage
router.post('/movies', 
  authMiddleware, 
  roleMiddleware(['admin']), 
  addMovie
);
```

---

## 🎯 Features Guide

### User Features

#### 1. Home Page
- View all movies in a responsive grid/table layout
- Pagination controls
- Movie cards showing title, rating, year, and duration
- Click to view detailed movie information

#### 2. Search & Filter
- Search by movie title or description
- Filter by release year (range)
- Filter by IMDb rating (range)
- Filter by duration (range)
- Real-time search results
- Only triggers when clicking Search button

#### 3. Movie Details
- Full movie information
- Rating display with star icon
- Release year and duration
- Director and cast information
- Related movies section

#### 4. Authentication
- Sign up with email and password
- Login with credentials
- Password reset via email
- Profile management

### Admin Features

#### 1. Admin Dashboard
- Overview of total movies, users, and statistics
- Quick actions for managing movies
- User management panel
- Activity logs

#### 2. Add Movie
- Form with validation
- Upload movie poster
- Add multiple genres
- Set rating and duration
- Add director and cast information

#### 3. Edit Movie
- Pre-filled form with current data
- Update any movie field
- Change movie poster
- Validation on form submission

#### 4. Delete Movie
- Confirmation dialog before deletion
- Soft delete option (mark as inactive)
- Hard delete capability

---

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. **Push code to GitHub:**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Vercel:**
   - Go to [Vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Import your repository
   - Add environment variables
   - Deploy

3. **Configure Environment:**
```
VITE_API_BASE_URL=https://your-railway-backend.railway.app/api
```

### Backend Deployment (Railway)

1. **Push code to GitHub** (same as above)

2. **Connect to Railway:**
   - Go to [Railway.app](https://railway.app)
   - Create new project
   - Connect GitHub repository
   - Add environment variables from `.env`
   - Deploy

3. **Setup MongoDB Atlas:**
   - Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create cluster
   - Get connection string
   - Add to Railway environment variables

4. **Custom Domain:**
   - Add custom domain in Railway dashboard
   - Update CORS in backend for new domain

---

## ⚡ Performance Optimization

### Frontend Optimization
- Code splitting with React.lazy()
- Image optimization with next-gen formats
- Memoization for expensive components
- Virtual scrolling for large lists
- Debounced search input

### Backend Optimization
- Database indexing on frequently queried fields
- Pagination to limit data transfer
- Query optimization with lean()
- Caching with Redis (optional)
- Connection pooling

### Database Optimization
```javascript
// Indexes
db.movies.createIndex({ "title": "text", "description": "text" })
db.movies.createIndex({ "rating": -1 })
db.movies.createIndex({ "releaseDate": -1 })
db.users.createIndex({ "email": 1 }, { unique: true })
```

---

## 🐛 Troubleshooting

### Common Issues

**1. "MONGODB_URI is not defined"**
```
Solution: Check .env file exists and has MONGODB_URI variable
```

**2. "CORS error when calling API"**
```
Solution: Add frontend URL to CORS whitelist in backend/app.js
or check FRONTEND_URL in .env
```

**3. "JWT authentication failed"**
```
Solution: 
- Check JWT_SECRET in .env is set
- Verify token is being sent in Authorization header
- Check token hasn't expired
```

**4. "Cannot connect to MongoDB"**
```
Solution:
- Ensure MongoDB is running (if local)
- Check MongoDB Atlas cluster is accessible
- Verify connection string in MONGODB_URI
- Check IP whitelist in MongoDB Atlas
```

**5. "Port 5000 already in use"**
```bash
# Kill process on port 5000
lsof -i :5000  # Find process ID
kill -9 <PID>  # Kill process

# Or use different port
PORT=5001 npm run dev
```

**6. "Module not found errors"**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 Git Workflow

### Initial Setup
```bash
git init
git add .
git commit -m "Initial project setup"
git branch -M main
git remote add origin https://github.com/yourusername/movie-app.git
git push -u origin main
```

### Daily Workflow
```bash
# Before starting work
git pull origin main

# After making changes
git add .
git commit -m "Descriptive commit message"
git push origin main
```

### Feature Branch (Recommended)
```bash
git checkout -b feature/feature-name
# Make changes
git add .
git commit -m "Feature description"
git push origin feature/feature-name

# Create Pull Request on GitHub
# Merge after review
git checkout main
git pull origin main
git branch -d feature/feature-name
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Check existing documentation
- Review API documentation
- Test with Postman

---

## 🙏 Acknowledgments

- IMDb for movie data reference
- Material-UI for component library
- MongoDB for database
- React community for amazing tools

---

## 📅 Version History

### v1.0.0 (Current)
- Initial release
- User authentication
- Movie CRUD operations
- Search and filtering
- Admin dashboard
- Responsive UI

---

**Happy Coding! 🚀**

For more information and updates, visit our [GitHub Repository](https://github.com/yourusername/movie-app).
