import { createContext, useContext, useState } from "react";
import axiosClient from "../api/axiosClient.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(false);

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const res = await axiosClient.post("/auth/login", { email, password });
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const res = await axiosClient.post("/auth/register", payload);
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const value = { user, token, loading, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
