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
//   verifyAdminOTP,
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

// // OTP submission handler
// const handleOtpSubmit = async (
//   otp,
//   dispatch,
//   tempUserId,
//   showAlertMessage,
//   navigate,
//   setIsLoading
// ) => {
//   setIsLoading(true);
//   try {
//     const result = await dispatch(
//       verifyAdminOTP({ userId: tempUserId, otp })
//     ).unwrap();
//     dispatch(setCredentials(result));
//     showAlertMessage("OTP verified successfully!", "success");
//     setTimeout(() => navigate("/Admin/DashBoard"), 2000); // Removed return cleanup
//   } catch (err) {
//     showAlertMessage(err.message || "Invalid OTP", "destructive");
//   } finally {
//     setIsLoading(false);
//   }
// };

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
//     setAlertConfig({ message: String(message), variant }); // Ensure message is a string
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
//           // console.log(
//           //   `[Frontend] Token refreshed at ${new Date().toISOString()} (WAT) for user ${response.user._id}`
//           // );
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
//             <OtpVerification
//               onSubmit={(otp) =>
//                 handleOtpSubmit(
//                   otp,
//                   dispatch,
//                   tempUserId,
//                   showAlertMessage,
//                   navigate,
//                   setIsLoading
//                 )
//               }
//             />
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

// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { setCredentials } from "../../features/Auth/authSlice";
// import {
//   loginUser,
//   handleGoogleLogin,
//   handleFacebookLogin,
//   handleTwitterLogin,
//   refreshToken,
//   verifyAdminOTP,
// } from "../../features/Auth/authActions";
// import { resetSuccess, resetError } from "../../features/Auth/authSlice";
// import { Eye, EyeOff, Mail, Lock, Twitter } from "lucide-react";
// import UmorusPortrait from "../../assets/images/authImage.png";
// import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
// import { FacebookLoginButton } from "react-social-login-buttons";
// import { Alert, AlertDescription } from "../../components/tools/Alert";
// import Cookies from "js-cookie";

// const handleOtpSubmit = async (
//   otp,
//   dispatch,
//   tempUserId,
//   showAlertMessage,
//   navigate,
//   setIsLoading
// ) => {
//   setIsLoading(true);
//   try {
//     console.log("Verifying OTP for userId:", tempUserId);
//     const result = await dispatch(
//       verifyAdminOTP({ userId: tempUserId, otp })
//     ).unwrap();
//     dispatch(setCredentials(result));
//     showAlertMessage("OTP verified successfully!", "success");
//     setTimeout(() => navigate("/Admin/DashBoard"), 2000);
//   } catch (err) {
//     console.error("OTP Verification Error:", err);
//     showAlertMessage(err.message || "Invalid OTP", "destructive");
//   } finally {
//     setIsLoading(false);
//   }
// };

// const Login = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertConfig, setAlertConfig] = useState({
//     variant: "default",
//     message: "",
//   });
//   const [isFacebookSDKLoaded, setIsFacebookSDKLoaded] = useState(false);

//   const { userInfo, error, isOtpRequired, tempUserId } = useSelector(
//     (state) => state.auth
//   );
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm();

//   const showAlertMessage = (message, variant = "default") => {
//     console.log("Alert Message:", { message, variant });
//     setAlertConfig({ message: String(message), variant });
//     setShowAlert(true);
//   };

//   // Check if Facebook SDK is loaded with CSP-safe loading
//   useEffect(() => {
//     console.log("Checking Facebook SDK availability...");
//     if (window.FB) {
//       console.log("Facebook SDK already available, initializing...");
//       window.FB.init({
//         appId: "1124815999027864",
//         cookie: true,
//         xfbml: true,
//         version: "v12.0",
//       });
//       setIsFacebookSDKLoaded(true);
//     } else {
//       console.log("Facebook SDK not available, setting up async init...");
//       const script = document.createElement("script");
//       script.src = "https://connect.facebook.net/en_US/sdk.js";
//       script.async = true;
//       script.setAttribute("nonce", import.meta.env.VITE_CSP_NONCE); // Dynamic nonce
//       script.onload = () => {
//         console.log("Facebook SDK script loaded");
//         window.fbAsyncInit = function () {
//           console.log("Facebook SDK async init triggered...");
//           window.FB.init({
//             appId: "1124815999027864",
//             cookie: true,
//             xfbml: true,
//             version: "v12.0",
//           });
//           setIsFacebookSDKLoaded(true);
//           console.log("Facebook SDK initialized successfully");
//         };
//       };
//       script.onerror = () =>
//         console.error("Failed to load Facebook SDK script");
//       document.body.appendChild(script);
//     }
//     // Cleanup on unmount
//     return () => {
//       const script = document.querySelector("#facebook-jssdk");
//       if (script) document.body.removeChild(script);
//     };
//   }, []);

