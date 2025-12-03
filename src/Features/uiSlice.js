import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    windowMinutes: 15,
    lastDataTs: null,
    hasGap: false,
  },
  reducers: {
    setWindowMinutes: (state, action) => {
      state.windowMinutes = action.payload;
    },
    updateLastDataTs: (state, action) => {
      state.lastDataTs = action.payload;
      if (state.lastDataTs) {
        state.hasGap = Date.now() - state.lastDataTs > 10000;
      }
    },
  },
});

export const { setWindowMinutes, updateLastDataTs } = uiSlice.actions;
export default uiSlice.reducer;
