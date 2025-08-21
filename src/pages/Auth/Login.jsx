// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";
// import { setCredentials } from "../../features/Auth/authSlice";
// import {
//   loginUser,
//   handleGoogleLogin,
//   handleFacebookLogin,
//   handleTwitterLogin,
//   refreshToken,
// } from "../../features/Auth/authActions";
// import { resetSuccess, resetError } from "../../features/Auth/authSlice";
// import { Eye, EyeOff, Mail, Lock } from "lucide-react";
// import UmorusPortrait from "../../assets/images/authImage.png";
// import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
// import {
//   FacebookLoginButton,
//   TwitterLoginButton,
// } from "react-social-login-buttons";
// import { Alert, AlertDescription } from "../../components/tools/Alert";
// import Cookies from "js-cookie";

// const Login = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertConfig, setAlertConfig] = useState({
//     variant: "default",
//     message: "",
//   });

//   const { userInfo, error, isOtpRequired, tempUserId } = useSelector(
//     (state) => state.auth
//   );
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm();

//   const showAlertMessage = (message, variant = "default") => {
//     setAlertConfig({ message, variant });
//     setShowAlert(true);
//   };

//   useEffect(() => {
//     if (error) showAlertMessage(error, "destructive");
//     if (userInfo && (!isOtpRequired || userInfo.role !== "admin")) {
//       showAlertMessage("Login successful!", "success");
//       const timer = setTimeout(
//         () => navigate(userInfo.role === "admin" ? "/Admin/DashBoard" : "/"),
//         2000
//       );
//       return () => clearTimeout(timer);
//     }
//   }, [userInfo, error, isOtpRequired, navigate]);

//   useEffect(() => {
//     let refreshInterval;
//     const refreshTokenIfNeeded = async () => {
//       const accessToken = Cookies.get("accessToken");
//       if (accessToken) {
//         try {
//           const response = await dispatch(refreshToken()).unwrap();
//           dispatch(setCredentials(response));
//           console.log(
//             `[Frontend] Token refreshed at ${new Date().toISOString()} (WAT) for user ${response.user._id}`
//           );
//         } catch (err) {
//           showAlertMessage(
//             "Session expired. Please log in again.",
//             "destructive"
//           );
//           Cookies.remove("accessToken");
//           Cookies.remove("refreshToken");
//           Cookies.remove("userInfo");
//           navigate("/login");
//           console.error(
//             `[Frontend] Token refresh failed at ${new Date().toISOString()} (WAT): ${err.message}`
//           );
//         }
//       }
//     };

//     refreshInterval = setInterval(refreshTokenIfNeeded, 10 * 60 * 1000); // 10 minutes

//     const handleActivity = () => {
//       clearTimeout(refreshInterval);
//       refreshInterval = setInterval(refreshTokenIfNeeded, 10 * 60 * 1000);
//       console.log(
//         `[Frontend] User activity detected at ${new Date().toISOString()} (WAT)`
//       );
//     };

//     window.addEventListener("mousemove", handleActivity);
//     window.addEventListener("keydown", handleActivity);

//     return () => {
//       clearInterval(refreshInterval);
//       window.removeEventListener("mousemove", handleActivity);
//       window.removeEventListener("keydown", handleActivity);
//     };
//   }, [dispatch, navigate]);

//   const onSubmit = async (data) => {
//     setIsLoading(true);
//     try {
//       const result = await dispatch(loginUser(data)).unwrap();
//       if (result.requireOTP) {
//         showAlertMessage("OTP sent to your email. Please verify!", "success");
//       } else {
//         dispatch(setCredentials(result));
//         reset();
//       }
//     } catch (err) {
//       showAlertMessage(
//         err.message || "Login failed. Please try again.",
//         "destructive"
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleGoogleSuccess = async (credentialResponse) => {
//     try {
//       const response = await handleGoogleLogin(credentialResponse.credential);
//       dispatch(setCredentials(response));
//       showAlertMessage("Google login successful!", "success");
//     } catch (err) {
//       showAlertMessage(err.message || "Google login failed", "destructive");
//     }
//   };

//   const handleFacebookLoginClick = async () => {
//     try {
//       const response = await handleFacebookLogin({
//         accessToken: "fake_access_token", // Replace with real token acquisition logic
//       });
//       dispatch(setCredentials(response));
//       showAlertMessage("Facebook login successful!", "success");
//     } catch (err) {
//       showAlertMessage(err.message || "Facebook login failed", "destructive");
//     }
//   };

//   const handleTwitterLoginClick = async () => {
//     try {
//       const response = await handleTwitterLogin({
//         oauthToken: "fake_oauth_token",
//         oauthVerifier: "fake_verifier", // Replace with real token acquisition logic
//       });
//       dispatch(setCredentials(response));
//       showAlertMessage("Twitter login successful!", "success");
//     } catch (err) {
//       showAlertMessage(err.message || "Twitter login failed", "destructive");
//     }
//   };

//   return (
//     <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
//       <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 mt-16">
//         <div
//           className="absolute inset-0 z-0 bg-cover bg-center blur-sm opacity-50"
//           style={{ backgroundImage: `url(${UmorusPortrait})` }}
//         />
//         <div className="relative z-10 w-full max-w-lg p-6 sm:p-8 bg-white/95 dark:bg-gray-800/95 rounded-xl shadow-lg backdrop-blur-md space-y-6">
//           <div className="text-center space-y-2">
//             <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
//               Welcome back
//             </h2>
//             <p className="text-gray-600 dark:text-gray-300">
//               Sign in to unlock your potential
//             </p>
//           </div>
//           {!isOtpRequired ? (
//             <div className="space-y-6">
//               <div className="flex-wrap sm:flex-nowrap justify-between gap-4 sm:gap-3 mt-4">
//                 <div className="flex-1 min-w-[100px] my-5">
//                   <GoogleLogin
//                     onSuccess={handleGoogleSuccess}
//                     onError={() =>
//                       showAlertMessage("Google Sign-In failed", "destructive")
//                     }
//                     useOneTap
//                     theme="filled_blue"
//                     shape="rectangular"
//                     width="100%"
//                   />
//                 </div>
//                 <div className="flex-1 min-w-[100px]">
//                   <FacebookLoginButton
//                     onClick={handleFacebookLoginClick}
//                     style={{ width: "100%" }}
//                   />
//                 </div>
//                 <div className="flex-1 min-w-[100px]">
//                   <TwitterLoginButton
//                     onClick={handleTwitterLoginClick}
//                     style={{ width: "100%" }}
//                   />
//                 </div>
//               </div>
//               <div className="relative flex items-center my-4">
//                 <div className="flex-grow border-t border-gray-300 dark:border-gray-600" />
//                 <span className="flex-shrink mx-4 text-sm text-gray-500 dark:text-gray-400">
//                   or sign in with email
//                 </span>
//                 <div className="flex-grow border-t border-gray-300 dark:border-gray-600" />
//               </div>
//               <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//                 <div className="space-y-4">
//                   <InputField
//                     id="email"
//                     type="email"
//                     placeholder="Email address"
//                     icon={
//                       <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400" />
//                     }
//                     register={register("email", {
//                       required: "Email is required",
//                       pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                     })}
//                     error={errors.email}
//                   />
//                   <InputField
//                     id="password"
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Password"
//                     icon={
//                       <Lock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
//                     }
//                     toggleIcon={
//                       <button
//                         type="button"
//                         onClick={() => setShowPassword(!showPassword)}>
//                         {showPassword ? (
//                           <EyeOff className="h-5 w-5 text-gray-500 dark:text-gray-400" />
//                         ) : (
//                           <Eye className="h-5 w-5 text-gray-500 dark:text-gray-400" />
//                         )}
//                       </button>
//                     }
//                     register={register("password", {
//                       required: "Password is required",
//                       minLength: 6,
//                     })}
//                     error={errors.password}
//                   />
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <Link
//                     to="/register"
//                     className="text-primary dark:text-primary-darkMode hover:text-primary-light dark:hover:text-primary-light">
//                     Create account
//                   </Link>
//                   <Link
//                     to="/forgot-password"
//                     className="text-primary dark:text-primary-darkMode hover:text-primary-light dark:hover:text-primary-light">
//                     Forgot password?
//                   </Link>
//                 </div>
//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-light dark:bg-primary-darkMode dark:hover:bg-primary-light transition-colors duration-200 disabled:opacity-50 flex items-center justify-center">
//                   {isLoading ? (
//                     <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
//                   ) : (
//                     "Sign In"
//                   )}
//                 </button>
//               </form>
//             </div>
//           ) : (
//             <OtpVerification onSubmit={handleOtpSubmit} />
//           )}
//           {showAlert && (
//             <Alert
//               variant={alertConfig.variant}
//               show={showAlert}
//               onClose={() => setShowAlert(false)}
//               autoClose={true}
//               autoCloseTime={5000}>
//               <AlertDescription>{alertConfig.message}</AlertDescription>
//             </Alert>
//           )}
//         </div>
//       </div>
//     </GoogleOAuthProvider>
//   );

//   // OTP submission handler
//   const handleOtpSubmit = async (otp) => {
//     setIsLoading(true);
//     try {
//       const result = await dispatch(
//         verifyAdminOTP({ userId: tempUserId, otp })
//       ).unwrap();
//       dispatch(setCredentials(result));
//       showAlertMessage("OTP verified successfully!", "success");
//       const timer = setTimeout(() => navigate("/Admin/DashBoard"), 2000);
//       return () => clearTimeout(timer);
//     } catch (err) {
//       showAlertMessage(err || "Invalid OTP", "destructive");
//     } finally {
//       setIsLoading(false);
//     }
//   };
// };

// const InputField = ({
//   id,
//   type,
//   placeholder,
//   icon,
//   toggleIcon,
//   register,
//   error,
// }) => (
//   <div className="space-y-1">
//     <div className="relative">
//       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//         {icon}
//       </div>
//       <input
//         {...register}
//         id={id}
//         type={type}
//         placeholder={placeholder}
//         className={`w-full px-3 py-2 pl-10 pr-10 border ${
//           error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
//         } rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-darkMode focus:border-primary dark:focus:border-primary-darkMode transition-all placeholder-gray-500 dark:placeholder-gray-400`}
//       />
//       {toggleIcon && (
//         <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
//           {toggleIcon}
//         </div>
//       )}
//     </div>
//     {error && (
//       <p className="text-sm text-red-600 dark:text-red-400">{error.message}</p>
//     )}
//   </div>
// );

// const OtpVerification = ({ onSubmit }) => {
//   const [otp, setOtp] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (otp.length !== 6) return setError("OTP must be 6 digits");
//     onSubmit(otp);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div className="space-y-2">
//         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//           Enter OTP
//         </label>
//         <input
//           type="text"
//           maxLength={6}
//           value={otp}
//           onChange={(e) => setOtp(e.target.value)}
//           className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-darkMode focus:border-primary dark:focus:border-primary-darkMode"
//           placeholder="Enter 6-digit OTP"
//         />
//         {error && (
//           <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
//         )}
//       </div>
//       <button
//         type="submit"
//         className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-light dark:bg-primary-darkMode dark:hover:bg-primary-light transition-colors">
//         Verify OTP
//       </button>
//     </form>
//   );
// };

// export default Login;

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setCredentials } from "../../features/Auth/authSlice";
import {
  loginUser,
  handleGoogleLogin,
  handleFacebookLogin,
  handleTwitterLogin,
  refreshToken,
  verifyAdminOTP,
} from "../../features/Auth/authActions";
import { resetSuccess, resetError } from "../../features/Auth/authSlice";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import UmorusPortrait from "../../assets/images/authImage.png";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import {
  FacebookLoginButton,
  TwitterLoginButton,
} from "react-social-login-buttons";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import Cookies from "js-cookie";

// OTP submission handler
const handleOtpSubmit = async (
  otp,
  dispatch,
  tempUserId,
  showAlertMessage,
  navigate,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const result = await dispatch(
      verifyAdminOTP({ userId: tempUserId, otp })
    ).unwrap();
    dispatch(setCredentials(result));
    showAlertMessage("OTP verified successfully!", "success");
    setTimeout(() => navigate("/Admin/DashBoard"), 2000); // Removed return cleanup
  } catch (err) {
    showAlertMessage(err.message || "Invalid OTP", "destructive");
  } finally {
    setIsLoading(false);
  }
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });

  const { userInfo, error, isOtpRequired, tempUserId } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const showAlertMessage = (message, variant = "default") => {
    setAlertConfig({ message: String(message), variant }); // Ensure message is a string
    setShowAlert(true);
  };

  useEffect(() => {
    if (error) showAlertMessage(error, "destructive");
    if (userInfo && (!isOtpRequired || userInfo.role !== "admin")) {
      showAlertMessage("Login successful!", "success");
      const timer = setTimeout(
        () => navigate(userInfo.role === "admin" ? "/Admin/DashBoard" : "/"),
        2000
      );
      return () => clearTimeout(timer);
    }
  }, [userInfo, error, isOtpRequired, navigate]);

  useEffect(() => {
    let refreshInterval;
    const refreshTokenIfNeeded = async () => {
      const accessToken = Cookies.get("accessToken");
      if (accessToken) {
        try {
          const response = await dispatch(refreshToken()).unwrap();
          dispatch(setCredentials(response));
          // console.log(
          //   `[Frontend] Token refreshed at ${new Date().toISOString()} (WAT) for user ${response.user._id}`
          // );
        } catch (err) {
          showAlertMessage(
            "Session expired. Please log in again.",
            "destructive"
          );
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          Cookies.remove("userInfo");
          navigate("/login");
          console.error(
            `[Frontend] Token refresh failed at ${new Date().toISOString()} (WAT): ${err.message}`
          );
        }
      }
    };

    refreshInterval = setInterval(refreshTokenIfNeeded, 10 * 60 * 1000); // 10 minutes

    const handleActivity = () => {
      clearTimeout(refreshInterval);
      refreshInterval = setInterval(refreshTokenIfNeeded, 10 * 60 * 1000);
      console.log(
        `[Frontend] User activity detected at ${new Date().toISOString()} (WAT)`
      );
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);

    return () => {
      clearInterval(refreshInterval);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
    };
  }, [dispatch, navigate]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await dispatch(loginUser(data)).unwrap();
      if (result.requireOTP) {
        showAlertMessage("OTP sent to your email. Please verify!", "success");
      } else {
        dispatch(setCredentials(result));
        reset();
      }
    } catch (err) {
      showAlertMessage(
        err.message || "Login failed. Please try again.",
        "destructive"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await handleGoogleLogin(credentialResponse.credential);
      dispatch(setCredentials(response));
      showAlertMessage("Google login successful!", "success");
    } catch (err) {
      showAlertMessage(err.message || "Google login failed", "destructive");
    }
  };

  const handleFacebookLoginClick = async () => {
    try {
      const response = await handleFacebookLogin({
        accessToken: "fake_access_token", // Replace with real token acquisition logic
      });
      dispatch(setCredentials(response));
      showAlertMessage("Facebook login successful!", "success");
    } catch (err) {
      showAlertMessage(err.message || "Facebook login failed", "destructive");
    }
  };

  const handleTwitterLoginClick = async () => {
    try {
      const response = await handleTwitterLogin({
        oauthToken: "fake_oauth_token",
        oauthVerifier: "fake_verifier", // Replace with real token acquisition logic
      });
      dispatch(setCredentials(response));
      showAlertMessage("Twitter login successful!", "success");
    } catch (err) {
      showAlertMessage(err.message || "Twitter login failed", "destructive");
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 mt-16">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center blur-sm opacity-50"
          style={{ backgroundImage: `url(${UmorusPortrait})` }}
        />
        <div className="relative z-10 w-full max-w-lg p-6 sm:p-8 bg-white/95 dark:bg-gray-800/95 rounded-xl shadow-lg backdrop-blur-md space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Sign in to unlock your potential
            </p>
          </div>
          {!isOtpRequired ? (
            <div className="space-y-6">
              <div className="flex-wrap sm:flex-nowrap justify-between gap-4 sm:gap-3 mt-4">
                <div className="flex-1 min-w-[100px] my-5">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() =>
                      showAlertMessage("Google Sign-In failed", "destructive")
                    }
                    useOneTap
                    theme="filled_blue"
                    shape="rectangular"
                    width="100%"
                  />
                </div>
                <div className="flex-1 min-w-[100px]">
                  <FacebookLoginButton
                    onClick={handleFacebookLoginClick}
                    style={{ width: "100%" }}
                  />
                </div>
                <div className="flex-1 min-w-[100px]">
                  <TwitterLoginButton
                    onClick={handleTwitterLoginClick}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
              <div className="relative flex items-center my-4">
                <div className="flex-grow border-t border-gray-300 dark:border-gray-600" />
                <span className="flex-shrink mx-4 text-sm text-gray-500 dark:text-gray-400">
                  or sign in with email
                </span>
                <div className="flex-grow border-t border-gray-300 dark:border-gray-600" />
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-4">
                  <InputField
                    id="email"
                    type="email"
                    placeholder="Email address"
                    icon={
                      <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    }
                    register={register("email", {
                      required: "Email is required",
                      pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    })}
                    error={errors.email}
                  />
                  <InputField
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    icon={
                      <Lock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    }
                    toggleIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        )}
                      </button>
                    }
                    register={register("password", {
                      required: "Password is required",
                      minLength: 6,
                    })}
                    error={errors.password}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <Link
                    to="/register"
                    className="text-primary dark:text-primary-darkMode hover:text-primary-light dark:hover:text-primary-light">
                    Create account
                  </Link>
                  <Link
                    to="/forgot-password"
                    className="text-primary dark:text-primary-darkMode hover:text-primary-light dark:hover:text-primary-light">
                    Forgot password?
                  </Link>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-light dark:bg-primary-darkMode dark:hover:bg-primary-light transition-colors duration-200 disabled:opacity-50 flex items-center justify-center">
                  {isLoading ? (
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>
            </div>
          ) : (
            <OtpVerification
              onSubmit={(otp) =>
                handleOtpSubmit(
                  otp,
                  dispatch,
                  tempUserId,
                  showAlertMessage,
                  navigate,
                  setIsLoading
                )
              }
            />
          )}
          {showAlert && (
            <Alert
              variant={alertConfig.variant}
              show={showAlert}
              onClose={() => setShowAlert(false)}
              autoClose={true}
              autoCloseTime={5000}>
              <AlertDescription>{alertConfig.message}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

const InputField = ({
  id,
  type,
  placeholder,
  icon,
  toggleIcon,
  register,
  error,
}) => (
  <div className="space-y-1">
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>
      <input
        {...register}
        id={id}
        type={type}
        placeholder={placeholder}
        className={`w-full px-3 py-2 pl-10 pr-10 border ${
          error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
        } rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-darkMode focus:border-primary dark:focus:border-primary-darkMode transition-all placeholder-gray-500 dark:placeholder-gray-400`}
      />
      {toggleIcon && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {toggleIcon}
        </div>
      )}
    </div>
    {error && (
      <p className="text-sm text-red-600 dark:text-red-400">{error.message}</p>
    )}
  </div>
);

const OtpVerification = ({ onSubmit }) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length !== 6) return setError("OTP must be 6 digits");
    onSubmit(otp);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Enter OTP
        </label>
        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-darkMode focus:border-primary dark:focus:border-primary-darkMode"
          placeholder="Enter 6-digit OTP"
        />
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
      <button
        type="submit"
        className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-light dark:bg-primary-darkMode dark:hover:bg-primary-light transition-colors">
        Verify OTP
      </button>
    </form>
  );
};

export default Login;
