// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"; // Import your auth slice

// 🔹 Create and export the Redux store
const store = configureStore({
  reducer: {
    auth: authReducer, // Register the auth reducer
  },
});

export default store;
