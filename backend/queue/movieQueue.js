import Movie from "../models/Movie.js";

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
      await Movie.insertMany(batch, { ordered: false });
      console.log(`Inserted ${batch.length} movies from queue`);
    } catch (err) {
      console.error("Queue insert error:", err.message);
    }
  }, interval);
};
