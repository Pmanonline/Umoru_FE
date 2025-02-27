import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaGoogle } from "react-icons/fa";
import { VscLoading } from "react-icons/vsc";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/Auth/authSlice";
import { useNavigate } from "react-router-dom";

// Validation Schema
const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, userInfo } = useSelector((state) => state.auth);

  const [showAlert, setShowAlert] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    type: "",
    message: "",
    variant: "default",
  });

  const handleAlertShow = (status) => {
    setSubmitStatus(status);
    setShowAlert(true);
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  // Redirect to home if user is already logged in
  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [userInfo, navigate]);

  const onSubmit = async (data) => {
    try {
      const result = await dispatch(loginUser(data)).unwrap();

      handleAlertShow({
        type: "success",
        message: "Login successful!",
        variant: "success",
      });
      reset();
      navigate("/");
    } catch (err) {
      handleAlertShow({
        type: "error",
        message: err || "Login failed",
        variant: "destructive",
      });
    }
  };

  const handleGoogleLogin = (e) => {
    e.preventDefault();
    window.location = "http://backend.edirect.ng/api/auth/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 shadow-lg rounded-xl overflow-hidden">
        {/* Image Section */}
        <div
          className="hidden md:block bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1581291518857-4e27b48ff24e)",
            backgroundSize: "cover",
          }}
        />

        {/* Form Section */}
        <div className="bg-white p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
            Welcome Back
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Log in to your account
          </p>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full mb-4 py-2 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition">
            <FaGoogle className="mr-2 text-red-500" />
            Log in with Google
          </button>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                {...register("email")}
                type="email"
                placeholder="Enter your email"
                className={`w-full p-2 border rounded ${errors.email ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                {...register("password")}
                type="password"
                placeholder="Enter your password"
                className={`w-full p-2 border rounded ${errors.password ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-hoverBtn text-white py-2 rounded hover:bg-btColour transition flex items-center justify-center">
              {loading ? <VscLoading className="animate-spin" /> : "Log In"}
            </button>
          </form>

          <div className="text-start mt-4">
            <p className="text-gray-600">
              <a
                href="/forgotPassword"
                className="text-blue-500 hover:underline">
                Forgot password?
              </a>
            </p>
          </div>

          <div className="text-center mt-4">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <a href="/signup" className="text-blue-500 hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
      {/* Alert info */}
      {showAlert && (
        <>
          <Alert
            variant={submitStatus.variant}
            show={showAlert}
            onClose={handleAlertClose}
            autoClose={true}
            autoCloseTime={5000}>
            <AlertDescription>{submitStatus.message}</AlertDescription>
          </Alert>
        </>
      )}
    </div>
  );
};

export default Login;
