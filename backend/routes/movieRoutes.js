import { Router } from "express";
import { auth, authorize } from "../middleware/auth.js";
import {
  getMovies,
  getSortedMovies,
  searchMovies,
  getMovieById,
  addMovie,
  updateMovie,
  deleteMovie
} from "../controllers/movieController.js";

const router = Router();

// 🔹 Public routes
router.get("/sorted", getSortedMovies);
router.get("/search", searchMovies);    
router.get("/:id", getMovieById);       
router.get("/", getMovies);

// 🔹 Admin-only routes
router.post("/", auth, authorize("admin"), addMovie);
router.put("/:id", auth, authorize("admin"), updateMovie);
router.delete("/:id", auth, authorize("admin"), deleteMovie);

export default router;
