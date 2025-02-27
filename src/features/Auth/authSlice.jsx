import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import backendURL from "../../config";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${backendURL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();

      if (response.ok) {
        const userData = result.data.user;
        const authData = result.data.authorization;

        localStorage.setItem("userInfo", JSON.stringify(userData));
        localStorage.setItem("userToken", JSON.stringify(authData));

        return { user: userData, token: authData };
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
    token: localStorage.getItem("userToken")
      ? (() => {
          try {
            return JSON.parse(localStorage.getItem("userToken"));
          } catch (e) {
            localStorage.removeItem("userToken");
            return null;
          }
        })()
      : null,
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