//   useEffect(() => {
//     console.log("Auth State Updated:", { userInfo, error, isOtpRequired });
//     if (error) showAlertMessage(error, "destructive");
//     if (userInfo && (!isOtpRequired || userInfo.role !== "admin")) {
//       showAlertMessage("Login successful!", "success");
//       setTimeout(
//         () => navigate(userInfo.role === "admin" ? "/Admin/DashBoard" : "/"),
//         2000
//       );
//     }
//   }, [userInfo, error, isOtpRequired, navigate]);

//   useEffect(() => {
//     const handleTwitterCallback = async () => {
//       const params = new URLSearchParams(location.search);
//       const code = params.get("code");
//       const state = params.get("state");

//       console.log("Twitter Callback Params:", { code, state });
//       if (code && state) {
//         try {
//           const result = await dispatch(
//             handleTwitterLogin({
//               code,
//               codeVerifier: sessionStorage.getItem("twitterCodeVerifier"),
//             })
//           ).unwrap();
//           dispatch(setCredentials(result));
//           showAlertMessage("Twitter login successful!", "success");
//           navigate("/");
//         } catch (err) {
//           console.error("Twitter Login Error:", err);
//           showAlertMessage(
//             err.message || "Twitter login failed",
//             "destructive"
//           );
//         }
//       }
//     };

//     handleTwitterCallback();
//   }, [location, dispatch, navigate]);

//   const handleGoogleSuccess = async (credentialResponse) => {
//     console.log("Google Login Success:", credentialResponse);
//     setIsLoading(true);
//     try {
//       const result = await dispatch(
//         handleGoogleLogin(credentialResponse.credential)
//       ).unwrap();
//       dispatch(setCredentials(result));
//       showAlertMessage("Google login successful!", "success");
//     } catch (err) {
//       console.error("Google Login Error:", err);
//       showAlertMessage(err.message || "Google login failed", "destructive");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleFacebookLoginClick = async (response) => {
//     console.log("Facebook Login Response:", response);
//     if (response.authResponse && response.authResponse.accessToken) {
//       setIsLoading(true);
//       try {
//         console.log(
//           "Dispatching handleFacebookLogin with accessToken:",
//           response.authResponse.accessToken
//         );
//         const result = await dispatch(
//           handleFacebookLogin(response.authResponse.accessToken)
//         ).unwrap();
//         console.log("handleFacebookLogin result:", result);
//         dispatch(setCredentials(result));
//         showAlertMessage("Facebook login successful!", "success");
//       } catch (err) {
//         console.error("Facebook Login Error:", err);
//         showAlertMessage(err.message || "Facebook login failed", "destructive");
//       } finally {
//         setIsLoading(false);
//       }
//     } else {
//       console.warn("No valid access token, marking as cancelled:", response);
//       showAlertMessage("Facebook login cancelled", "destructive");
//     }
//   };

//   const handleFacebookButtonClick = () => {
//     console.log("Facebook Button Clicked");
//     if (isFacebookSDKLoaded && window.FB) {
//       window.FB.login(
//         (response) => {
//           handleFacebookLoginClick(response).catch((err) =>
//             console.error("Async Error in FB.login:", err)
//           );
//         },
//         { scope: "public_profile" }
//       );
//     } else {
//       console.error("Facebook SDK not loaded or initialized");
//       showAlertMessage("Facebook SDK not loaded", "destructive");
//     }
//   };

