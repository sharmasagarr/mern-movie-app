import { useState, useMemo } from "react";
import {
  Box,
  Container,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Slider,
  Divider,
  Chip,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import axiosClient from "../api/axiosClient.js";
import MovieTable from "../components/Movies/MovieDetailView.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Delete modal states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  
  // Filter states
  const [yearRange, setYearRange] = useState([1900, new Date().getFullYear()]);
  const [ratingRange, setRatingRange] = useState([0, 10]);
  const [durationRange, setDurationRange] = useState([0, 300]);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await axiosClient.get("/movies/search", {
        params: { q: query }
      });
      setMovies(res.data.data);
    } catch (error) {
      console.error("Error searching movies:", error);
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setQuery("");
    setMovies([]);
    setHasSearched(false);
    handleClearFilters();
  };

  const handleEdit = (movie) => navigate(`/admin/edit/${movie._id}`);

  // Open delete confirmation modal
  const openDeleteDialog = (movie) => {
    setSelectedMovie(movie);
    setDeleteDialogOpen(true);
  };

  // Close delete confirmation modal
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedMovie(null);
  };

  // Confirm delete with optimistic update
  const handleDeleteConfirm = async () => {
    const movieToDelete = selectedMovie;
    
    try {
      // Optimistically update UI immediately
      setMovies(prev => prev.filter(m => m._id !== movieToDelete._id));
      
      closeDeleteDialog();
      toast.success(`Deleted "${movieToDelete.title}"`);
      
      // Delete on server
      await axiosClient.delete(`/movies/${movieToDelete._id}`);
      
    } catch (err) {
      // If server delete fails, revert by refetching
      toast.error("Delete failed, reverting changes");
      console.error("Error deleting movie:", err);
      
      // Refetch search results to restore correct state
      if (query.trim()) {
        const res = await axiosClient.get("/movies/search", { 
          params: { q: query } 
        });
        setMovies(res.data.data);
      }
    }
  };

  const handleClearFilters = () => {
    setYearRange([1900, new Date().getFullYear()]);
    setRatingRange([0, 10]);
    setDurationRange([0, 300]);
  };

  // Apply filters to search results
  const filteredMovies = useMemo(() => {
    let filtered = [...movies];

    // Filter by year range
    filtered = filtered.filter(movie => {
      if (!movie.releaseDate) return true;
      const year = new Date(movie.releaseDate).getFullYear();
      return year >= yearRange[0] && year <= yearRange[1];
    });

    // Filter by rating range
    filtered = filtered.filter(movie => {
      if (movie.rating == null) return true;
      return movie.rating >= ratingRange[0] && movie.rating <= ratingRange[1];
    });

    // Filter by duration range
    filtered = filtered.filter(movie => {
      if (movie.duration == null) return true;
      return movie.duration >= durationRange[0] && movie.duration <= durationRange[1];
    });

    return filtered;
  }, [movies, yearRange, ratingRange, durationRange]);

  // Check if any filters are active
  const hasActiveFilters = 
    yearRange[0] !== 1900 || 
    yearRange[1] !== new Date().getFullYear() ||
    ratingRange[0] !== 0 || 
    ratingRange[1] !== 10 ||
    durationRange[0] !== 0 ||
    durationRange[1] !== 300;

  const activeFiltersCount = 
    (yearRange[0] !== 1900 || yearRange[1] !== new Date().getFullYear() ? 1 : 0) +
    (ratingRange[0] !== 0 || ratingRange[1] !== 10 ? 1 : 0) +
    (durationRange[0] !== 0 || durationRange[1] !== 300 ? 1 : 0);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4, px: { xs: 2, sm: 3, md: 12 } }}>
      <Typography 
        variant="h4" 
        mb={3} 
        fontWeight="bold"
        sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}
      >
        Search Movies
      </Typography>

      {/* Search Box */}
      <Box
        component="form"
        onSubmit={handleSearch}
        sx={{
          display: "flex",
          gap: { xs: 1.5, sm: 2 },
          alignItems: "center",
          mb: 3,
          flexWrap: { xs: "wrap", sm: "nowrap" },
          p: { xs: 1.5, sm: 2 },
          borderRadius: 3,
          bgcolor: "background.paper",
          boxShadow: 3,
        }}
      >
        <TextField
          label="Search by title or description"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{
            flexGrow: 1,
            minWidth: { xs: "100%", sm: 260 },
            "& .MuiOutlinedInput-root": {
              borderRadius: 20,  
            }
          }}
          size="small"
          fullWidth
        />

        <Box sx={{ 
          display: 'flex', 
          gap: { xs: 1, sm: 2 }, 
          width: { xs: '100%', sm: 'auto' },
          flexWrap: { xs: 'wrap', sm: 'nowrap' }
        }}>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !query.trim()}
            startIcon={loading ? <CircularProgress size={16} /> : <SearchIcon />}
            sx={{ flex: { xs: 1, sm: 'initial' }, minWidth: { xs: 'auto', sm: 100 }, borderRadius: 20 }}
          >
            Search
          </Button>
          {hasSearched && (
            <Button
              variant="outlined"
              onClick={handleClearSearch}
              startIcon={<ClearIcon />}
              color="error"
              sx={{ flex: { xs: 1, sm: 'initial' }, minWidth: { xs: 'auto', sm: 120 }, borderRadius: 20 }}
            >
              Clear
            </Button>
          )}
        </Box>
      </Box>

      {/* Filter Controls */}
      {movies.length > 0 && hasSearched && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            p: { xs: 1.5, sm: 2 },
            borderRadius: 2,
            bgcolor: "background.paper",
            boxShadow: 2,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 }, flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setFiltersOpen(true)}
              size="small"
            >
              Filters
              {hasActiveFilters && (
                <Chip
                  label={activeFiltersCount}
                  size="small"
                  color="primary"
                  sx={{ ml: 1, height: 20, minWidth: 20 }}
                />
              )}
            </Button>

            {hasActiveFilters && (
              <Button
                size="small"
                startIcon={<ClearIcon />}
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            )}
          </Box>

          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
          >
            {filteredMovies.length} {filteredMovies.length === 1 ? 'result' : 'results'}
          </Typography>
        </Box>
      )}

      {/* Movie Results */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress />
        </Box>
      ) : hasSearched && movies.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: { xs: 6, sm: 8 },
            px: { xs: 2, sm: 3 },
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Typography 
            variant="h6" 
            color="text.secondary" 
            gutterBottom
            sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' } }}
          >
            No movies found
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mb: 3, fontSize: { xs: '0.875rem', sm: '1rem' } }}
          >
            Try searching with different keywords
          </Typography>
          <Button
            variant="outlined"
            onClick={handleClearSearch}
            startIcon={<ClearIcon />}
            size="small"
          >
            Clear Search
          </Button>
        </Box>
      ) : hasSearched && filteredMovies.length === 0 && movies.length > 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: { xs: 6, sm: 8 },
            px: { xs: 2, sm: 3 },
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Typography 
            variant="h6" 
            color="text.secondary" 
            gutterBottom
            sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' } }}
          >
            No movies match your filters
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mb: 3, fontSize: { xs: '0.875rem', sm: '1rem' } }}
          >
            Try adjusting your filter criteria
          </Typography>
          <Button
            variant="outlined"
            onClick={handleClearFilters}
            startIcon={<ClearIcon />}
            size="small"
          >
            Clear All Filters
          </Button>
        </Box>
      ) : !hasSearched ? (
        <Box
          sx={{
            textAlign: "center",
            py: { xs: 6, sm: 8 },
            px: { xs: 2, sm: 3 },
            bgcolor: "background.paper",
            borderRadius: 5,
            boxShadow: 1,
          }}
        >
          <SearchIcon sx={{ fontSize: { xs: 48, sm: 64 }, color: 'text.secondary', mb: 2 }} />
          <Typography 
            variant="h6" 
            color="text.secondary" 
            gutterBottom
            sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' } }}
          >
            Start Searching
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
          >
            Enter a movie title or description to search
          </Typography>
        </Box>
      ) : (
        <MovieTable
          movies={filteredMovies}
          page={1}
          limit={filteredMovies.length}
          onEdit={handleEdit}
          onDelete={openDeleteDialog}
          isAdmin={user?.role === "admin"}
          user={user}
        />
      )}

      {/* Filters Modal Dialog */}
      <Dialog
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 2,
            m: { xs: 2, sm: 4 },
            maxHeight: { xs: '90vh', sm: '80vh' }
          }
        }}
      >
        <DialogTitle sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          p: { xs: 2, sm: 3 }
        }}>
          <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' } }}>
            Filters
          </Typography>
          <IconButton onClick={() => setFiltersOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent
          sx={{
            pt: { xs: 2, sm: 3 },
            px: { xs: 2, sm: 3 },
            overflowY: "auto",
            overflowX: "hidden",

            /* Custom thin scrollbar */
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.2) transparent",

            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "rgba(255,255,255,0.35)",
            },
          }}
        >
          {/* Release Year Filter */}
          <Box sx={{ mb: 4 }}>
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
              sx={{ mt: 2 }}
            />
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {yearRange[0]}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {yearRange[1]}
              </Typography>
            </Box>
          </Box>

          {/* Rating Filter */}
          <Box sx={{ mb: 4 }}>
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
              sx={{ mt: 2 }}
            />
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {ratingRange[0]}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {ratingRange[1]}
              </Typography>
            </Box>
          </Box>

          {/* Duration Filter */}
          <Box>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Duration (minutes)
            </Typography>
            <Slider
              value={durationRange}
              onChange={(_, newValue) => setDurationRange(newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={300}
              step={5}
              sx={{ mt: 2 }}
            />
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {durationRange[0]} min
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {durationRange[1]} min
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ 
          p: { xs: 2, sm: 2 }, 
          gap: 1,
          flexDirection: { xs: 'column', sm: 'row' }
        }}>
          <Button
            variant="outlined"
            onClick={handleClearFilters}
            startIcon={<ClearIcon />}
            fullWidth={false}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            Clear All
          </Button>
          <Button
            variant="contained"
            onClick={() => setFiltersOpen(false)}
            fullWidth={false}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>

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

export default SearchPage;