import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, index: true },
    description: { type: String, default: "" },
    rating: { type: Number, default: 0 }, // e.g. IMDb rating
    releaseDate: { type: Date },
    duration: { type: Number }, // minutes
    imdbId: { type: String }, 
    posterUrl: { type: String },
    
    // Required for queue worker to mark completion
    jobId: { type: String, required: false },
  },
  { timestamps: true }
);

// For search by name/description
movieSchema.index({ title: "text", description: "text" });
// For sorting
movieSchema.index({ rating: -1, releaseDate: -1, duration: 1 });

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;