//   const handleTwitterLoginClick = async () => {
//     console.log("Initiating Twitter Login...");
//     try {
//       const response = await fetch(
//         `${process.env.VITE_API_URL}/api/twitter/auth`,
//         {
//           method: "GET",
//           credentials: "include",
//         }
//       );
//       const { url, codeVerifier } = await response.json();
//       console.log("Twitter Auth Response:", { url, codeVerifier });
//       sessionStorage.setItem("twitterCodeVerifier", codeVerifier);
//       window.location.href = url;
//     } catch (err) {
//       console.error("Twitter Login Initiation Error:", err);
//       showAlertMessage("Failed to initiate Twitter login", "destructive");
//     }
//   };

//   const onSubmit = async (data) => {
//     console.log("Form Submit Data:", data);
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
//       console.error("Login Error:", err);
//       showAlertMessage(
//         err.message || "Login failed. Please try again.",
//         "destructive"
//       );
//     } finally {
//       setIsLoading(false);
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
//               <div className="flex flex-wrap sm:flex-nowrap justify-between gap-4 sm:gap-3 mt-4">
//                 <div className="flex-1 min-w-[100px] my-5">
//                   <GoogleLogin
//                     onSuccess={handleGoogleSuccess}
//                     onError={() =>
//                       showAlertMessage("Google Sign-In failed", "destructive")
//                     }
//                     useOneTap={false}
//                     theme="filled_blue"
//                     shape="rectangular"
//                     width={300} // Changed to numeric value
//                     disabled={isLoading}
//                   />
//                 </div>
//                 <div className="flex-1 min-w-[100px] my-5">
//                   {isFacebookSDKLoaded ? (
//                     <FacebookLoginButton
//                       onClick={handleFacebookButtonClick}
//                       style={{
//                         width: "100%",
//                         background:
//                           "linear-gradient(to right, #1877F2, #3B5998)",
//                         color: "white",
//                         borderRadius: "0.375rem",
//                         padding: "0.5rem",
//                         fontSize: "0.875rem",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                       disabled={isLoading}
//                     />
//                   ) : (
//                     <button
//                       className="w-full py-2 text-sm font-medium text-white bg-gradient-to-r from-gray-400 to-gray-500 rounded-lg opacity-50 cursor-not-allowed"
//                       disabled>
//                       Loading Facebook Login...
//                     </button>
//                   )}
//                 </div>
//                 <div className="flex-1 min-w-[100px] my-5">
//                   <button
//                     onClick={handleTwitterLoginClick}
//                     className="w-full py-2 text-sm font-medium text-white bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light rounded-lg transition-colors focus:ring-2 focus:ring-primary-light"
//                     aria-label="Sign in with Twitter"
//                     disabled={isLoading}>
//                     <Twitter className="w-4 h-4 mr-2" />
//                     Sign in with Twitter
//                   </button>
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
//             <OtpVerification
//               onSubmit={(otp) =>
//                 handleOtpSubmit(
//                   otp,
//                   dispatch,
//                   tempUserId,
//                   showAlertMessage,
//                   navigate,
//                   setIsLoading
//                 )
//               }
//             />
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

// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { setCredentials } from "../../features/Auth/authSlice";
// import {
//   loginUser,
//   handleGoogleLogin,
//   handleFacebookLogin,
//   handleTwitterLogin,
//   refreshToken,
//   verifyAdminOTP,
// } from "../../features/Auth/authActions";
// import backendURL from "../../config";
// import { resetSuccess, resetError } from "../../features/Auth/authSlice";
// import { Eye, EyeOff, Mail, Lock, Twitter } from "lucide-react";
// import UmorusPortrait from "../../assets/images/authImage.png";
// import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
// import { FacebookLoginButton } from "react-social-login-buttons";
// import { Alert, AlertDescription } from "../../components/tools/Alert";
// import Cookies from "js-cookie";

// const handleOtpSubmit = async (
//   otp,
//   dispatch,
//   tempUserId,
//   showAlertMessage,
//   navigate,
//   setIsLoading
// ) => {
//   setIsLoading(true);
//   try {
//     console.log("Verifying OTP for userId:", tempUserId);
//     const result = await dispatch(
//       verifyAdminOTP({ userId: tempUserId, otp })
//     ).unwrap();
//     dispatch(setCredentials(result));
//     showAlertMessage("OTP verified successfully!", "success");
//     setTimeout(() => navigate("/Admin/DashBoard"), 2000);
//   } catch (err) {
//     console.error("OTP Verification Error:", err);
//     showAlertMessage(err.message || "Invalid OTP", "destructive");
//   } finally {
//     setIsLoading(false);
//   }
// };

