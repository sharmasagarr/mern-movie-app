import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { Divider } from "@mui/material";
import Box from "@mui/material/Box";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = () => {
      setMenuOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Helper function to check if a route is active
  const isActiveRoute = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  // Helper to get initials
  const getInitials = (name = "") => {
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return "NA";
  };

  return (
    <AppBar position="sticky" sx={{ top: 0, zIndex: 1100 }}>
      <Toolbar
        sx={{
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          gap: { xs: 1, sm: 0 },
          py: { xs: 1, sm: 0 },
          px: { xs: 1, sm: 12 }
        }}
      >
        {/* -------------------- MOBILE ROW 1 -------------------- */}
        <Box
          sx={{
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            mb: { xs: 1, sm: 0 },
            display: { xs: "flex", sm: "none" }, // show only on mobile
            paddingX: 2
          }}
        >
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              textDecoration: "none",
              color: "inherit",
              fontWeight: "bold"
            }}
          >
            Movie App
          </Typography>

          {user ? (
            // 🔥 Mobile avatar menu
            <Box
              sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
              onClick={(e) => e.stopPropagation()} // prevent closing when tapping inside
            >
              <Box
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen((prev) => !prev);
                }}
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  backgroundColor: "white",
                  color: "black",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontWeight: "bold",
                  userSelect: "none",
                }}
              >
                {getInitials(user.name)}
              </Box>

              {menuOpen && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "120%",
                    right: 0,
                    backgroundColor: "#321b2fff",
                    color: "white",
                    borderRadius: 1,
                    boxShadow: 4,
                    p: 1,
                    zIndex: 2000,
                    minWidth: 120,
                  }}
                >
                  <Button
                    fullWidth
                    onClick={handleLogout}
                    sx={{
                      color: "white",
                      justifyContent: "flex-start",
                      textTransform: "none",
                    }}
                  >
                    Logout
                  </Button>
                </Box>
              )}
            </Box>
          ) : (
            <Button color="inherit" component={RouterLink} to="/login">
              Login
            </Button>
          )}
        </Box>

        {/* -------------------- DESKTOP TITLE -------------------- */}
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: "none",
            color: "inherit",
            fontWeight: "bold",
            display: { xs: "none", sm: "block" }, 
          }}
        >
          Movie App
        </Typography>

        {/* -------------------- MOBILE ROW 2 + DESKTOP NAV -------------------- */}
        <Divider sx={{ display: { xs: "block", sm: "none" }, width: "100%" }} />
        <Stack
          direction="row"
          spacing={2}
          sx={{
            width: { xs: "100%", sm: "auto" },
            justifyContent: { xs: "space-evenly", sm: "flex-end" },
            flexWrap: "wrap",
          }}
        >
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/"
            sx={{
              position: "relative",
              "&::after": isActiveRoute("/") ? {
                content: '""',
                position: "absolute",
                bottom: 2,
                left: "50%",
                transform: "translateX(-50%)",
                width: "80%",
                height: "2px",
                backgroundColor: "white",
                borderRadius: "1px",
              } : {}
            }}
          >
            Home
          </Button>
          
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/search"
            sx={{
              position: "relative",
              "&::after": isActiveRoute("/search") ? {
                content: '""',
                position: "absolute",
                bottom: 2,
                left: "50%",
                transform: "translateX(-50%)",
                width: "80%",
                height: "2px",
                backgroundColor: "white",
                borderRadius: "1px",
              } : {}
            }}
          >
            Search
          </Button>
          
          {user?.role === "admin" && (
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/admin/add"
              sx={{
                position: "relative",
                "&::after": isActiveRoute("/admin/add") ? {
                  content: '""',
                  position: "absolute",
                  bottom: 2,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "80%",
                  height: "2px",
                  backgroundColor: "white",
                  borderRadius: "1px",
                } : {}
              }}
            >
              Add Movie
            </Button>
          )}

          {/* Desktop Avatar Menu */}
          {user && (
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                position: "relative"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Avatar Circle */}
              <Box
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen((prev) => !prev);
                }}
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  backgroundColor: "white",
                  color: "black",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontWeight: "bold",
                  userSelect: "none",
                }}
              >
                {getInitials(user.name)}
              </Box>

              {/* Dropdown Menu */}
              {menuOpen && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 42,
                    right: 0,
                    backgroundColor: "#321b2fff",
                    color: "white",
                    borderRadius: 1,
                    boxShadow: 4,
                    p: 1,
                    zIndex: 2000
                  }}
                >
                  <Button
                    fullWidth
                    onClick={handleLogout}
                    sx={{
                      color: "white",
                      justifyContent: "flex-start",
                      textTransform: "none"
                    }}
                  >
                    Logout
                  </Button>
                </Box>
              )}
            </Box>
          )}

          {!user && (
            <Button
              color="inherit"
              component={RouterLink}
              to="/login"
              sx={{ 
                display: { xs: "none", sm: "inline-flex" }, // hide on mobile
                position: "relative",
                "&::after": isActiveRoute("/login") ? {
                  content: '""',
                  position: "absolute",
                  bottom: 2,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "80%",
                  height: "2px",
                  backgroundColor: "white",
                  borderRadius: "1px",
                } : {}
              }}
            >
              Login
            </Button>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
