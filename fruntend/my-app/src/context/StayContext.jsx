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

  // ---------- PUBLIC FETCH (NO TOKEN NEEDED) ----------
  const fetchStays = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/stay/all");
      const data = await res.json();

      if (data.success) {
        setStays(data.stays);
      }
    } catch (err) {
      console.error("Fetch stays error:", err);
    }
  };

  // Fetch stays for EVERYONE (logged in OR not)
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
      }}
    >
      {children}
    </StayContext.Provider>
  );
};
