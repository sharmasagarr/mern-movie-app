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
    if (Number.isNaN(ratingNum) || ratingNum < 0 || ratingNum > 10) {
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
    const { id } = req.params;
    const updates = req.body;

    // Validate MongoDB ObjectId
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: ["Invalid movie ID format"]
      });
    }

    // Check if movie exists
    const existingMovie = await Movie.findById(id);
    if (!existingMovie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found"
      });
    }

    // Check if update body is empty
    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: ["No update fields provided"]
      });
    }

    // Define allowed fields for update
    const allowedFields = [
      'title',
      'description',
      'rating',
      'releaseDate',
      'duration',
      'imdbId',
      'posterUrl'
    ];

    // Check for invalid fields
    const invalidFields = Object.keys(updates).filter(
      field => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: [`Invalid fields: ${invalidFields.join(', ')}`]
      });
    }

    const errors = [];
    const validatedUpdates = {};

    // Validate each field if provided
    
    // Validate title
    if (updates.hasOwnProperty('title')) {
      if (typeof updates.title !== 'string') {
        errors.push("Title must be a string");
      } else if (updates.title.trim() === '') {
        errors.push("Title cannot be empty");
      } else if (updates.title.trim().length < 1 || updates.title.trim().length > 200) {
        errors.push("Title must be between 1 and 200 characters");
      } else {
        validatedUpdates.title = updates.title.trim();
      }
    }

    // Validate description
    if (updates.hasOwnProperty('description')) {
      if (typeof updates.description !== 'string') {
        errors.push("Description must be a string");
      } else if (updates.description.trim() === '') {
        errors.push("Description cannot be empty");
      } else if (updates.description.trim().length < 10) {
        errors.push("Description must be at least 10 characters");
      } else {
        validatedUpdates.description = updates.description.trim();
      }
    }

    // Validate rating
    if (updates.hasOwnProperty('rating')) {
      const ratingNum = Number.parseFloat(updates.rating);
      if (Number.isNaN(ratingNum)) {
        errors.push("Rating must be a valid number");
      } else if (ratingNum < 0 || ratingNum > 10) {
        errors.push("Rating must be between 0 and 10");
      } else {
        validatedUpdates.rating = ratingNum;
      }
    }

    // Validate duration
    if (updates.hasOwnProperty('duration')) {
      const durationNum = Number.parseInt(updates.duration);
      if (Number.isNaN(durationNum)) {
        errors.push("Duration must be a valid number");
      } else if (durationNum <= 0) {
        errors.push("Duration must be a positive number (in minutes)");
      } else if (durationNum > 600) {
        errors.push("Duration cannot exceed 600 minutes (10 hours)");
      } else {
        validatedUpdates.duration = durationNum;
      }
    }

    // Validate releaseDate
    if (updates.hasOwnProperty('releaseDate')) {
      const parsedDate = new Date(updates.releaseDate);
      if (Number.isNaN(parsedDate.getTime())) {
        errors.push("Release Date must be a valid date");
      } else {
        const currentYear = new Date().getFullYear();
        const releaseYear = parsedDate.getFullYear();
        if (releaseYear < 1888 || releaseYear > currentYear + 5) {
          errors.push(`Release year must be between 1888 and ${currentYear + 5}`);
        } else {
          validatedUpdates.releaseDate = parsedDate;
        }
      }
    }

    // Validate imdbId
    if (updates.hasOwnProperty('imdbId')) {
      if (typeof updates.imdbId !== 'string') {
        errors.push("IMDb ID must be a string");
      } else if (updates.imdbId.trim() === '') {
        errors.push("IMDb ID cannot be empty");
      } else {
        // Optional: validate IMDb ID format (tt followed by digits)
        const imdbPattern = /^tt\d{7,8}$/i;
        if (!imdbPattern.test(updates.imdbId.trim())) {
          errors.push("IMDb ID must be in format 'tt' followed by 7-8 digits (e.g., tt0111161)");
        } else {
          validatedUpdates.imdbId = updates.imdbId.trim();
        }
      }
    }

    // Validate posterUrl
    if (updates.hasOwnProperty('posterUrl')) {
      if (typeof updates.posterUrl !== 'string') {
        errors.push("Poster URL must be a string");
      } else if (updates.posterUrl.trim() === '') {
        errors.push("Poster URL cannot be empty");
      } else {
        const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i;
        if (!urlPattern.test(updates.posterUrl.trim())) {
          errors.push("Poster URL must be a valid HTTP/HTTPS URL ending with image extension (jpg, jpeg, png, gif, webp)");
        } else {
          validatedUpdates.posterUrl = updates.posterUrl.trim();
        }
      }
    }

    // If there are validation errors, return them
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
      });
    }

    // Check if there are actually changes to make
    let hasChanges = false;
    for (const [key, value] of Object.entries(validatedUpdates)) {
      if (existingMovie[key] !== value) {
        hasChanges = true;
        break;
      }
    }

    if (!hasChanges) {
      return res.status(400).json({
        success: false,
        message: "No changes detected",
        errors: ["The provided values are the same as existing values"]
      });
    }

    // Perform the update
    const updatedMovie = await Movie.findByIdAndUpdate(
      id,
      { 
        ...validatedUpdates,
        updatedAt: new Date()
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedMovie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found after update"
      });
    }

    res.status(200).json({
      success: true,
      message: "Movie updated successfully",
      data: updatedMovie
    });

  } catch (err) {
    // Handle mongoose validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
      });
    }

    // Handle mongoose cast errors (invalid ObjectId)
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid movie ID format"
      });
    }

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
