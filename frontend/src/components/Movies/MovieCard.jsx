import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";

const MovieCard = ({ movie, onEdit, onDelete, isAdmin }) => {
  return (
    <Card sx={{ maxWidth: 300, margin: 1 }}>
      {movie.posterUrl && (
        <CardMedia
          component="img"
          height="400"
          image={movie.posterUrl}
          alt={movie.title}
        />
      )}
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {movie.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {movie.description}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Rating: {movie.rating ?? "N/A"}
        </Typography>
        {movie.releaseDate && (
          <Typography variant="body2">
            Release: {new Date(movie.releaseDate).toLocaleDateString()}
          </Typography>
        )}
        {movie.duration && (
          <Typography variant="body2">Duration: {movie.duration} min</Typography>
        )}
      </CardContent>
      {isAdmin && (
        <CardActions>
          <Button size="small" onClick={() => onEdit?.(movie)}>
            Edit
          </Button>
          <Button size="small" color="error" onClick={() => onDelete?.(movie)}>
            Delete
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default MovieCard;
