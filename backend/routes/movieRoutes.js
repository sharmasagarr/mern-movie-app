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
import jobs from "../utils/jobs.js";

const router = Router();

// 🔹 Public routes
router.get("/sorted", getSortedMovies);
router.get("/search", searchMovies);    
router.get("/:id", getMovieById);       
router.get("/", getMovies);

// 🔹 Admin-only routes
router.post("/", auth, authorize("admin"), addMovie);
router.get("/job/:jobId", (req, res) => {
  const job = jobs.get(req.params.jobId);

  if (!job) {
    return res.status(404).json({ message: "Invalid job id" });
  }

  res.json(job);
});
router.put("/:id", auth, authorize("admin"), updateMovie);
router.delete("/:id", auth, authorize("admin"), deleteMovie);

export default router;
