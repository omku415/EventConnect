// src/redux/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Load data from localStorage
const loadFromLocalStorage = () => {
  try {
    const savedState = localStorage.getItem("attendee");
    return savedState ? JSON.parse(savedState) : null;
  } catch (e) {
    console.error("Error loading from localStorage", e);
    return null;
  }
};

const initialState = {
  isLoggedIn: false,
  attendee: loadFromLocalStorage(),
  admin: loadFromLocalStorage("admin"),
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { userType, userData, token } = action.payload;
      state.isLoggedIn = true;

      if (userType === "attendee") {
        state.attendee = userData;
        localStorage.setItem("attendee", JSON.stringify(userData));
        
      } else if (userType === "admin") {
        state.admin = userData;
        localStorage.setItem("admin", JSON.stringify(userData));
      }
      state.token = token; 
      localStorage.setItem("token", token); 
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.attendee = null;
      state.admin = null;
      state.token = null;
      localStorage.removeItem("attendee");
      localStorage.removeItem("admin");
      localStorage.removeItem("token");
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
