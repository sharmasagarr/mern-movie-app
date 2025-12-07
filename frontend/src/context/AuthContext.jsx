import { createContext, useContext, useState, useEffect, useMemo } from "react";
import axiosClient from "../api/axiosClient.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(false);

  // Set axios default header on mount if token exists
  useEffect(() => {
    if (token) {
      axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [token]);

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const res = await axiosClient.post("/auth/login", { email, password });
      console.log(res)
      
      // ✅ Access nested data structure: res.data.data
      const { user: userData, token: authToken } = res.data;
      
      // Update state
      setUser(userData);
      setToken(authToken);
      
      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", authToken);
      
      // Set axios default header
      axiosClient.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
      
      return res.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const res = await axiosClient.post("/auth/register", payload);
      
      // ✅ Access nested data structure: res.data.data
      const { user: userData, token: authToken } = res.data.data;
      
      // Update state
      setUser(userData);
      setToken(authToken);
      
      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", authToken);
      
      // Set axios default header
      axiosClient.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
      
      return res.data;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear state
    setUser(null);
    setToken("");
    
    // Clear localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    
    // Remove axios default header
    delete axiosClient.defaults.headers.common["Authorization"];
  };

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
