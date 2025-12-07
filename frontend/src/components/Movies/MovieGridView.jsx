import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Stack,
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

const MovieGridView = ({
  movies,
  page,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
  isAdmin,
  user,
}) => {
  const navigate = useNavigate();

  const handleMovieClick = (movie) => {
    navigate(`/movie/${movie._id}`, {
      state: movie
    });
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)',      // 2 columns on mobile
          sm: 'repeat(3, 1fr)',      // 3 columns on small screens
          md: 'repeat(4, 1fr)',      // 4 columns on medium screens
          lg: 'repeat(5, 1fr)',      // 5 columns on large screens
        },
        gap: 2,
      }}
    >
      {movies.map((movie, index) => {
        const rank = index + 1 + ((page - 1) * (movies.length || 20));
        const year = movie.releaseDate
          ? new Date(movie.releaseDate).getFullYear()
          : "N/A";
        const durationText = formatDuration(movie.duration);

        return (
          <Card
            key={movie._id}
            sx={{
              display: "flex",
              flexDirection: "column",
              height: '100%',
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 6,
              },
            }}
          >
            {/* Poster Section - Fixed aspect ratio */}
            <Box 
              sx={{ 
                position: "relative", 
                width: "100%",
                paddingTop: "150%", // Fixed 2:3 aspect ratio
                overflow: "hidden",
                cursor: "pointer",
                flexShrink: 0,
              }}
              onClick={() => handleMovieClick(movie)}
            >
              {movie.posterUrl ? (
                <Box
                  component="img"
                  src={movie.posterUrl}
                  alt={movie.title}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    bgcolor: "grey.300",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    No Image
                  </Typography>
                </Box>
              )}
              
              {/* Ranking badge */}
              <Box
                sx={{
                  position: "absolute",
                  top: 8,
                  left: 8,
                  px: 1.2,
                  py: 0.3,
                  borderRadius: 999,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  fontSize: 12,
                  fontWeight: "bold",
                  zIndex: 2,
                }}
              >
                #{rank}
              </Box>
              
              {/* Rating badge */}
              {movie.rating && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    bgcolor: "rgba(0, 0, 0, 0.75)",
                    color: "white",
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    zIndex: 2,
                  }}
                >
                  <StarIcon sx={{ fontSize: 14, color: "gold" }} />
                  <Typography variant="caption" fontWeight="bold">
                    {movie.rating.toFixed(1)}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Content Section */}
            <Box
              onClick={() => handleMovieClick(movie)}
              sx={{ 
                cursor: "pointer",
                p: 1.5,
                minHeight: 70,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                flexGrow: 1,
              }}
            >
              {/* Title - 2 lines max */}
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                sx={{
                  mb: 0.5,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  lineHeight: 1.2,
                }}
              >
                {movie.title}
              </Typography>

              {/* Year and Duration */}
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{
                  display: "block",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {year} • {durationText}
              </Typography>
            </Box>

            {/* Action buttons */}
            <Box
              sx={{
                p: 0.5,
                minHeight: 40,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px solid",
                borderColor: "divider",
                mt: "auto",
                flexShrink: 0,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Admin buttons */}
              {isAdmin ? (
                <Stack direction="row" spacing={0.5}>
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
                </Stack>
              ) : (
                <Box />
              )}
              
              {/* Info button */}
              <IconButton
                size="small"
                onClick={() => handleMovieClick(movie)}
                title="More info"
              >
                <InfoOutlinedIcon fontSize="small" />
              </IconButton>
            </Box>
          </Card>
        );
      })}
    </Box>
  );
};

export default MovieGridView;