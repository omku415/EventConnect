// src/redux/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

// 🔹 Initial state of the auth slice
const initialState = {
  isLoggedIn: false,    // Track if attendee is logged in
  attendee: null        // Store attendee details like name, email, etc.
};

// 🔹 Create the slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // ✅ Login action - sets attendee info and login state
    login: (state, action) => {
      state.isLoggedIn = true;
      state.attendee = action.payload;
    },
    
    // ❌ Logout action - clears session and attendee data
    logout: (state) => {
      state.isLoggedIn = false;
      state.attendee = null;
    }
  }
});

// 🔹 Export actions to use in components
export const { login, logout } = authSlice.actions;

// 🔹 Export reducer to add to store
export default authSlice.reducer;
