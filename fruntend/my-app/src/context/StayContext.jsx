import React, { createContext, useState, useEffect } from "react";

export const StayContext = createContext(null);

export const StayContextProvider = ({ children }) => {
  const [stays, setStays] = useState([]);
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem("token");
      const userInfo = localStorage.getItem("user");
      if (!token || !userInfo) return null;
      return { token, ...JSON.parse(userInfo) };
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ---------- AUTH ----------
  const login = ({ token, user }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser({ token, ...user });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  // ---------- FETCH STAYS ----------
  const fetchStays = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/stay/all");
      const data = await res.json();

      if (data.success) {
        setStays(data.stays);
      } else {
        setError(data.message || "Failed to fetch stays");
      }
    } catch (err) {
      console.error("Fetch stays error:", err);
      setError("Network error while fetching stays");
    } finally {
      setLoading(false);
    }
  };

  // Fetch stays on mount
  useEffect(() => {
    fetchStays();
  }, []);

  // Add stay for owners
  const addStayToState = (stay) => {
    setStays((prev) => [...prev, stay]);
  };

  return (
    <StayContext.Provider
      value={{
        stays,
        addStayToState,
        user,
        login,
        logout,
        loading,
        error,
        fetchStays,
      }}
    >
      {children}
    </StayContext.Provider>
  );
};
