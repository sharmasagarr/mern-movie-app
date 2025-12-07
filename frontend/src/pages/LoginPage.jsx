import { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Tabs,
  Tab,
  Alert,
  InputAdornment,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const LoginPage = () => {
  const { login, register, loading } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "register"

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false
  });

  const navigate = useNavigate();

  // Email validation regex
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Password validation checks
  const passwordChecks = {
    length: registerForm.password.length >= 8,
    hasNumber: /\d/.test(registerForm.password),
    hasLetter: /[a-zA-Z]/.test(registerForm.password),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(registerForm.password)
  };

  const isPasswordValid = Object.values(passwordChecks).every(check => check);

  // Validate email
  const validateEmail = (email) => {
    if (!email) {
      return "Email is required";
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  // Validate name
  const validateName = (name) => {
    if (!name) {
      return "Name is required";
    }
    if (name.trim().length < 2) {
      return "Name must be at least 2 characters";
    }
    if (name.trim().length > 50) {
      return "Name must not exceed 50 characters";
    }
    return "";
  };

  // Validate password
  const validatePassword = (password) => {
    if (!password) {
      return "Password is required";
    }
    if (mode === "register") {
      if (password.length < 8) {
        return "Password must be at least 8 characters long";
      }
      if (!passwordChecks.hasNumber) {
        return "Password must contain at least one number";
      }
      if (!passwordChecks.hasLetter) {
        return "Password must contain at least one letter";
      }
      if (!passwordChecks.hasSpecial) {
        return "Password must contain at least one special character";
      }
    }
    return "";
  };

  const handleLoginChange = (e) => {
    setLoginForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({ ...prev, [name]: value }));

    // Real-time validation for register form
    if (touched[name]) {
      let error = "";
      switch (name) {
        case "name":
          error = validateName(value);
          break;
        case "email":
          error = validateEmail(value);
          break;
        case "password":
          error = validatePassword(value);
          break;
        default:
          break;
      }
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    // Validate on blur
    let error = "";
    switch (field) {
      case "name":
        error = validateName(registerForm.name);
        break;
      case "email":
        error = validateEmail(mode === "login" ? loginForm.email : registerForm.email);
        break;
      case "password":
        error = validatePassword(mode === "login" ? loginForm.password : registerForm.password);
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    if (mode === "register") {
      const nameError = validateName(registerForm.name);
      const emailError = validateEmail(registerForm.email);
      const passwordError = validatePassword(registerForm.password);

      if (nameError || emailError || passwordError) {
        setErrors({
          name: nameError,
          email: emailError,
          password: passwordError
        });
        setTouched({
          name: true,
          email: true,
          password: true
        });
        toast.error("Please fix all validation errors", { id: "validation" });
        return;
      }
    } else {
      // Login mode - basic validation
      const emailError = validateEmail(loginForm.email);
      if (emailError) {
        setErrors((prev) => ({ ...prev, email: emailError }));
        toast.error("Please enter a valid email", { id: "validation" });
        return;
      }
      if (!loginForm.password) {
        toast.error("Please enter your password", { id: "validation" });
        return;
      }
    }

    try {
      if (mode === "login") {
        await login(loginForm);
      } else {
        await register(registerForm);
      }
      toast.success(mode === "login" ? "Login successful!" : "Signup successful!", {
        id: "login"
      });
      navigate("/");
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 
        (mode === "login" ? "Login failed. Please check your credentials." : "Signup failed. Please try again.");
      toast.error(errorMessage, { id: "login" });
      console.error(err?.response?.data?.message || errorMessage);
    }
  };

  const handleModeChange = (_, value) => {
    setMode(value);
    setErrors({ name: "", email: "", password: "" });
    setTouched({ name: false, email: false, password: false });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Tabs
          value={mode}
          onChange={handleModeChange}
          textColor="primary"
          indicatorColor="primary"
          centered
        >
          <Tab label="Login" value="login" />
          <Tab label="Sign Up" value="register" />
        </Tabs>

        <Typography variant="h5" mt={3} mb={2} fontWeight="bold">
          {mode === "login" ? "Login to your account" : "Create a new account"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          {/* Name Field (Register only) */}
          {mode === "register" && (
            <TextField
              label="Full Name"
              name="name"
              fullWidth
              margin="normal"
              value={registerForm.name}
              onChange={handleRegisterChange}
              onBlur={() => handleBlur("name")}
              error={touched.name && !!errors.name}
              helperText={touched.name && errors.name}
              required
              autoComplete="name"
            />
          )}

          {/* Email Field */}
          <TextField
            label="Email Address"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            value={mode === "login" ? loginForm.email : registerForm.email}
            onChange={mode === "login" ? handleLoginChange : handleRegisterChange}
            onBlur={() => handleBlur("email")}
            error={touched.email && !!errors.email}
            helperText={touched.email && errors.email}
            required
            autoComplete="email"
          />

          {/* Password Field */}
          <TextField
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={mode === "login" ? loginForm.password : registerForm.password}
            onChange={mode === "login" ? handleLoginChange : handleRegisterChange}
            onBlur={() => handleBlur("password")}
            error={touched.password && !!errors.password}
            helperText={
              mode === "login" && touched.password ? errors.password : ""
            }
            required
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    aria-label="toggle password visibility"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          {/* Password Requirements (Register only) */}
          {mode === "register" && registerForm.password && (
            <Box mt={2} mb={1}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Password Requirements:
              </Typography>
              <List dense sx={{ pt: 0 }}>
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {passwordChecks.length ? (
                      <CheckCircleIcon color="success" fontSize="small" />
                    ) : (
                      <CancelIcon color="error" fontSize="small" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary="At least 8 characters"
                    primaryTypographyProps={{
                      variant: "body2",
                      color: passwordChecks.length ? "success.main" : "error.main"
                    }}
                  />
                </ListItem>
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {passwordChecks.hasLetter ? (
                      <CheckCircleIcon color="success" fontSize="small" />
                    ) : (
                      <CancelIcon color="error" fontSize="small" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary="At least one letter (a-z, A-Z)"
                    primaryTypographyProps={{
                      variant: "body2",
                      color: passwordChecks.hasLetter ? "success.main" : "error.main"
                    }}
                  />
                </ListItem>
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {passwordChecks.hasNumber ? (
                      <CheckCircleIcon color="success" fontSize="small" />
                    ) : (
                      <CancelIcon color="error" fontSize="small" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary="At least one number (0-9)"
                    primaryTypographyProps={{
                      variant: "body2",
                      color: passwordChecks.hasNumber ? "success.main" : "error.main"
                    }}
                  />
                </ListItem>
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {passwordChecks.hasSpecial ? (
                      <CheckCircleIcon color="success" fontSize="small" />
                    ) : (
                      <CancelIcon color="error" fontSize="small" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary="At least one special character (!@#$%^&*)"
                    primaryTypographyProps={{
                      variant: "body2",
                      color: passwordChecks.hasSpecial ? "success.main" : "error.main"
                    }}
                  />
                </ListItem>
              </List>
            </Box>
          )}

          {/* Submit Button */}
          <Box mt={3} display="flex" flexDirection={{xs: "column", sm: "row"}} justifyContent="space-between" alignItems="center">
            {/* Additional Info */}
            {mode === "login" ? (
              <Typography variant="body2" color="text.secondary" mt={2} textAlign="center">
                Don't have an account?{" "}
                <Button
                  variant="text"
                  size="small"
                  onClick={() => handleModeChange(null, "register")}
                >
                  Sign Up
                </Button>
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary" mt={2} textAlign="center">
                Already have an account?{" "}
                <Button
                  variant="text"
                  size="small"
                  onClick={() => handleModeChange(null, "login")}
                >
                  Login
                </Button>
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              disabled={loading || (mode === "register" && !isPasswordValid)}
              startIcon={loading && <CircularProgress size={16} />}
              sx={{ ml: "auto" }}
            >
              {mode === "login" ? "Login" : "Sign Up"}
            </Button>
          </Box>
        </Box>

      </Paper>
    </Container>
  );
};

export default LoginPage;
