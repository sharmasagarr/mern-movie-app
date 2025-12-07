import {
  Box,
  Typography,
  IconButton,
  Paper,
  Stack
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
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

const MovieDetailView = ({
  movies,
  page,
  limit,
  onEdit,
  onDelete,
  isAdmin,
  user,
}) => {
  const navigate = useNavigate();
  const pageSize = limit || 20;

  const handleMovieClick = (movie) => {
    navigate(`/movie/${movie._id}`, {
      state: movie
    });
  };

  return (
    <Stack spacing={2}>
      {movies.map((movie, index) => {
        const rank = (page - 1) * pageSize + (index + 1);
        const year = movie.releaseDate
          ? new Date(movie.releaseDate).getFullYear()
          : null;
        const durationText = formatDuration(movie.duration);

        return (
          <Paper
            key={movie._id}
            elevation={1}
            sx={{
              p: 2,
              borderRadius: 3,
              backgroundColor: "background.paper",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: 3,
              },
              cursor: "pointer",
            }}
            onClick={() => handleMovieClick(movie)}
          >
            <Box
              display="flex"
              gap={2}
              alignItems={{ xs: "flex-start", sm: "center" }}
              flexDirection="row"
            >
              {/* Poster + rank badge */}
              <Box
                sx={{
                  position: "relative",
                  flexShrink: 0,
                  width: { xs: 70, sm: 80 },
                  height: { xs: 105, sm: 120 },
                  borderRadius: 2,
                  overflow: "hidden",
                  bgcolor: "grey.900",
                }}
              >
                {movie.posterUrl ? (
                  <Box
                    component="img"
                    src={movie.posterUrl}
                    alt={movie.title}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      bgcolor: "grey.200",
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

                {/* Rank badge */}
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
                  }}
                >
                  #{rank}
                </Box>
              </Box>

              {/* Main content */}
              <Box
                sx={{
                  flexGrow: 1,
                  minWidth: 0,
                }}
              >
                {/* Title */}
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "100%",
                  }}
                >
                  {movie.title}
                </Typography>

                {/* Year • duration */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  {year && <>{year}</>} • {durationText}
                </Typography>

                {/* Rating + (mobile) actions row */}
                <Box
                  display="flex"
                  alignItems="center"
                  gap={2}
                  flexWrap="wrap"
                  sx={{ mt: 0.5 }}
                >
                  {/* Rating (★ 9.3) */}
                  <Box display="inline-flex" alignItems="center" gap={0.5}>
                    <StarIcon
                      fontSize="small"
                      sx={{ color: "warning.main" }}
                    />
                    <Typography variant="body2">
                      {movie.rating != null ? movie.rating.toFixed(1) : "N/A"}
                    </Typography>
                  </Box>

                  {/* MOBILE: actions in same row as rating */}
                  <Box
                    sx={{
                      display: { xs: "flex", sm: "none" },
                      marginLeft: "auto",
                      gap: 0.5,
                    }}
                  >
                    {isAdmin && (
                      <>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit?.(movie);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.(movie);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </>
                    )}
                    <IconButton 
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMovieClick(movie);
                      }}
                    >
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>

              {/* DESKTOP: right side actions */}
              <Box
                ml={{ xs: 0, sm: "auto" }}
                mt={{ xs: 1, sm: 0 }}
                display={{ xs: "none", sm: "flex" }}
                alignItems="center"
                gap={1}
                onClick={(e) => e.stopPropagation()}
              >
                {isAdmin && (
                  <>
                    <IconButton 
                      size="small" 
                      onClick={() => onEdit?.(movie)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onDelete?.(movie)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </>
                )}
                <IconButton 
                  size="small"
                  onClick={() => handleMovieClick(movie)}
                >
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
            <Box
                sx={{
                    borderTop: "1px solid",
                    borderColor: "divider", // uses theme divider color
                    mt: 1,
                    pt: 1,
                }}
                >
                <Typography variant="subtitle1">
                    {movie.description}
                </Typography>
            </Box>
          </Paper>
        );
      })}
    </Stack>
  );
};

export default MovieDetailView;