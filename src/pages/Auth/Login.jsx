import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser, setCredentials } from "../../features/Auth/authSlice";
import { verifyAdminOTP, loginUser } from "../../features/Auth/authActions";
import { resetSuccess, resetError } from "../../features/Auth/authSlice";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import PrideImage1 from "../../assets/images/PrideImage1.jpg";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { handleGoogleLogin } from "../../features/Auth/authActions";
import { Alert, AlertDescription } from "../../components/tools/Alert";

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
    setAlertConfig({ message, variant });
    setShowAlert(true);
  };

  useEffect(() => {
    if (error) {
      showAlertMessage(error, "destructive");
      dispatch(resetError());
    }
    if (userInfo && (!isOtpRequired || userInfo.role !== "admin")) {
      showAlertMessage("Login successful!", "success");
      const timer = setTimeout(() => {
        navigate(userInfo.role === "admin" ? "/Admin/DashBoard" : "/");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [userInfo, error, isOtpRequired, navigate, dispatch]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await dispatch(loginUser(data)).unwrap();
      if (result.requireOTP) {
        showAlertMessage("OTP sent to your email. Please verify!", "success");
      } else {
        reset();
      }
    } catch (err) {
      showAlertMessage(
        error.message || "Login failed. Please try again.",
        "destructive"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (otp) => {
    if (!tempUserId) {
      showAlertMessage(
        "User ID not found. Please try logging in again.",
        "error"
      );
      return;
    }
    try {
      await dispatch(verifyAdminOTP({ userId: tempUserId, otp })).unwrap();
      showAlertMessage("OTP verified successfully!", "success");
      dispatch(resetSuccess());
    } catch (err) {
      showAlertMessage(err.message || "OTP verification failed", "destructive");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await handleGoogleLogin(credentialResponse.credential);
      if (response.error) {
        throw new Error(response.message || "Google login failed");
      }
      dispatch(setCredentials(response));
      showAlertMessage("Google login successful!", "success");
    } catch (err) {
      showAlertMessage(err.message || "Google login failed", "destructive");
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12">
        <div className="w-full max-w-md space-y-8 bg-white p-6 sm:p-8 rounded-2xl shadow-xl transform transition-all duration-300">
          <div className="text-center space-y-2">
            <img
              src={PrideImage1}
              alt="Autograph Logo"
              className="mx-auto h-32 w-auto object-contain"
            />
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {!isOtpRequired ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-5">
                <InputField
                  id="email"
                  type="email"
                  placeholder="Email address"
                  icon={<Mail className="h-5 w-5 text-gray-500" />}
                  register={register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  error={errors.email}
                />
                <InputField
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  icon={<Lock className="h-5 w-5 text-gray-500" />}
                  toggleIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="focus:outline-none">
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  }
                  register={register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  error={errors.password}
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-between text-sm gap-2">
                <Link
                  to="/register"
                  className="text-green-600 hover:text-green-700 transition-colors">
                  Create an account
                </Link>
                <Link
                  to="/ForgotPassword"
                  className="text-green-600 hover:text-green-700 transition-colors">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg font-medium hover:from-green-700 hover:to-green-600 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Sign In"
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() =>
                    showAlertMessage("Google Sign-In failed", "error")
                  }
                  useOneTap
                  theme="outline"
                  shape="rectangular"
                  width="300"
                />
              </div>
            </form>
          ) : (
            <OtpVerification onSubmit={handleOtpSubmit} />
          )}

          {/* Alert Component */}
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
        className={`w-full px-3 py-3 pl-10 pr-10 border ${
          error ? "border-red-300" : "border-gray-300"
        } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 placeholder-gray-400`}
      />
      {toggleIcon && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {toggleIcon}
        </div>
      )}
    </div>
    {error && <p className="text-sm text-red-600 pl-2">{error.message}</p>}
  </div>
);

const OtpVerification = ({ onSubmit }) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }
    onSubmit(otp);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Enter OTP sent to your email
        </label>
        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 placeholder-gray-400"
          placeholder="Enter 6-digit OTP"
        />
        {error && <p className="text-sm text-red-600 pl-2">{error}</p>}
      </div>
      <button
        type="submit"
        className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg font-medium hover:from-green-700 hover:to-green-600 transition-all duration-200">
        Verify OTP
      </button>
    </form>
  );
};

export default Login;
