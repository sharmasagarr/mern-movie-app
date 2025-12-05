import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography
} from "@mui/material";
import axiosClient from "../api/axiosClient.js";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post("/movies", {
        ...form,
        rating: form.rating ? Number(form.rating) : undefined,
        duration: form.duration ? Number(form.duration) : undefined
      });
      alert("Movie queued for insertion.");
      navigate("/");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to add movie");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" mb={2}>
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
          />
          <TextField
            label="Rating"
            name="rating"
            fullWidth
            margin="normal"
            value={form.rating}
            onChange={handleChange}
          />
          <TextField
            label="Release Date"
            name="releaseDate"
            type="date"
            fullWidth
            margin="normal"
            value={form.releaseDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Duration (min)"
            name="duration"
            fullWidth
            margin="normal"
            value={form.duration}
            onChange={handleChange}
          />
          <TextField
            label="IMDb ID"
            name="imdbId"
            fullWidth
            margin="normal"
            value={form.imdbId}
            onChange={handleChange}
          />
          <TextField
            label="Poster URL"
            name="posterUrl"
            fullWidth
            margin="normal"
            value={form.posterUrl}
            onChange={handleChange}
          />

          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button type="submit" variant="contained">
              Add Movie
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddMoviePage;
