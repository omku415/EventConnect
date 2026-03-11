// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import eventReducer from "./slices/eventSlice"

// 🔹 Create and export the Redux store
const store = configureStore({
  reducer: {
    auth: authReducer, 
    event:eventReducer
  },
});

export default store;
