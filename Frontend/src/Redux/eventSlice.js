// src/redux/eventSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedEventId: null,
};

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    setSelectedEventId: (state, action) => {
      state.selectedEventId = action.payload;
    },
    clearSelectedEventId: (state) => {
      state.selectedEventId = null;
    },
  },
});

export const { setSelectedEventId, clearSelectedEventId } = eventSlice.actions;

export default eventSlice.reducer;
