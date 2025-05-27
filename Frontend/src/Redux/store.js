// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import eventReducer from "./eventSlice"

// 🔹 Create and export the Redux store
const store = configureStore({
  reducer: {
    auth: authReducer, 
    event:eventReducer
  },
});

export default store;
