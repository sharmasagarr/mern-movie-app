import { useState } from "react";
import {
  Box,
  Container,
  TextField,
  Typography,
  Button,
  CircularProgress
} from "@mui/material";
import axiosClient from "../api/axiosClient.js";
import MovieList from "../components/Movies/MovieList.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await axiosClient.get("/movies/search", {
        params: { q: query }
      });
      setMovies(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (movie) => navigate(`/admin/edit/${movie._id}`);

  const handleDelete = async (movie) => {
    if (!window.confirm(`Delete movie "${movie.title}"?`)) return;
    await axiosClient.delete(`/movies/${movie._id}`);
    const res = await axiosClient.get("/movies/search", { params: { q: query } });
    setMovies(res.data.data);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" mb={2}>
        Search Movies
      </Typography>
      <Box
        component="form"
        onSubmit={handleSearch}
        display="flex"
        gap={2}
        alignItems="center"
        mb={3}
        flexWrap="wrap"
      >
        <TextField
          label="Search by name or description"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ flexGrow: 1, minWidth: 260 }}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          startIcon={loading && <CircularProgress size={16} />}
        >
          Search
        </Button>
      </Box>

      <MovieList
        movies={movies}
        page={1}
        totalPages={1}
        onPageChange={() => {}}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isAdmin={user?.role === "admin"}
      />
    </Container>
  );
};

export default SearchPage;
