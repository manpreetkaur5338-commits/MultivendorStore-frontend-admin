import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("marketnest_admin_token"));
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Validate admin token on mount
  useEffect(() => {
    const verifyAdmin = async () => {
      const storedToken = localStorage.getItem("marketnest_admin_token");
      if (!storedToken) {
        setAdmin(null);
        setLoading(false);
        return;
      }

      try {
        const res = await api.getProfile();
        if (res.success && res.user && res.user.role === "admin") {
          setAdmin(res.user);
          setAuthError(null);
        } else {
          // If not an admin or invalid, remove session
          logout();
          setAuthError("Unauthorized: Administrator privileges required.");
        }
      } catch (err) {
        console.error("Auth verification error:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifyAdmin();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await api.login(email, password);
      if (res.success && res.token && res.user) {
        if (res.user.role !== "admin") {
          setAuthError("Access denied. Only registered MarketNest administrators can access this portal.");
          setLoading(false);
          return { success: false, message: "Administrator role required." };
        }

        localStorage.setItem("marketnest_admin_token", res.token);
        setToken(res.token);
        setAdmin(res.user);
        setLoading(false);
        return { success: true, user: res.user };
      } else {
        setAuthError(res.message || "Invalid email or password");
        setLoading(false);
        return { success: false, message: res.message || "Login failed" };
      }
    } catch (err) {
      const msg = err.message || "Failed to reach server";
      setAuthError(msg);
      setLoading(false);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem("marketnest_admin_token");
    setToken(null);
    setAdmin(null);
  };

  const updateAdminProfile = async (data) => {
    try {
      const res = await api.updateProfile(data);
      if (res.success && res.user) {
        setAdmin(res.user);
        return { success: true };
      }
      return { success: false, message: res.message || "Update failed" };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        loading,
        authError,
        login,
        logout,
        updateAdminProfile,
        isAuthenticated: !!admin && admin.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

