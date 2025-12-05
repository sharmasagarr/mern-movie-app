import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme.js";
import Navbar from "./components/Layout/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import AddMoviePage from "./pages/AddMoviePage.jsx";
import EditMoviePage from "./pages/EditMoviePage.jsx";
import ProtectedRoute from "./components/Layout/ProtectedRoute.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route
              path="/admin/add"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AddMoviePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/edit/:id"
              element={
                <ProtectedRoute requiredRole="admin">
                  <EditMoviePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
