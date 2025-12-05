import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography
} from "@mui/material";
import axiosClient from "../api/axiosClient.js";
import { useNavigate, useParams } from "react-router-dom";

const EditMoviePage = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovie = async () => {
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
      } catch (err) {
        alert("Failed to load movie");
        navigate("/");
      }
    };
    fetchMovie();
  }, [id, navigate]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.put(`/movies/${id}`, {
        ...form,
        rating: form.rating ? Number(form.rating) : undefined,
        duration: form.duration ? Number(form.duration) : undefined
      });
      alert("Movie updated");
      navigate("/");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update movie");
    }
  };

  if (!form) return null;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" mb={2}>
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
              Save Changes
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditMoviePage;