// const Login = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertConfig, setAlertConfig] = useState({
//     variant: "default",
//     message: "",
//   });
//   const [isFacebookSDKLoaded, setIsFacebookSDKLoaded] = useState(false);

//   const { userInfo, error, isOtpRequired, tempUserId } = useSelector(
//     (state) => state.auth
//   );
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm();

//   const showAlertMessage = (message, variant = "default") => {
//     console.log("Alert Message:", { message, variant });
//     setAlertConfig({ message: String(message), variant });
//     setShowAlert(true);
//   };

//   useEffect(() => {
//     console.log("Checking Facebook SDK availability...");
//     if (window.FB) {
//       console.log("Facebook SDK already available, initializing...");
//       window.FB.init({
//         appId: import.meta.env.VITE_FACEBOOK_APP_ID,
//         cookie: true,
//         xfbml: true,
//         version: "v12.0",
//       });
//       setIsFacebookSDKLoaded(true);
//     } else {
//       console.log("Facebook SDK not available, setting up async init...");
//       const script = document.createElement("script");
//       script.src = "https://connect.facebook.net/en_US/sdk.js";
//       script.async = true;
//       script.setAttribute("nonce", import.meta.env.VITE_CSP_NONCE);
//       script.onload = () => {
//         console.log("Facebook SDK script loaded");
//         window.fbAsyncInit = function () {
//           console.log("Facebook SDK async init triggered...");
//           window.FB.init({
//             appId: import.meta.env.VITE_FACEBOOK_APP_ID,
//             cookie: true,
//             xfbml: true,
//             version: "v12.0",
//           });
//           setIsFacebookSDKLoaded(true);
//           console.log("Facebook SDK initialized successfully");
//         };
//       };
//       script.onerror = () =>
//         console.error("Failed to load Facebook SDK script");
//       document.body.appendChild(script);
//     }
//     return () => {
//       const script = document.querySelector("#facebook-jssdk");
//       if (script) document.body.removeChild(script);
//     };
//   }, []);

//   useEffect(() => {
//     console.log("Auth State Updated:", { userInfo, error, isOtpRequired });
//     if (error) showAlertMessage(error, "destructive");
//     if (userInfo && (!isOtpRequired || userInfo.role !== "admin")) {
//       showAlertMessage("Login successful!", "success");
//       setTimeout(
//         () => navigate(userInfo.role === "admin" ? "/Admin/DashBoard" : "/"),
//         2000
//       );
//     }
//   }, [userInfo, error, isOtpRequired, navigate]);

//   useEffect(() => {
//     const handleTwitterCallback = async () => {
//       const params = new URLSearchParams(location.search);
//       const code = params.get("code");
//       const state = params.get("state");

//       console.log("Twitter Callback Params:", { code, state });
//       if (code && state) {
//         setIsLoading(true);
//         try {
//           const result = await dispatch(
//             handleTwitterLogin({
//               code,
//               codeVerifier: sessionStorage.getItem("twitterCodeVerifier"),
//             })
//           ).unwrap();
//           dispatch(setCredentials(result));
//           showAlertMessage("Twitter login successful!", "success");
//           navigate("/");
//         } catch (err) {
//           console.error("Twitter Login Error:", err);
//           showAlertMessage(
//             err.message || "Twitter login failed",
//             "destructive"
//           );
//         } finally {
//           setIsLoading(false);
//           sessionStorage.removeItem("twitterCodeVerifier");
//         }
//       }
//     };

//     handleTwitterCallback();
//   }, [location, dispatch, navigate]);

