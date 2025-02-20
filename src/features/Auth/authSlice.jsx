import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await fetch("https://api.edirect.ng/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();

      if (response.ok) {
        // Ensure we're storing the correct user data
        const userData = result.user || result.data || result;

        localStorage.setItem("userInfo", JSON.stringify(userData));
        localStorage.setItem("userToken", result.token);

        return { user: userData, token: result.token };
      } else {
        return rejectWithValue(result.message || "Login failed");
      }
    } catch (error) {
      return rejectWithValue("Network error. Please try again.");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userToken");
      return null;
    } catch (error) {
      return rejectWithValue("Logout failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userInfo: localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null,
    token: localStorage.getItem("userToken") || null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure userInfo is set correctly
        state.userInfo = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.userInfo = null;
        state.token = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.userInfo = null;
        state.token = null;
      });
  },
});

export default authSlice.reducer;
