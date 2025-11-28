import React, { createContext, useState, useEffect } from "react";

export const StayContext = createContext(null);

export const StayContextProvider = ({ children }) => {
  const [stays, setStays] = useState([]);

  // Safe user initialization from localStorage
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem("token");
      const userInfo = localStorage.getItem("user");

      if (!token || !userInfo) return null;

      const parsedUser = JSON.parse(userInfo);
      return { token, ...parsedUser };
    } catch (err) {
      console.warn("Failed to parse user from localStorage:", err);
      return null;
    }
  });

  // ---------------- AUTH ----------------
  const login = ({ token, user }) => {
    try {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser({ token, ...user });
    } catch (err) {
      console.error("Login storage error:", err);
    }
  };

  const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setUser(null);
  setStays([]); // optional: clear stays
  window.location.href = "/login"; // redirect to login page
};


  // -------------- PROTECTED FETCH --------------
  const authFetch = async (url, options = {}) => {
    try {
      const headers = {
        ...(options.headers || {}),
        ...(user?.token && { Authorization: `Bearer ${user.token}` }),
      };

      const res = await fetch(url, { ...options, headers });

      if (!res.ok) {
        console.error("HTTP ERROR", res.status);
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Auth fetch error:", err.message);
      return null; // return null instead of throwing
    }
  };

  // ---------------- STAY FUNCTIONS ----------------
  const addStayToState = (stay) => setStays((prev) => [...prev, stay]);

  const fetchStays = async () => {
    const data = await authFetch("http://localhost:5000/api/stay/all");

    if (data?.success) {
      setStays(data.stays || []);
    } else {
      console.warn("Failed to fetch stays or no data returned");
    }
  };

  useEffect(() => {
    if (user) fetchStays();
  }, [user]);

  return (
    <StayContext.Provider
      value={{
        stays,
        addStayToState,
        user,
        login,
        logout,
        authFetch,
      }}
    >
      {children}
    </StayContext.Provider>
  );
};
