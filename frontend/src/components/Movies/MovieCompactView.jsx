import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Stack,
  Divider,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useNavigate } from "react-router-dom";

const formatDuration = (minutes) => {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m}m`;
  if (!m) return `${h}h`;
  return `${h}h ${m}m`;
};

const MovieCompactView = ({
  movies,
  page,
  totalPages,
  limit,
  onPageChange,
  onEdit,
  onDelete,
  isAdmin,
  user,
}) => {
  const navigate = useNavigate();
  const pageSize = limit || 50;

  const handleMovieClick = (movie) => {
    navigate(`/movie/${movie._id}`, {
      state: movie
    });
  };

  return (
    <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          gap: 2,
          p: 2,
          bgcolor: "background.default",
          borderBottom: "1px solid",
          borderColor: "divider",
          alignItems: "center",
        }}
      >
        <Typography variant="subtitle2" fontWeight="bold" sx={{ width: 60 }}>
          S. No.
        </Typography>
        <Typography variant="subtitle2" fontWeight="bold">
          Title
        </Typography>
        <Typography
          variant="subtitle2"
          fontWeight="bold"
          sx={{
            width: 80,
            textAlign: "right",
            display: { xs: "none", sm: "block" } // hidden on mobile
          }}
        >
          Actions
        </Typography>
      </Box>

      <Stack divider={<Divider />}>
        {movies.map((movie, index) => {
          const rank = (page - 1) * pageSize + (index + 1);
          const year = movie.releaseDate
            ? new Date(movie.releaseDate).getFullYear()
            : "N/A";

          const durationText = formatDuration(movie.duration);

          return (
            <Box
              key={movie._id}
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "auto 1fr",       // 2 columns on mobile
                  sm: "auto 1fr auto",  // 3 columns on tablet/desktop
                },
                gridTemplateRows: {
                  xs: "auto auto",      // two rows on mobile
                  sm: "auto",           // one row on desktop
                },
                gap: 2,
                p: 2,
                alignItems: "center",
                cursor: "pointer",
                transition: "background-color 0.2s",
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
              onClick={() => handleMovieClick(movie)}
            >

              <Box sx={{ width: 60 }}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="text.secondary"
                  sx={{ fontSize: "1.25rem" }}
                >
                  #{rank}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="subtitle1"
                  fontWeight="medium"
                  sx={{
                    mb: 0.25,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {movie.title}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {year && <>{year}</>} • {durationText}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.1,
                      px: 1,
                      borderRadius: 1,
                      backgroundColor: "#F5C518", // IMDb-style yellow
                      color: "black"              // text + icon become black
                    }}
                  >
                    <StarIcon sx={{ color: "black", fontSize: 16 }} />
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      sx={{ color: "black" }}
                    >
                      {movie.rating != null ? movie.rating.toFixed(1) : "N/A"}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  width: { xs: "100%", sm: 80 },
                  gridColumn: { xs: "1 / -1", sm: "auto" },
                  display: "flex",
                  alignItems: "center",
                  justifyContent:"flex-end",
                  gap: 1,
                  mt: { xs: 1, sm: 0 },
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {isAdmin && (
                  <>
                    <IconButton
                      size="small"
                      onClick={() => onEdit?.(movie)}
                      title="Edit"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => onDelete?.(movie)}
                      title="Delete"
                      sx={{ color: "error.main" }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </>
                )}
                <IconButton
                  size="small"
                  onClick={() => handleMovieClick(movie)}
                  title="More info"
                >
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          );
        })}
      </Stack>
    </Paper>
  );
};

export default MovieCompactView;