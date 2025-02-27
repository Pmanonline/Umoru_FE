// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// export const loginUser = createAsyncThunk(
//   "auth/loginUser",
//   async (loginData, { rejectWithValue }) => {
//     try {
//       const response = await fetch("http://backend.edirect.ng/api/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(loginData),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         const userData = result.data.user; // Ensure correct path
//         const token = result.data.authorization; // Ensure correct path

//         localStorage.setItem("userInfo", JSON.stringify(userData));
//         localStorage.setItem("userToken", token);

//         return { user: userData, token };
//       } else {
//         return rejectWithValue(result.message || "Login failed");
//       }
//     } catch (error) {
//       return rejectWithValue("Network error. Please try again.");
//     }
//   }
// );

// export const logoutUser = createAsyncThunk(
//   "auth/logoutUser",
//   async (_, { rejectWithValue }) => {
//     try {
//       localStorage.removeItem("userInfo");
//       localStorage.removeItem("userToken");
//       return null;
//     } catch (error) {
//       return rejectWithValue("Logout failed");
//     }
//   }
// );

// const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     userInfo: localStorage.getItem("userInfo")
//       ? JSON.parse(localStorage.getItem("userInfo"))
//       : null,
//     token: localStorage.getItem("userToken") || null,
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(loginUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.loading = false;
//         // Ensure userInfo is stored correctly with contact data
//         state.userInfo = action.payload.user;
//         state.token = action.payload.token;
//       })

//       .addCase(loginUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         state.userInfo = null;
//         state.token = null;
//       })
//       .addCase(logoutUser.fulfilled, (state) => {
//         state.userInfo = null;
//         state.token = null;
//       });
//   },
// });

// export default authSlice.reducer;

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// export const loginUser = createAsyncThunk(
//   "auth/loginUser",
//   async (loginData, { rejectWithValue }) => {
//     try {
//       const response = await fetch("http://backend.edirect.ng/api/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(loginData),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         const userData = result.data.user;
//         const authData = result.data.authorization;

//         // Store the user data
//         localStorage.setItem("userInfo", JSON.stringify(userData));

//         // Store the full authorization object as JSON
//         localStorage.setItem("userToken", JSON.stringify(authData));

//         return { user: userData, token: authData };
//       } else {
//         return rejectWithValue(result.message || "Login failed");
//       }
//     } catch (error) {
//       return rejectWithValue("Network error. Please try again.");
//     }
//   }
// );

// export const refreshUserInfo = createAsyncThunk(
//   "auth/refreshUserInfo",
//   async (_, { rejectWithValue, getState }) => {
//     try {
//       const { userInfo } = getState().auth; // Get current user info to match user_id
//       const response = await fetch("http://backend.edirect.ng/api/profiles", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       const result = await response.json();
//       console.log(result, "result");
//       if (response.ok) {
//         // Assuming result.data is an array of profiles
//         const userProfile = result.data.find(
//           (profile) => profile.user_id === userInfo.id
//         );
//         if (userProfile) {
//           localStorage.setItem("userInfo", JSON.stringify(userProfile));
//           return userProfile;
//         } else {
//           return rejectWithValue("Profile not found for the current user");
//         }
//       } else {
//         return rejectWithValue(result.message || "Failed to fetch profiles");
//       }
//     } catch (error) {
//       return rejectWithValue("Network error while fetching profiles");
//     }
//   }
// );

// export const logoutUser = createAsyncThunk(
//   "auth/logoutUser",
//   async (_, { rejectWithValue }) => {
//     try {
//       localStorage.removeItem("userInfo");
//       localStorage.removeItem("userToken");
//       return null;
//     } catch (error) {
//       return rejectWithValue("Logout failed");
//     }
//   }
// );

// const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     userInfo: localStorage.getItem("userInfo")
//       ? JSON.parse(localStorage.getItem("userInfo"))
//       : null,
//     token: localStorage.getItem("userToken")
//       ? (() => {
//           try {
//             return JSON.parse(localStorage.getItem("userToken"));
//           } catch (e) {
//             localStorage.removeItem("userToken");
//             return null;
//           }
//         })()
//       : null,
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     updateUserInfo: (state, action) => {
//       state.userInfo = action.payload;
//       localStorage.setItem("userInfo", JSON.stringify(action.payload));
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(loginUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.userInfo = action.payload.user;
//         state.token = action.payload.token;
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         state.userInfo = null;
//         state.token = null;
//       })
//       .addCase(logoutUser.fulfilled, (state) => {
//         state.userInfo = null;
//         state.token = null;
//       })
//       .addCase(refreshUserInfo.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(refreshUserInfo.fulfilled, (state, action) => {
//         state.loading = false;
//         state.userInfo = action.payload;
//       })
//       .addCase(refreshUserInfo.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { updateUserInfo } = authSlice.actions;
// export default authSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await fetch("http://backend.edirect.ng/api/login", {
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
