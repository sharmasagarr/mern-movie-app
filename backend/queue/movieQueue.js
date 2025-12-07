import Movie from "../models/Movie.js";
import jobs from "../utils/jobs.js";

const queue = [];

// Push movie payload to queue instead of direct insert
export const enqueueMovie = (moviePayload) => {
  queue.push(moviePayload);
};

// Worker to flush queue to DB at intervals (simulating lazy insertion)
export const startMovieWorker = () => {
  const interval = Number(process.env.QUEUE_INTERVAL_MS || 2000);

  setInterval(async () => {
    if (queue.length === 0) return;

    const batch = queue.splice(0, queue.length);

    try {
      const result = await Movie.insertMany(batch, { ordered: false });

      // Update job results
      result.forEach(movie => {
        if (movie.jobId) {
          jobs.set(movie.jobId, { status: "completed", movieId: movie._id });
        }
      });

      console.log(`Inserted ${batch.length} movies`);
    } catch (err) {
      console.error("Queue insert error:", err.message);
    }
  }, interval);
};
