import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewCompactIcon from "@mui/icons-material/ViewCompact";
import ViewHeadlineIcon from "@mui/icons-material/ViewHeadline";
import axiosClient from "../api/axiosClient.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import MovieTable from "../components/Movies/MovieDetailView.jsx";
import MovieGridView from "../components/Movies/MovieGridView.jsx";
import MovieCompactView from "../components/Movies/MovieCompactView.jsx";
import FilterListIcon from "@mui/icons-material/FilterList";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Slider from "@mui/material/Slider";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Skeleton from "@mui/material/Skeleton";
import Paper from "@mui/material/Paper";
import { Stack } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import toast from "react-hot-toast";

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [sortBy, setSortBy] = useState("rating");
  const [order, setOrder] = useState("desc");
  const [viewMode, setViewMode] = useState("detailed");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [yearRange, setYearRange] = useState([1900, new Date().getFullYear()]);
  const [ratingRange, setRatingRange] = useState([0, 10]);

  const [loading, setLoading] = useState(true);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Track if data has been fetched to prevent unnecessary refetches
  const hasFetchedRef = useRef(false);
  const previousSortRef = useRef({ sortBy, order, page });

  const LIMIT = 20;

  const { user } = useAuth();
  const navigate = useNavigate();

  // --- FETCH MOVIES (optimized) ---
  const fetchMovies = useCallback(async (force = false) => {
    // Check if we need to fetch
    const sortChanged = 
      previousSortRef.current.sortBy !== sortBy ||
      previousSortRef.current.order !== order ||
      previousSortRef.current.page !== page;

    if (!force && hasFetchedRef.current && !sortChanged) {
      return; // Skip fetch if data already loaded and params unchanged
    }

    setLoading(true);
    try {
      const res = await axiosClient.get("/movies/sorted", {
        params: { sortBy, order, page, limit: LIMIT }
      });

      setMovies(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
      hasFetchedRef.current = true;
      
      // Update previous sort reference
      previousSortRef.current = { sortBy, order, page };

      // Fetch all movies only once for filters
      if (allMovies.length === 0) {
        const allRes = await axiosClient.get("/movies/sorted", {
          params: { sortBy: "rating", order: "desc", limit: 1000 }
        });
        setAllMovies(allRes.data.data);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      toast.error("Failed to fetch movies");
    } finally {
      setLoading(false);
    }
  }, [sortBy, order, page, allMovies.length]);

  // Initial fetch only
  useEffect(() => {
    fetchMovies();
  }, [sortBy, order, page]);

  // --- FILTERED MOVIES ---
  const filteredMovies = useMemo(() => {
    let filtered = [...movies];

    filtered = filtered.filter((movie) => {
      if (!movie.releaseDate) return true;
      const year = new Date(movie.releaseDate).getFullYear();
      return year >= yearRange[0] && year <= yearRange[1];
    });

    filtered = filtered.filter((movie) => {
      if (movie.rating == null) return true;
      return movie.rating >= ratingRange[0] && movie.rating <= ratingRange[1];
    });

    return filtered;
  }, [movies, yearRange, ratingRange]);

  const handleEdit = (movie) => navigate(`/admin/edit/${movie._id}`);

  // --- OPEN DELETE DIALOG ---
  const openDeleteDialog = (movie) => {
    setSelectedMovie(movie);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedMovie(null);
  };

  // --- OPTIMIZED DELETE (local state update) ---
  const handleDeleteConfirm = async () => {
    const movieToDelete = selectedMovie;
    
    try {
      // Optimistically update UI immediately
      setMovies(prev => prev.filter(m => m._id !== movieToDelete._id));
      setAllMovies(prev => prev.filter(m => m._id !== movieToDelete._id));
      
      closeDeleteDialog();
      toast.success(`Deleted "${movieToDelete.title}"`);
      
      // Delete on server (fire and forget, already updated UI)
      await axiosClient.delete(`/movies/${movieToDelete._id}`);
      
    } catch (err) {
      // If server delete fails, revert the optimistic update
      toast.error("Delete failed, reverting changes");
      fetchMovies(true); // Force refetch to restore correct state
    }
  };

  const handleViewModeChange = (event, newViewMode) => {
    if (newViewMode !== null) setViewMode(newViewMode);
  };

  const handleClearFilters = () => {
    setYearRange([1900, new Date().getFullYear()]);
    setRatingRange([0, 10]);
  };

  const renderSkeletons = () => {
    if (viewMode === "detailed") {
      return (
        <Stack spacing={2}>
          {Array.from(new Array(LIMIT)).map((_, index) => (
            <Paper key={index} elevation={1} sx={{ p: 2, borderRadius: 3 }}>
              <Box display="flex" gap={2} alignItems="center">
                <Skeleton variant="rectangular" width={80} height={120} sx={{ borderRadius: 2 }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Skeleton variant="text" width="60%" height={30} />
                  <Skeleton variant="text" width="40%" height={20} />
                  <Box display="flex" alignItems="center" gap={2} sx={{ mt: 1 }}>
                    <Skeleton variant="circular" width={20} height={20} />
                    <Skeleton variant="text" width={40} height={20} />
                  </Box>
                </Box>
              </Box>
            </Paper>
          ))}
        </Stack>
      );
    }

    if (viewMode === "compact") {
      return (
        <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Stack divider={<Divider />}>
            {Array.from(new Array(LIMIT)).map((_, index) => (
              <Box key={index} sx={{ p: 2 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Skeleton variant="text" width={40} height={30} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Skeleton variant="text" width="70%" height={25} />
                    <Skeleton variant="text" width="40%" height={20} />
                  </Box>
                  <Skeleton variant="circular" width={20} height={20} />
                  <Skeleton variant="text" width={40} height={20} />
                </Box>
              </Box>
            ))}
          </Stack>
        </Paper>
      );
    }

    return null;
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4, px: { xs: 1, sm: 12 } }}>
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          IMDb Top 50 Movies
        </Typography>

        <Typography variant="subtitle2" color="text.secondary">
          Rated by IMDb users
        </Typography>
      </Box>

      {/* Controls */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", md: "center" },
          gap: 2,
          mb: 4,
          p: 2,
          borderRadius: 2,
          bgcolor: "background.paper",
          boxShadow: 3,
        }}
      >
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <IconButton onClick={() => setFiltersOpen(true)}>
            <FilterListIcon />
          </IconButton>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="sort-by-label">Sort by</InputLabel>
            <Select
              labelId="sort-by-label"
              value={sortBy}
              label="Sort by"
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
            >
              <MenuItem value="rating">IMDb Rating</MenuItem>
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="releaseDate">Release Date</MenuItem>
              <MenuItem value="duration">Runtime</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel id="order-label">Order</InputLabel>
            <Select
              labelId="order-label"
              value={order}
              label="Order"
              onChange={(e) => {
                setOrder(e.target.value);
                setPage(1);
              }}
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          size="small"
        >
          <ToggleButton value="detailed">
            <ViewHeadlineIcon />
          </ToggleButton>
          <ToggleButton value="compact">
            <ViewCompactIcon />
          </ToggleButton>
          <ToggleButton value="grid">
            <GridViewIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Content */}
      <Box>
        {loading ? (
          <>
            {renderSkeletons()}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          </>
        ) : (
          <>
            {filteredMovies.length === 0 && movies.length > 0 ? (
              <Box
                sx={{
                  textAlign: "center",
                  py: 8,
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  boxShadow: 1,
                }}
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No movies found
                </Typography>

                <Button variant="outlined" onClick={handleClearFilters}>
                  Clear All Filters
                </Button>
              </Box>
            ) : (
              <>
                {viewMode === "detailed" && (
                  <MovieTable
                    movies={filteredMovies}
                    page={page}
                    totalPages={totalPages}
                    limit={LIMIT}
                    onPageChange={setPage}
                    onEdit={handleEdit}
                    onDelete={openDeleteDialog}
                    isAdmin={user?.role === "admin"}
                    user={user}
                  />
                )}

                {viewMode === "compact" && (
                  <MovieCompactView
                    movies={filteredMovies}
                    page={page}
                    totalPages={totalPages}
                    limit={LIMIT}
                    onPageChange={setPage}
                    onEdit={handleEdit}
                    onDelete={openDeleteDialog}
                    isAdmin={user?.role === "admin"}
                    user={user}
                  />
                )}

                {viewMode === "grid" && (
                  <MovieGridView
                    movies={filteredMovies}
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    onEdit={handleEdit}
                    onDelete={openDeleteDialog}
                    isAdmin={user?.role === "admin"}
                    user={user}
                  />
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "background.paper",
                        boxShadow: 1,
                        minWidth: 300,
                        justifyContent: "center",
                      }}
                    >
                      <Button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        variant="outlined"
                      >
                        <ArrowBackIcon />
                      </Button>

                      <Typography sx={{ minWidth: 100, textAlign: "center" }}>
                        Page {page} of {totalPages}
                      </Typography>

                      <Button
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={page === totalPages}
                        variant="outlined"
                      >
                        <ArrowForwardIcon />
                      </Button>
                    </Box>
                  </Box>
                )}
              </>
            )}
          </>
        )}
      </Box>

      {/* Filters Drawer */}
      <Drawer
        anchor="left"
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        PaperProps={{
          sx: { width: { xs: "100%", sm: 320 }, p: 3 }
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h6">Filters</Typography>
          <IconButton onClick={() => setFiltersOpen(false)}>✕</IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
          Release Year
        </Typography>
        <Slider
          value={yearRange}
          onChange={(_, newValue) => setYearRange(newValue)}
          valueLabelDisplay="auto"
          min={1900}
          max={new Date().getFullYear()}
          step={1}
          sx={{ mb: 3 }}
        />

        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
          IMDb Rating
        </Typography>
        <Slider
          value={ratingRange}
          onChange={(_, newValue) => setRatingRange(newValue)}
          valueLabelDisplay="auto"
          min={0}
          max={10}
          step={0.5}
          sx={{ mb: 3 }}
        />

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="outlined" onClick={handleClearFilters} fullWidth>
            Clear All
          </Button>
          <Button variant="contained" onClick={() => setFiltersOpen(false)} fullWidth>
            Apply
          </Button>
        </Box>
      </Drawer>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={closeDeleteDialog} 
        maxWidth="xs" 
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 2,
            m: { xs: 2, sm: 4 }
          }
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            Confirm Delete
          </Typography>
        </DialogTitle>
        
        <Divider />
        
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Typography variant="body1">
            Are you sure you want to delete{" "}
            <Typography component="span" fontWeight="bold" color="error">
              {selectedMovie?.title}
            </Typography>
            ?
          </Typography>
        </DialogContent>
        
        <Divider />
        
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={closeDeleteDialog}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HomePage;