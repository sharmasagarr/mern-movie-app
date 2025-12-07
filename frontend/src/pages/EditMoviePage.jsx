import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Skeleton
} from "@mui/material";
import axiosClient from "../api/axiosClient.js";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const EditMoviePage = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [urlError, setUrlError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovie = async () => {
      setIsLoading(true);
      
      try {
        const res = await axiosClient.get(`/movies/${id}`);
        const movie = res.data;
        
        setForm({
          title: movie.title,
          description: movie.description || "",
          rating: movie.rating ?? "",
          releaseDate: movie.releaseDate
            ? movie.releaseDate.slice(0, 10)
            : "",
          duration: movie.duration ?? "",
          imdbId: movie.imdbId || "",
          posterUrl: movie.posterUrl || ""
        });
        
        setIsLoading(false);
      } catch (err) {
        console.error("Fetch movie error:", err);
        setIsLoading(false);

        // Handle different error scenarios
        if (err.response) {
          const { status, data } = err.response;

          if (status === 404) {
            toast.error("Movie not found");
          } else if (status === 401) {
            toast.error("Unauthorized - Please login again");
            setTimeout(() => navigate("/login"), 1500);
            return;
          } else if (status === 403) {
            toast.error("You don't have permission to edit this movie");
          } else {
            toast.error(data.message || "Failed to load movie");
          }
        } else if (err.request) {
          toast.error("No response from server - Check your connection");
        } else {
          toast.error("Failed to load movie");
        }

        // Redirect after showing error
        setTimeout(() => navigate("/"), 2000);
      }
    };

    fetchMovie();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validate rating input
    if (name === "rating") {
      const numValue = parseFloat(value);
      
      // Allow empty string for clearing the field
      if (value === "") {
        setForm((prev) => ({ ...prev, [name]: value }));
        return;
      }
      
      // Check if it's a valid number and within range
      if (!Number.isNaN(numValue) && numValue >= 0 && numValue <= 10) {
        setForm((prev) => ({ ...prev, [name]: value }));
      }
      // If invalid, don't update (prevents typing)
      return;
    }
    
    // Validate duration input
    if (name === "duration") {
      const numValue = Number.parseInt(value);
      
      if (value === "") {
        setForm((prev) => ({ ...prev, [name]: value }));
        return;
      }
      
      if (!Number.isNaN(numValue) && numValue > 0 && numValue <= 1000) {
        setForm((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }
    
    // Validate poster URL
    if (name === "posterUrl") {
      setForm((prev) => ({ ...prev, [name]: value }));
      
      // Only validate if field is not empty
      if (value.trim() !== "") {
        const urlPattern = /^https?:\/\/.+\..+/i;
        if (!urlPattern.test(value.trim())) {
          setUrlError("Please enter a valid URL (must start with http:// or https://)");
        } else {
          setUrlError("");
        }
      } else {
        setUrlError("");
      }
      return;
    }
    
    // For all other fields, update normally
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation before submit
    if (urlError) {
      toast.error("Please fix the Poster URL before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      await axiosClient.put(`/movies/${id}`, {
        ...form,
        rating: form.rating ? Number(form.rating) : undefined,
        duration: form.duration ? Number(form.duration) : undefined
      });

      toast.success("Movie updated successfully!", { id: "movie-update" });
      
      // Wait a bit then navigate
      setTimeout(() => navigate("/"), 800);
      
    } catch (err) {
      setIsSubmitting(false);
      console.error("Update movie error:", err);

      // Handle different error scenarios
      if (err.response) {
        const { status, data } = err.response;

        if (status === 400) {
          // Validation errors
          if (data.errors && Array.isArray(data.errors)) {
            // Multiple validation errors
            data.errors.forEach((error, index) => {
              setTimeout(() => {
                toast.error(error, { id: `error-${index}` });
              }, index * 100);
            });
          } else {
            toast.error(data.message || "Validation failed", { id: "movie-update" });
          }
        } else if (status === 401) {
          toast.error("Unauthorized - Please login again", { id: "movie-update" });
          setTimeout(() => navigate("/login"), 1500);
        } else if (status === 403) {
          toast.error("You don't have permission to edit this movie", { id: "movie-update" });
        } else if (status === 404) {
          toast.error("Movie not found", { id: "movie-update" });
          setTimeout(() => navigate("/"), 1500);
        } else if (status === 500) {
          toast.error("Server error - Please try again later", { id: "movie-update" });
        } else {
          toast.error(data.message || `Error: ${status}`, { id: "movie-update" });
        }
      } else if (err.request) {
        toast.error("No response from server - Check your connection", { id: "movie-update" });
      } else {
        toast.error(err.message || "Failed to update movie", { id: "movie-update" });
      }
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Skeleton variant="text" width="40%" height={40} sx={{ mb: 3 }} />
          {[...new Array(7)].map((_, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Skeleton variant="text" width="30%" height={20} sx={{ mb: 1 }} />
              <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 1 }} />
            </Box>
          ))}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
            <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 1 }} />
            <Skeleton variant="rectangular" width={140} height={36} sx={{ borderRadius: 1 }} />
          </Box>
        </Paper>
      </Container>
    );
  }

  // If form is null after loading, show error state
  if (!form) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4, borderRadius: 2, textAlign: "center" }}>
          <Typography variant="h6" color="error" gutterBottom>
            Unable to load movie
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            The movie you're trying to edit could not be found
          </Typography>
          <Button variant="contained" onClick={() => navigate("/")}>
            Go to Home
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" mb={3} fontWeight="bold">
          Edit Movie
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Title"
            name="title"
            fullWidth
            margin="normal"
            value={form.title}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            helperText="Enter the movie title"
          />

          <TextField
            label="Description"
            name="description"
            fullWidth
            margin="normal"
            multiline
            minRows={3}
            value={form.description}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            helperText="Brief description of the movie"
          />

          <TextField
            label="Rating"
            name="rating"
            type="number"
            fullWidth
            margin="normal"
            value={form.rating}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            inputProps={{ 
              min: 0, 
              max: 10, 
              step: 0.1 
            }}
            helperText="IMDb rating (0-10)"
          />

          <TextField
            label="Release Date"
            name="releaseDate"
            type="date"
            fullWidth
            margin="normal"
            value={form.releaseDate}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            InputLabelProps={{ shrink: true }}
            helperText="Movie release date"
          />

          <TextField
            label="Duration (minutes)"
            name="duration"
            type="number"
            fullWidth
            margin="normal"
            value={form.duration}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            inputProps={{ min: 1 }}
            helperText="Runtime in minutes"
          />

          <TextField
            label="IMDb ID"
            name="imdbId"
            fullWidth
            margin="normal"
            value={form.imdbId}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            placeholder="tt1234567"
            helperText="Format: tt1234567"
          />

          <TextField
            label="Poster URL"
            name="posterUrl"
            fullWidth
            margin="normal"
            value={form.posterUrl}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            error={!!urlError}
            helperText={urlError || "Direct link to movie poster image (must start with http:// or https://)"}
            placeholder="https://example.com/poster.jpg"
          />

          <Box
            mt={3}
            display="flex"
            justifyContent="flex-end"
            gap={2}
          >
            <Button
              variant="outlined"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button 
              type="submit" 
              variant="contained"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditMoviePage;