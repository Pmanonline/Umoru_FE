// import { createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import Cookies from "js-cookie";
// import backendURL from "../../config";
// // actions.js
// import { SET_EMAIL } from "../types";

// // Define your email sending API endpoint
// const SEND_EMAIL_ENDPOINT = "http://localhost:8080/api/registerMail";

// export const setEmail = (email) => ({
//   type: SET_EMAIL,
//   payload: email,
// });

// const normalizeUserData = (response) => {
//   // For regular login response
//   if (response.data?.requireOTP) {
//     return response.data;
//   }

//   // Check if it's a Google login response
//   if (response.data?.token && response.data?.user) {
//     return {
//       token: response.data.token,
//       user: {
//         ...response.data.user,
//       },
//     };
//   }

//   // For other response structures, try to normalize them
//   const { token, user, ...rest } = response.data;
//   return {
//     token,
//     user: user || rest,
//   };
// };

// export const setCredentials = (data) => ({
//   type: "auth/setCredentials",
//   payload: data,
// });

// export const loginUser = createAsyncThunk(
//   "auth/login",
//   async ({ email, password }, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(
//         `${backendURL}/api/login`,
//         { email, password },
//         {
//           headers: { "Content-Type": "application/json" },
//           withCredentials: false,
//         }
//       );

//       const normalizedData = normalizeUserData(response);

//       if (normalizedData.requireOTP) {
//         return normalizedData;
//       }

//       // Store normalized data
//       localStorage.setItem("userToken", normalizedData.token);
//       localStorage.setItem(
//         "userInfo",
//         JSON.stringify({
//           ...normalizedData.user,
//           token: normalizedData.token,
//         })
//       );

//       return normalizedData;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || error.message);
//     }
//   }
// );

// // Updated Google login helper function
// export const handleGoogleLogin = async (credential) => {
//   try {
//     const response = await axios.post(
//       `${backendURL}/api/google-login`,
//       { credential },
//       {
//         headers: { "Content-Type": "application/json" },
//         withCredentials: false,
//       }
//     );

//     if (!response.data) {
//       throw new Error("No data received from Google login");
//     }

//     const normalizedData = normalizeUserData(response);

//     // Store normalized data
//     localStorage.setItem("userToken", normalizedData.token);
//     localStorage.setItem(
//       "userInfo",
//       JSON.stringify({
//         ...normalizedData.user,
//         token: normalizedData.token,
//       })
//     );

//     return normalizedData;
//   } catch (error) {
//     throw new Error(error.response?.data?.message || "Google login failed");
//   }
// };

// export const registerUser = createAsyncThunk(
//   "auth/registerUser",
//   async ({ email, password, username }, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(
//         `${backendURL}/api/register`,
//         { email, password, username },
//         {
//           headers: { "Content-Type": "application/json" },
//           withCredentials: false,
//         }
//       );

//       // Store tokens and user info in cookies
//       if (typeof window !== "undefined") {
//         Cookies.set("userToken", response.data.token, { expires: 7 });
//         Cookies.set("userInfo", JSON.stringify(response.data.user), {
//           expires: 7,
//         });
//       }

//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response && error.response.data.message
//           ? error.response.data.message
//           : error.message
//       );
//     }
//   }
// );

// export const registerAdmin = createAsyncThunk(
//   "auth/registerAdmin",
//   async ({ email, password, username }, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(
//         `${backendURL}/api/registerAdmin`,
//         { email, password, username },
//         {
//           headers: { "Content-Type": "application/json" },
//           withCredentials: false,
//         }
//       );

//       // Store tokens and user info in cookies
//       if (typeof window !== "undefined") {
//         Cookies.set("userToken", response.data.token, { expires: 7 });
//         Cookies.set("userInfo", JSON.stringify(response.data.user), {
//           expires: 7,
//         });
//       }

//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response && error.response.data.message
//           ? error.response.data.message
//           : error.message
//       );
//     }
//   }
// );

// // Action to reset the password
// export const resetPassword = createAsyncThunk(
//   "auth/resetPassword",
//   async ({ email, password }, { rejectWithValue }) => {
//     try {
//       const config = {
//         headers: {
//           "Content-Type": "application/json",
//         },
//         withCredentials: false,
//       };

//       const response = await axios.post(
//         `${backendURL}/api/resetPassword`,
//         { email, password },
//         config
//       );

//       if (response.status === 201) {
//         return response.data; // Return data from the response
//       } else {
//         return rejectWithValue("Failed to reset password");
//       }
//     } catch (error) {
//       // Handle error
//       if (error.response && error.response.data.message) {
//         // If there's an error response with a message, return the message
//         return rejectWithValue(error.response.data.message);
//       } else {
//         // If there's an unexpected error, return the error message
//         return rejectWithValue(error.message);
//       }
//     }
//   }
// );

// export const verifyAdminOTP = createAsyncThunk(
//   "auth/verifyAdminOTP",
//   async ({ userId, otp }, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(
//         `${backendURL}/api/verifyAdminOTP`,
//         {
//           userId,
//           otp,
//         },
//         {
//           withCredentials: false,
//         }
//       );

//       // Make sure the response matches the expected structure
//       return {
//         user: response.data.user,
//         token: response.data.token,
//       };
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to verify OTP"
//       );
//     }
//   }
// );

// export const handleFacebookLogin = async (accessToken) => {
//   try {
//     const response = await axios.post(
//       `${backendURL}/api/facebook-login`,
//       { accessToken },
//       {
//         headers: { "Content-Type": "application/json" },
//         withCredentials: false,
//       }
//     );
//     const normalizedData = normalizeUserData(response);
//     localStorage.setItem("userToken", normalizedData.token);
//     localStorage.setItem(
//       "userInfo",
//       JSON.stringify({ ...normalizedData.user, token: normalizedData.token })
//     );
//     return normalizedData;
//   } catch (error) {
//     throw new Error(error.response?.data?.message || "Facebook login failed");
//   }
// };

// export const handleTwitterLogin = async ({ oauthToken, oauthVerifier }) => {
//   try {
//     const response = await axios.post(
//       `${backendURL}/api/twitter-login`,
//       { oauthToken, oauthVerifier },
//       {
//         headers: { "Content-Type": "application/json" },
//         withCredentials: false,
//       }
//     );
//     const normalizedData = normalizeUserData(response);
//     localStorage.setItem("userToken", normalizedData.token);
//     localStorage.setItem(
//       "userInfo",
//       JSON.stringify({ ...normalizedData.user, token: normalizedData.token })
//     );
//     return normalizedData;
//   } catch (error) {
//     throw new Error(error.response?.data?.message || "Twitter login failed");
//   }
// };
// features/Auth/authActions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import backendURL from "../../config";

// Define your email sending API endpoint (unused in this context, but kept for reference)
const SEND_EMAIL_ENDPOINT = "http://localhost:8080/api/registerMail";

export const setEmail = (email) => ({
  type: "SET_EMAIL",
  payload: email,
});

const normalizeUserData = (response) => {
  if (response.data?.requireOTP) {
    return response.data;
  }

  if (
    response.data?.accessToken &&
    response.data?.refreshToken &&
    response.data?.user
  ) {
    return {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      user: {
        ...response.data.user,
      },
    };
  }

  const { token, user, ...rest } = response.data;
  return {
    accessToken: token || response.data.accessToken,
    refreshToken: response.data.refreshToken,
    user: user || rest,
  };
};

export const setCredentials = (data) => ({
  type: "auth/setCredentials",
  payload: data,
});

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendURL}/api/login`,
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: false,
        }
      );

      const normalizedData = normalizeUserData(response);

      if (normalizedData.requireOTP) {
        return normalizedData;
      }

      // Store tokens and user info in cookies
      Cookies.set("accessToken", normalizedData.accessToken, {
        expires: 1 / 96,
      }); // 15 minutes
      Cookies.set("refreshToken", normalizedData.refreshToken, { expires: 7 }); // 7 days
      Cookies.set("userInfo", JSON.stringify(normalizedData.user), {
        expires: 7,
      });

      return normalizedData;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue, getState }) => {
    const refreshToken = Cookies.get("refreshToken");
    if (!refreshToken) {
      return rejectWithValue("No refresh token available");
    }

    try {
      const response = await axios.post(
        `${backendURL}/api/refresh-token`,
        { refreshToken },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: false,
        }
      );

      const { accessToken, user } = response.data;

      // Update cookies with new access token
      Cookies.set("accessToken", accessToken, { expires: 1 / 96 }); // 15 minutes
      Cookies.set("userInfo", JSON.stringify(user), { expires: 7 });

      return { accessToken, user };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Token refresh failed"
      );
    }
  }
);

// Updated Google login helper function
export const handleGoogleLogin = async (credential) => {
  try {
    const response = await axios.post(
      `${backendURL}/api/google-login`,
      { credential },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: false,
      }
    );

    if (!response.data) {
      throw new Error("No data received from Google login");
    }

    const normalizedData = normalizeUserData(response);

    // Store tokens and user info in cookies
    Cookies.set("accessToken", normalizedData.accessToken, { expires: 1 / 96 });
    Cookies.set("refreshToken", normalizedData.refreshToken, { expires: 7 });
    Cookies.set("userInfo", JSON.stringify(normalizedData.user), {
      expires: 7,
    });

    return normalizedData;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Google login failed");
  }
};

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ email, password, username }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendURL}/api/register`,
        { email, password, username },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: false,
        }
      );

      // Store tokens and user info in cookies (assuming register returns tokens)
      if (response.data.token) {
        Cookies.set("accessToken", response.data.token, { expires: 1 / 96 });
        Cookies.set("userInfo", JSON.stringify(response.data.user), {
          expires: 7,
        });
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const registerAdmin = createAsyncThunk(
  "auth/registerAdmin",
  async ({ email, password, username }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendURL}/api/registerAdmin`,
        { email, password, username },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: false,
        }
      );

      // Store tokens and user info in cookies (assuming register returns tokens)
      if (response.data.token) {
        Cookies.set("accessToken", response.data.token, { expires: 1 / 96 });
        Cookies.set("userInfo", JSON.stringify(response.data.user), {
          expires: 7,
        });
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, email, password }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: false,
      };

      const response = await axios.post(
        `${backendURL}/api/reset-password/${token}`, // Match backend route
        { email, password },
        config
      );

      if (response.status === 200) {
        return response.data;
      } else {
        return rejectWithValue("Failed to reset password");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const verifyAdminOTP = createAsyncThunk(
  "auth/verifyAdminOTP",
  async ({ userId, otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendURL}/api/verifyAdminOTP`,
        { userId, otp },
        {
          withCredentials: false,
        }
      );

      return {
        user: response.data.user,
        token: response.data.token,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to verify OTP"
      );
    }
  }
);

export const handleFacebookLogin = async (accessToken) => {
  try {
    const response = await axios.post(
      `${backendURL}/api/facebook-login`,
      { accessToken },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: false,
      }
    );
    const normalizedData = normalizeUserData(response);
    Cookies.set("accessToken", normalizedData.accessToken, { expires: 1 / 96 });
    Cookies.set("refreshToken", normalizedData.refreshToken, { expires: 7 });
    Cookies.set("userInfo", JSON.stringify(normalizedData.user), {
      expires: 7,
    });
    return normalizedData;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Facebook login failed");
  }
};

export const handleTwitterLogin = async ({ oauthToken, oauthVerifier }) => {
  try {
    const response = await axios.post(
      `${backendURL}/api/twitter-login`,
      { oauthToken, oauthVerifier },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: false,
      }
    );
    const normalizedData = normalizeUserData(response);
    Cookies.set("accessToken", normalizedData.accessToken, { expires: 1 / 96 });
    Cookies.set("refreshToken", normalizedData.refreshToken, { expires: 7 });
    Cookies.set("userInfo", JSON.stringify(normalizedData.user), {
      expires: 7,
    });
    return normalizedData;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Twitter login failed");
  }
};
