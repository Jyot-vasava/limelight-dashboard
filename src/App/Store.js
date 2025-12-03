import { configureStore } from "@reduxjs/toolkit";
import { streamApi } from "../Features/apiSlice.js";
import uiReducer from "../Features/uiSlice.js";

 const store = configureStore({
  reducer: {
    [streamApi.reducerPath]: streamApi.reducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(streamApi.middleware),
});


export default store;