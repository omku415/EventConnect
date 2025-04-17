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
  attendee:loadFromLocalStorage(),      
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.attendee = action.payload;
      // Save to localStorage whenever the state is updated
      localStorage.setItem("attendee", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.attendee = null;
      localStorage.removeItem("attendee"); // Remove from localStorage on logout
    }
  }
});


export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
