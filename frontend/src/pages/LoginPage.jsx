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
  Tab
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast"

const LoginPage = () => {
  const { login, register, loading } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "register"

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleLoginChange = (e) =>
    setLoginForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleRegisterChange = (e) =>
    setRegisterForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "login") {
        await login(loginForm);
      } else {
        // role is optional; backend defaults to "user"
        await register(registerForm);
      }
      toast.success(mode === "login" ? "Login successful" : "Signup successful", {id: "login"});
      navigate("/");
    } catch (err) {
      toast.error(mode === "login" ? "Login failed" : "Signup failed", {id: "login"});
      console.error(
        err?.response?.data?.message ||
          (mode === "login" ? "Login failed" : "Signup failed")
      );
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Tabs
          value={mode}
          onChange={(_, value) => setMode(value)}
          textColor="primary"
          indicatorColor="primary"
          centered
        >
          <Tab label="Login" value="login" />
          <Tab label="Sign Up" value="register" />
        </Tabs>

        <Typography variant="h5" mt={3} mb={2}>
          {mode === "login" ? "Login to your account" : "Create a new account"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          {mode === "register" && (
            <TextField
              label="Name"
              name="name"
              fullWidth
              margin="normal"
              value={registerForm.name}
              onChange={handleRegisterChange}
              required
            />
          )}

          <TextField
            label="Email"
            name="email"
            fullWidth
            margin="normal"
            value={mode === "login" ? loginForm.email : registerForm.email}
            onChange={mode === "login" ? handleLoginChange : handleRegisterChange}
            required
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={
              mode === "login" ? loginForm.password : registerForm.password
            }
            onChange={mode === "login" ? handleLoginChange : handleRegisterChange}
            required
          />

          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading && <CircularProgress size={16} />}
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
