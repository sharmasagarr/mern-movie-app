import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import axiosClient from "../api/axiosClient.js";
import MovieList from "../components/Movies/MovieList.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [sortBy, setSortBy] = useState("title");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchMovies = async () => {
    const res = await axiosClient.get("/movies/sorted", {
      params: { sortBy, order, page, limit: 8 }
    });
    setMovies(res.data.data);
    setTotalPages(res.data.pagination.totalPages);
  };

  useEffect(() => {
    fetchMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, order, page]);

  const handleEdit = (movie) => navigate(`/admin/edit/${movie._id}`);

  const handleDelete = async (movie) => {
    if (!window.confirm(`Delete movie "${movie.title}"?`)) return;
    await axiosClient.delete(`/movies/${movie._id}`);
    fetchMovies();
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        flexWrap="wrap"
        gap={2}
      >
        <Typography variant="h4">Top Movies</Typography>

        <Box display="flex" gap={2}>
          <FormControl size="small">
            <InputLabel id="sort-by-label">Sort By</InputLabel>
            <Select
              labelId="sort-by-label"
              label="Sort By"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
            >
              <MenuItem value="title">Name</MenuItem>
              <MenuItem value="rating">Rating</MenuItem>
              <MenuItem value="releaseDate">Release Date</MenuItem>
              <MenuItem value="duration">Duration</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small">
            <InputLabel id="order-label">Order</InputLabel>
            <Select
              labelId="order-label"
              label="Order"
              value={order}
              onChange={(e) => {
                setOrder(e.target.value);
                setPage(1);
              }}
            >
              <MenuItem value="asc">Asc</MenuItem>
              <MenuItem value="desc">Desc</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <MovieList
        movies={movies}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isAdmin={user?.role === "admin"}
      />
    </Container>
  );
};

export default HomePage;