//   const handleGoogleSuccess = async (credentialResponse) => {
//     console.log("Google Login Success:", credentialResponse);
//     setIsLoading(true);
//     try {
//       const result = await dispatch(
//         handleGoogleLogin(credentialResponse.credential)
//       ).unwrap();
//       dispatch(setCredentials(result));
//       showAlertMessage("Google login successful!", "success");
//     } catch (err) {
//       console.error("Google Login Error:", err);
//       showAlertMessage(err.message || "Google login failed", "destructive");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleFacebookLoginClick = async (response) => {
//     console.log("Facebook Login Response:", response);
//     if (response.authResponse && response.authResponse.accessToken) {
//       setIsLoading(true);
//       try {
//         console.log(
//           "Dispatching handleFacebookLogin with accessToken:",
//           response.authResponse.accessToken
//         );
//         const result = await dispatch(
//           handleFacebookLogin(response.authResponse.accessToken)
//         ).unwrap();
//         console.log("handleFacebookLogin result:", result);
//         dispatch(setCredentials(result));
//         showAlertMessage("Facebook login successful!", "success");
//       } catch (err) {
//         console.error(
//           "Facebook Login Error:",
//           err.response?.data?.message || err.message
//         );
//         showAlertMessage(
//           err.response?.data?.message || "Facebook login failed",
//           "destructive"
//         );
//       } finally {
//         setIsLoading(false);
//       }
//     } else {
//       console.warn("No valid access token, marking as cancelled:", response);
//       showAlertMessage("Facebook login cancelled", "destructive");
//     }
//   };

//   const handleFacebookButtonClick = () => {
//     console.log("Facebook Button Clicked");
//     if (isFacebookSDKLoaded && window.FB) {
//       window.FB.login(
//         (response) => {
//           handleFacebookLoginClick(response).catch((err) =>
//             console.error("Async Error in FB.login:", err)
//           );
//         },
//         { scope: "public_profile,email" }
//       );
//     } else {
//       console.error("Facebook SDK not loaded or initialized");
//       showAlertMessage("Facebook SDK not loaded", "destructive");
//     }
//   };

//   const handleTwitterLoginClick = async () => {
//     console.log("Initiating Twitter Login...");
//     try {
//       const response = await fetch(`${backendURL}/api/auth/twitter/auth`, {
//         method: "GET",
//         credentials: "include",
//       });
//       if (!response.ok)
//         throw new Error(`HTTP error! status: ${response.status}`);
//       const data = await response.json();
//       console.log("Twitter Auth Response:", data);
//       if (!data.url || typeof data.url !== "string") {
//         throw new Error("Invalid URL received from Twitter auth endpoint");
//       }
//       const { url, codeVerifier } = data;
//       sessionStorage.setItem("twitterCodeVerifier", codeVerifier);
//       window.location.href = url;
//     } catch (err) {
//       console.error("Twitter Login Initiation Error:", err);
//       showAlertMessage(
//         `Failed to initiate Twitter login: ${err.message}`,
//         "destructive"
//       );
//     }
//   };

