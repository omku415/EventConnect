// src/redux/authSlice.js
import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  isLoggedIn: false,   
  attendee: null        
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.attendee = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.attendee = null;
    }
  }
});


export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
