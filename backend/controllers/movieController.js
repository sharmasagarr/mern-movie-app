import Movie from "../models/Movie.js";
import { enqueueMovie } from "../queue/movieQueue.js";

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
    const { sortBy = "title", order = "asc" } = req.query;
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

    const sortField = sortMap[sortBy] || "title";
    const sortOrder = order === "desc" ? -1 : 1;

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
    const { title, description, rating, releaseDate, duration, imdbId, posterUrl } =
      req.body;

    const payload = {
      title,
      description,
      rating,
      releaseDate: releaseDate ? new Date(releaseDate) : undefined,
      duration,
      imdbId,
      posterUrl
    };

    enqueueMovie(payload);

    res.status(202).json({
      message: "Movie accepted for insertion (lazy via queue)"
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