//   const onSubmit = async (data) => {
//     console.log("Form Submit Data:", data);
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
//       console.error("Login Error:", err);
//       showAlertMessage(
//         err.message || "Login failed. Please try again.",
//         "destructive"
//       );
//     } finally {
//       setIsLoading(false);
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
//               <div className="flex flex-wrap sm:flex-nowrap justify-between gap-4 sm:gap-3 mt-4">
//                 <div className="flex-1 min-w-[100px] my-5">
//                   <GoogleLogin
//                     onSuccess={handleGoogleSuccess}
//                     onError={() =>
//                       showAlertMessage("Google Sign-In failed", "destructive")
//                     }
//                     useOneTap={false}
//                     theme="filled_blue"
//                     shape="rectangular"
//                     width={300}
//                     disabled={isLoading}
//                   />
//                 </div>
//                 <div className="flex-1 min-w-[100px] my-5">
//                   {isFacebookSDKLoaded ? (
//                     <FacebookLoginButton
//                       onClick={handleFacebookButtonClick}
//                       style={{
//                         width: "100%",
//                         background:
//                           "linear-gradient(to right, #1877F2, #3B5998)",
//                         color: "white",
//                         borderRadius: "0.375rem",
//                         padding: "0.5rem",
//                         fontSize: "0.875rem",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                       disabled={isLoading}
//                     />
//                   ) : (
//                     <button
//                       className="w-full py-2 text-sm font-medium text-white bg-gradient-to-r from-gray-400 to-gray-500 rounded-lg opacity-50 cursor-not-allowed"
//                       disabled>
//                       Loading Facebook Login...
//                     </button>
//                   )}
//                 </div>
//                 <div className="flex-1 min-w-[100px] my-5">
//                   <button
//                     onClick={handleTwitterLoginClick}
//                     className="w-full py-2 text-sm font-medium text-white bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light rounded-lg transition-colors focus:ring-2 focus:ring-primary-light"
//                     aria-label="Sign in with Twitter"
//                     disabled={isLoading}>
//                     <Twitter className="w-4 h-4 mr-2" />
//                     Sign in with Twitter
//                   </button>
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
//             <OtpVerification
//               onSubmit={(otp) =>
//                 handleOtpSubmit(
//                   otp,
//                   dispatch,
//                   tempUserId,
//                   showAlertMessage,
//                   navigate,
//                   setIsLoading
//                 )
//               }
//             />
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

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { setCredentials } from "../../features/Auth/authSlice";
import {
  loginUser,
  handleGoogleLogin,
  handleFacebookLogin,
  handleTwitterLogin,
  refreshToken,
  verifyAdminOTP,
} from "../../features/Auth/authActions";
import backendURL from "../../config";
import { resetSuccess, resetError } from "../../features/Auth/authSlice";
import { Eye, EyeOff, Mail, Lock, Twitter } from "lucide-react";
import UmorusPortrait from "../../assets/images/authImage.png";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { FacebookLoginButton } from "react-social-login-buttons";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import Cookies from "js-cookie";

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
    console.log("Verifying OTP for userId:", tempUserId);
    const result = await dispatch(
      verifyAdminOTP({ userId: tempUserId, otp })
    ).unwrap();
    dispatch(setCredentials(result));
    showAlertMessage("OTP verified successfully!", "success");
    setTimeout(() => navigate("/Admin/DashBoard"), 2000);
  } catch (err) {
    console.error("OTP Verification Error:", err);
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
  const [isFacebookSDKLoaded, setIsFacebookSDKLoaded] = useState(false);
  const callbackProcessed = useRef(false);

  const { userInfo, error, isOtpRequired, tempUserId } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const showAlertMessage = (message, variant = "default") => {
    console.log("Alert Message:", { message, variant });
    setAlertConfig({ message: String(message), variant });
    setShowAlert(true);
  };

  useEffect(() => {
    console.log("Checking Facebook SDK availability...");
    if (window.FB) {
      console.log("Facebook SDK already available, initializing...");
      window.FB.init({
        appId: import.meta.env.VITE_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: "v12.0",
      });
      setIsFacebookSDKLoaded(true);
    } else {
      console.log("Facebook SDK not available, setting up async init...");
      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.setAttribute("nonce", import.meta.env.VITE_CSP_NONCE);
      script.onload = () => {
        console.log("Facebook SDK script loaded");
        window.fbAsyncInit = function () {
          console.log("Facebook SDK async init triggered...");
          window.FB.init({
            appId: import.meta.env.VITE_FACEBOOK_APP_ID,
            cookie: true,
            xfbml: true,
            version: "v12.0",
          });
          setIsFacebookSDKLoaded(true);
          console.log("Facebook SDK initialized successfully");
        };
      };
      script.onerror = () =>
        console.error("Failed to load Facebook SDK script");
      document.body.appendChild(script);
    }
    return () => {
      const script = document.querySelector("#facebook-jssdk");
      if (script) document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    console.log("Auth State Updated:", { userInfo, error, isOtpRequired });
    if (error) showAlertMessage(error, "destructive");
    if (userInfo && (!isOtpRequired || userInfo.role !== "admin")) {
      showAlertMessage("Login successful!", "success");
      setTimeout(
        () => navigate(userInfo.role === "admin" ? "/Admin/DashBoard" : "/"),
        2000
      );
    }
  }, [userInfo, error, isOtpRequired, navigate]);

  // Updated callback handler to work with backend state storage
  // / Improved Twitter login initialization
  const handleTwitterLoginClick = async () => {
    console.log("Initiating Twitter Login...");
    try {
      // Clear any existing Twitter-related data
      sessionStorage.removeItem("twitterState");
      callbackProcessed.current = false;

      const redirectUri = import.meta.env.VITE_TWITTER_REDIRECT_URI;
      if (!redirectUri) {
        throw new Error("Twitter redirect URI not configured");
      }

      const response = await fetch(
        `${backendURL}/api/auth/twitter/auth?redirectUri=${encodeURIComponent(redirectUri)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      if (!data.url || !data.state) {
        throw new Error("Invalid response from server");
      }

      // Store state with error handling
      try {
        sessionStorage.setItem("twitterState", data.state);

        // Verify storage worked
        const verification = sessionStorage.getItem("twitterState");
        if (verification !== data.state) {
          throw new Error("Failed to store authentication state");
        }

        console.log("Twitter auth state stored successfully");
      } catch (storageError) {
        console.error("SessionStorage error:", storageError);
        throw new Error(
          "Browser storage unavailable - please enable cookies and local storage"
        );
      }

      // Redirect to Twitter
      console.log("Redirecting to Twitter...");
      window.location.href = data.url;
    } catch (err) {
      console.error("Twitter Login Initiation Error:", err);
      showAlertMessage(
        err.message || "Failed to initiate Twitter login",
        "destructive"
      );
    }
  };

  // Improved callback handler with better error handling
  useEffect(() => {
    const handleTwitterCallback = async () => {
      // Prevent duplicate processing
      if (callbackProcessed.current) {
        console.log("Twitter callback already processed");
        return;
      }

      const params = new URLSearchParams(location.search);
      const code = params.get("code");
      const receivedState = params.get("state");
      const error = params.get("error");
      const errorDescription = params.get("error_description");

      // Handle OAuth errors
      if (error) {
        console.error("Twitter OAuth error:", { error, errorDescription });
        showAlertMessage(
          errorDescription || `Twitter authorization failed: ${error}`,
          "destructive"
        );
        cleanupTwitterCallback();
        return;
      }

      // Only process Twitter callbacks
      if (!code || !receivedState) {
        return;
      }

      console.log("Processing Twitter callback...");
      callbackProcessed.current = true;

      try {
        // Get stored state
        const storedState = sessionStorage.getItem("twitterState");

        console.log("State verification:", {
          received: receivedState,
          stored: storedState,
          match: receivedState === storedState,
        });

        if (!storedState) {
          throw new Error(
            "Authentication session expired - please try logging in again"
          );
        }

        if (receivedState !== storedState) {
          throw new Error(
            "Invalid authentication state - possible security issue"
          );
        }

        setIsLoading(true);

        const redirectUri = import.meta.env.VITE_TWITTER_REDIRECT_URI;

        console.log("Sending login request to backend...");
        const result = await dispatch(
          handleTwitterLogin({
            code,
            state: receivedState,
            redirectUri,
          })
        ).unwrap();

        console.log("Twitter login successful");
        dispatch(setCredentials(result));
        showAlertMessage("Twitter login successful!", "success");

        // Navigate after a short delay
        setTimeout(() => navigate("/"), 1500);
      } catch (err) {
        console.error("Twitter Login Callback Error:", err);
        const errorMessage = err.message || "Twitter authentication failed";
        showAlertMessage(errorMessage, "destructive");
      } finally {
        setIsLoading(false);
        cleanupTwitterCallback();
      }
    };

    const cleanupTwitterCallback = () => {
      console.log("Cleaning up Twitter callback...");

      // Clear stored state
      sessionStorage.removeItem("twitterState");

      // Reset processing flag
      callbackProcessed.current = false;

      // Clean URL parameters if they exist
      if (
        location.search.includes("code=") ||
        location.search.includes("state=")
      ) {
        const newUrl = window.location.pathname;
        window.history.replaceState(null, "", newUrl);
      }
    };

    // Only run callback handler if we have search params
    if (location.search && !callbackProcessed.current) {
      handleTwitterCallback();
    }

    // Cleanup on unmount
    return () => {
      if (
        location.search.includes("code=") ||
        location.search.includes("state=")
      ) {
        cleanupTwitterCallback();
      }
    };
  }, [location.search, dispatch, navigate]);

  const handleGoogleSuccess = async (credentialResponse) => {
    console.log("Google Login Success:", credentialResponse);
    setIsLoading(true);
    try {
      const result = await dispatch(
        handleGoogleLogin(credentialResponse.credential)
      ).unwrap();
      dispatch(setCredentials(result));
      showAlertMessage("Google login successful!", "success");
    } catch (err) {
      console.error("Google Login Error:", err);
      showAlertMessage(err.message || "Google login failed", "destructive");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLoginClick = async (response) => {
    console.log("Facebook Login Response:", response);
    if (response.authResponse && response.authResponse.accessToken) {
      setIsLoading(true);
      try {
        console.log(
          "Dispatching handleFacebookLogin with accessToken:",
          response.authResponse.accessToken
        );
        const result = await dispatch(
          handleFacebookLogin(response.authResponse.accessToken)
        ).unwrap();
        console.log("handleFacebookLogin result:", result);
        dispatch(setCredentials(result));
        showAlertMessage("Facebook login successful!", "success");
      } catch (err) {
        console.error(
          "Facebook Login Error:",
          err.response?.data?.message || err.message
        );
        showAlertMessage(
          err.response?.data?.message || "Facebook login failed",
          "destructive"
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      console.warn("No valid access token, marking as cancelled:", response);
      showAlertMessage("Facebook login cancelled", "destructive");
    }
  };

  const handleFacebookButtonClick = () => {
    console.log("Facebook Button Clicked");
    if (isFacebookSDKLoaded && window.FB) {
      window.FB.login(
        (response) => {
          handleFacebookLoginClick(response).catch((err) =>
            console.error("Async Error in FB.login:", err)
          );
        },
        { scope: "public_profile,email" }
      );
    } else {
      console.error("Facebook SDK not loaded or initialized");
      showAlertMessage("Facebook SDK not loaded", "destructive");
    }
  };

  const onSubmit = async (data) => {
    console.log("Form Submit Data:", data);
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
      console.error("Login Error:", err);
      showAlertMessage(
        err.message || "Login failed. Please try again.",
        "destructive"
      );
    } finally {
      setIsLoading(false);
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
              <div className="space-y-4">
                {/* Google Login - Full Width for prominence */}
                <div className="w-full">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() =>
                      showAlertMessage("Google Sign-In failed", "destructive")
                    }
                    useOneTap={false}
                    theme="filled_blue"
                    shape="rectangular"
                    width="100%"
                    disabled={isLoading}
                  />
                </div>

                {/* Facebook and Twitter - Side by side on larger screens, stacked on mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Facebook Button */}
                  <div className="w-full">
                    {isFacebookSDKLoaded ? (
                      <FacebookLoginButton
                        onClick={handleFacebookButtonClick}
                        style={{
                          width: "100%",
                          background:
                            "linear-gradient(to right, #1877F2, #3B5998)",
                          color: "white",
                          borderRadius: "0.5rem",
                          padding: "0.75rem 1rem",
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "none",
                          cursor: isLoading ? "not-allowed" : "pointer",
                          opacity: isLoading ? "0.7" : "1",
                          transition: "all 0.2s ease-in-out",
                        }}
                        disabled={isLoading}
                      />
                    ) : (
                      <button
                        className="w-full py-3 px-4 text-sm font-medium text-white bg-gradient-to-r from-gray-400 to-gray-500 rounded-lg opacity-50 cursor-not-allowed flex items-center justify-center"
                        disabled>
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="currentColor"
                          viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        Loading...
                      </button>
                    )}
                  </div>

                  {/* Twitter Button */}
                  <div className="w-full">
                    <button
                      // onClick={handleTwitterLoginClick}
                      className="w-full py-3 px-4 text-sm font-medium text-white bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-gray-700 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center gap-2 shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                      aria-label="Sign in with Twitter"
                      disabled={isLoading}>
                      <Twitter className="w-4 h-4" />
                      <span className="hidden sm:inline">Twitter</span>
                      <span className="sm:hidden">Twitter</span>
                    </button>
                  </div>
                </div>
              </div>
              {/* Divider with improved styling */}
              <div className="relative flex items-center my-6">
                <div className="flex-grow border-t border-gray-300 dark:border-gray-600" />
                <span className="flex-shrink mx-4 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 rounded">
                  or sign in with email
                </span>
                <div className="flex-grow border-t border-gray-300 dark:border-gray-600" />
              </div>

              <div className="flex flex-wrap sm:flex-nowrap justify-between gap-4 sm:gap-3 mt-4"></div>
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
