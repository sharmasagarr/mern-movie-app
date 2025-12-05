import Grid from "@mui/material/Grid";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import MovieCard from "./MovieCard.jsx";

const MovieList = ({
  movies,
  page,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
  isAdmin
}) => {
  return (
    <Stack spacing={3}>
      <Grid container spacing={2}>
        {movies.map((movie) => (
          <Grid item key={movie._id} xs={12} sm={6} md={4} lg={3}>
            <MovieCard
              movie={movie}
              onEdit={onEdit}
              onDelete={onDelete}
              isAdmin={isAdmin}
            />
          </Grid>
        ))}
      </Grid>
      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => onPageChange(value)}
          color="primary"
        />
      )}
    </Stack>
  );
};

export default MovieList;
