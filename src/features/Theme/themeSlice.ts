import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define interface for theme state
export interface ThemeState {
  mode: "light" | "dark";
}

// Define initial state with TypeScript type
const initialState: ThemeState = {
  mode: (localStorage.getItem("theme") as "light" | "dark") || "light", // Default to light mode
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state: ThemeState) => {
      state.mode = state.mode === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.mode);
    },
    setTheme: (state: ThemeState, action: PayloadAction<"light" | "dark">) => {
      state.mode = action.payload;
      localStorage.setItem("theme", state.mode);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
