import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
        >
          Movie App
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button color="inherit" component={RouterLink} to="/">
            Home
          </Button>
          <Button color="inherit" component={RouterLink} to="/search">
            Search
          </Button>
          {user?.role === "admin" && (
            <Button color="inherit" component={RouterLink} to="/admin/add">
              Add Movie
            </Button>
          )}
          {!user && (
            <Button color="inherit" component={RouterLink} to="/login">
              Login
            </Button>
          )}
          {user && (
            <Button color="inherit" onClick={handleLogout}>
              Logout ({user.name})
            </Button>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
