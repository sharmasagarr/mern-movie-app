import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Chip,
  IconButton,
  Stack,
  Paper
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarIcon from "@mui/icons-material/Star";

const formatDuration = (min) => {
  if (!min) return "";
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h ${m}m`;
};

const MovieDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const movie = location.state;

  if (!movie) {
    return (
      <Container sx={{ py: 6 }}>
        <Typography variant="h6" textAlign="center">
          No movie data passed.  
        </Typography>
        <Typography variant="body2" textAlign="center">
          You must navigate here from the movie list.
        </Typography>
      </Container>
    );
  }

  const year = movie.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : "N/A";

  return (
    <Container maxWidth="md" sx={{ py: {xs: 1, sm: 4}, display: "flex", gap: 2, flexDirection: {xs: "column", sm: "row"} }}>
      
      {/* Back Button */}
      <Box>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 3,
        }}
      >
        {/* Poster */}
        <Box
          sx={{
            width: { xs: "100%", sm: "40%" },
            aspectRatio: "2 / 3",
            overflow: "hidden",
            borderRadius: 2,
          }}
        >
          <img
            src={movie.posterUrl}
            alt={movie.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {movie.title}
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            {/* Rating */}
            {movie.rating && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  bgcolor: "rgba(0,0,0,0.8)",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  color: "#fff",
                }}
              >
                <StarIcon sx={{ color: "gold", fontSize: 20 }} />
                <Typography variant="subtitle1">
                  {movie.rating.toFixed(1)}
                </Typography>
              </Box>
            )}

            <Typography variant="body1">{year}</Typography>
            <Typography variant="body1">
              {formatDuration(movie.duration)}
            </Typography>
          </Stack>

          {/* Genres */}
          {movie.genres?.length > 0 && (
            <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
              {movie.genres.map((g) => (
                <Chip key={g} label={g} variant="outlined" />
              ))}
            </Stack>
          )}

          {/* Description */}
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ lineHeight: 1.6, mt: 2 }}
          >
            {movie.description}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default MovieDetailPage;
