import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  CircularProgress
} from "@mui/material";
import axiosClient from "../api/axiosClient.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AddMoviePage = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    rating: "",
    releaseDate: "",
    duration: "",
    imdbId: "",
    posterUrl: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [urlError, setUrlError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validate rating input
    if (name === "rating") {
      const numValue = Number.parseFloat(value);
      
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
      // 1️⃣ Create Movie (Queued)
      const res = await axiosClient.post("/movies", {
        ...form,
        rating: form.rating ? Number(form.rating) : undefined,
        duration: form.duration ? Number(form.duration) : undefined
      });

      const jobId = res.data.jobId;

      if (!jobId) {
        toast.error("No jobId returned from server");
        setIsSubmitting(false);
        return;
      }

      toast.loading("Processing movie…", { id: "processing" });

      // 2️⃣ POLLING every 500 milliseconds to check job status
      const pollInterval = setInterval(async () => {
        try {
          const jobRes = await axiosClient.get(`/movies/job/${jobId}`);
          console.log(jobRes);

          if (jobRes.data.status === "completed") {
            clearInterval(pollInterval);
            setIsSubmitting(false);

            toast.success("Movie inserted successfully!", { id: "processing" });

            // Wait 800ms then redirect
            setTimeout(() => navigate("/"), 800);
          } else if (jobRes.data.status === "failed") {
            clearInterval(pollInterval);
            setIsSubmitting(false);

            toast.error(
              jobRes.data.error || "Movie insertion failed", 
              { id: "processing" }
            );
          }
        } catch (error_) {
          clearInterval(pollInterval);
          setIsSubmitting(false);

          console.error("Polling error:", error_);
          
          toast.error(
            "Failed to check movie insertion status", 
            { id: "processing" }
          );
        }
      }, 500);

      // Safety timeout: stop polling after 30 seconds
      setTimeout(() => {
        clearInterval(pollInterval);
        if (isSubmitting) {
          setIsSubmitting(false);
          toast.error(
            "Processing timeout - please check later", 
            { id: "processing" }
          );
        }
      }, 30000);

    } catch (err) {
      setIsSubmitting(false);
      console.error("Add movie error:", err);

      // Handle different error scenarios
      if (err.response) {
        // Server responded with error status
        const { status, data } = err.response;

        if (status === 400) {
          // Validation errors
          if (data.errors && Array.isArray(data.errors)) {
            // Multiple validation errors
            data.errors.forEach((error, index) => {
              setTimeout(() => {
                toast.error(error, { id: `error-${index}` });
              }, index * 100); // Stagger toasts
            });
          } else {
            toast.error(data.message || "Validation failed");
          }
        } else if (status === 401) {
          toast.error("Unauthorized - Please login again");
          setTimeout(() => navigate("/login"), 1500);
        } else if (status === 403) {
          toast.error("Forbidden - You don't have permission");
        } else if (status === 404) {
          toast.error("API endpoint not found");
        } else if (status === 500) {
          toast.error("Server error - Please try again later");
        } else {
          toast.error(data.message || `Error: ${status}`);
        }
      } else if (err.request) {
        // Request made but no response received
        toast.error("No response from server - Check your connection");
      } else {
        // Something else happened
        toast.error(err.message || "Failed to add movie");
      }
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" mb={3} fontWeight="bold">
          Add New Movie
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

          <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
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
              {isSubmitting ? "Adding..." : "Add Movie"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddMoviePage;