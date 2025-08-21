// UMORUS-POR.../client/src/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/Auth/authSlice";
import themeReducer from "./features/Theme/themeSlice";
import navReducer from "./features/Nav/navSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    nav: navReducer,
  },
});
