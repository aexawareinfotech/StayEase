import React, { createContext, useState, useEffect } from "react";
import { authService } from "../services/api";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem("token") || sessionStorage.getItem("token") || null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = () => {
      const storedToken =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (storedToken) {
        try {
          const decoded = jwtDecode(storedToken);
          if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
            setUser(null);
            setRole(null);
            setToken(null);
          } else {
            setToken(storedToken);
            const storedUser =
              localStorage.getItem("user") || sessionStorage.getItem("user");
            if (storedUser) {
              setUser(JSON.parse(storedUser));
            } else {
              setUser(decoded);
            }
            setRole(decoded.role || JSON.parse(storedUser || "{}").role);
          }
        } catch (e) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("user");
          setUser(null);
          setRole(null);
          setToken(null);
        }
      } else {
        setUser(null);
        setRole(null);
        setToken(null);
      }
      setLoading(false);
    };
    checkAuthStatus();
  }, []);

  const login = async (credentials, rememberMe = true) => {
    const response = await authService.login(credentials);
    if (response.data.success) {
      const { token, data } = response.data;
      setToken(token);
      setUser(data);
      setRole(data.role);
      if (rememberMe) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(data));
      } else {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(data));
      }
    }
    return response.data;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    return response.data;
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    const storage = localStorage.getItem("token")
      ? localStorage
      : sessionStorage;
    storage.setItem("user", JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        login,
        logout,
        register,
        updateUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
