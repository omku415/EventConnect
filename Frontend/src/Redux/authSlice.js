// src/redux/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Load specific key from localStorage
const loadFromLocalStorage = (key) => {
  try {
    const savedState = localStorage.getItem(key);
    return savedState && savedState !== "undefined"
      ? JSON.parse(savedState)
      : null;
  } catch (e) {
    console.error(`Error loading ${key} from localStorage`, e);
    return null;
  }
};

const initialState = {
  // this double exclamation mark is to use suppose if return some value by local storage it firt convert it into false and then true if null it will be converted into true and then false..
  isLoggedIn: !!localStorage.getItem("token"),
  attendee: loadFromLocalStorage("attendee"),
  admin: loadFromLocalStorage("admin"),
  manager: loadFromLocalStorage("manager"),
  token: localStorage.getItem("token") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { userType, userData, token } = action.payload;
      state.isLoggedIn = true;
      state.token = token;
      localStorage.setItem("token", token);
      localStorage.setItem("userType", userType); // Save current role

      // Clear all roles first
      state.attendee = null;
      state.admin = null;
      state.manager = null;
      localStorage.removeItem("attendee");
      localStorage.removeItem("admin");
      localStorage.removeItem("manager");

      // Set based on userType
      if (userType === "attendee") {
        state.attendee = userData;
        localStorage.setItem("attendee", JSON.stringify(userData));
      } else if (userType === "manager") {
        state.manager = userData;
        localStorage.setItem("manager", JSON.stringify(userData));
      } else if (userType === "admin") {
        state.admin = userData;
        localStorage.setItem("admin", JSON.stringify(userData));
      }
    },

    logout: (state) => {
      state.isLoggedIn = false;
      state.attendee = null;
      state.admin = null;
      state.manager = null;
      state.token = null;
      localStorage.removeItem("attendee");
      localStorage.removeItem("admin");
      localStorage.removeItem("manager");
      localStorage.removeItem("token");
      localStorage.removeItem("userType");
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
