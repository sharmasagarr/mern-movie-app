import Movie from "../models/Movie.js";
import { enqueueMovie } from "../queue/movieQueue.js";
import jobs from "../utils/jobs.js";
import crypto from "node:crypto";

// GET /api/movies
export const getMovies = async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const skip = (page - 1) * limit;

    const [movies, total] = await Promise.all([
      Movie.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Movie.countDocuments()
    ]);

    res.json({
      data: movies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/movies/:id
export const getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);
  } catch (err) {
    next(err);
  }
};

// GET /api/movies/sorted
export const getSortedMovies = async (req, res, next) => {
  try {
    const { sortBy = "rating", order = "desc" } = req.query;
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const skip = (page - 1) * limit;

    const sortMap = {
      name: "title",
      title: "title",
      rating: "rating",
      releaseDate: "releaseDate",
      duration: "duration"
    };

    const sortField = sortMap[sortBy] || "rating";
    const sortOrder = order === "asc" ? 1 : -1;

    const [movies, total] = await Promise.all([
      Movie.find()
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit),
      Movie.countDocuments()
    ]);

    res.json({
      data: movies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/movies/search?q=...
export const searchMovies = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ data: [] });

    const movies = await Movie.find({
      $text: { $search: q }
    }).limit(50);

    res.json({ data: movies });
  } catch (err) {
    next(err);
  }
};

// POST /api/movies  (admin) – lazy via queue
export const addMovie = async (req, res, next) => {
  try {
    const {
      title,
      description,
      rating,
      releaseDate,
      duration,
      imdbId,
      posterUrl
    } = req.body;

    // Validation: Check for required fields
    const requiredFields = {
      title: "Title",
      description: "Description",
      rating: "Rating",
      releaseDate: "Release Date",
      duration: "Duration",
      imdbId: "IMDb ID",
      posterUrl: "Poster URL"
    };

    const missingFields = [];
    const emptyFields = [];

    for (const [field, label] of Object.entries(requiredFields)) {
      if (req.body[field] === undefined || req.body[field] === null) {
        missingFields.push(label);
      } else if (
        typeof req.body[field] === 'string' && 
        req.body[field].trim() === ''
      ) {
        emptyFields.push(label);
      }
    }

    // Check if there are any validation errors
    if (missingFields.length > 0 || emptyFields.length > 0) {
      const errors = [];
      
      if (missingFields.length > 0) {
        errors.push(`Missing fields: ${missingFields.join(', ')}`);
      }
      
      if (emptyFields.length > 0) {
        errors.push(`Empty fields: ${emptyFields.join(', ')}`);
      }

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
      });
    }

    // Additional validation for specific fields
    
    // Validate rating (should be between 0 and 10)
    const ratingNum = Number.parseFloat(rating);
    if (Number.isNaNr.isNaNr.isNaN(ratingNum) || ratingNum < 0 || ratingNum > 10) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: ["Rating must be a number between 0 and 10"]
      });
    }

    // Validate duration (should be positive number)
    const durationNum = Number.parseInt(duration);
    if (Number.isNaN(durationNum) || durationNum <= 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: ["Duration must be a positive number (in minutes)"]
      });
    }

    // Validate releaseDate (should be valid date)
    const parsedDate = new Date(releaseDate);
    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: ["Release Date must be a valid date"]
      });
    }

    // Validate posterUrl (basic URL format check)
    const urlPattern = /^https?:\/\/.+/i;
    if (!urlPattern.test(posterUrl)) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: ["Poster URL must be a valid HTTP/HTTPS URL"]
      });
    }

    // All validations passed - proceed with job creation
    const jobId = crypto.randomUUID();

    const payload = {
      jobId,
      title: title.trim(),
      description: description.trim(),
      rating: ratingNum,
      releaseDate: parsedDate,
      duration: durationNum,
      imdbId: imdbId.trim(),
      posterUrl: posterUrl.trim()
    };

    // Save job status
    jobs.set(jobId, { status: "pending", movieId: null });

    enqueueMovie(payload);

    res.status(202).json({
      success: true,
      message: "Movie accepted for insertion via queue",
      jobId
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/movies/:id (admin)
export const updateMovie = async (req, res, next) => {
  try {
    const updates = req.body;
    const movie = await Movie.findByIdAndUpdate(req.params.id, updates, {
      new: true
    });

    if (!movie) return res.status(404).json({ message: "Movie not found" });

    res.json(movie);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/movies/:id (admin)
export const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json({ message: "Movie deleted" });
  } catch (err) {
    next(err);
  }
};
