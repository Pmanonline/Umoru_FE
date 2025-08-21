import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { VscLoading } from "react-icons/vsc";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import { useParams, useLocation } from "react-router-dom"; // Updated to use both useParams and useLocation
import UmorusPortrait from "../../assets/images/authImage.png";
import backendURL from "../../config";
import { Link } from "react-router-dom";

// Validation Schema
const resetPasswordSchema = yup.object().shape({
  token: yup.string().required("Reset token is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must include uppercase, lowercase, number, and special character"
    ),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const PasswordReset = () => {
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    type: "",
    message: "",
    variant: "default",
  });
  const { token } = useParams(); // Extract token from URL path
  const location = useLocation(); // Extract email from query string

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
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      token: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  useEffect(() => {
    // Extract token from URL params and email from query parameters
    const searchParams = new URLSearchParams(location.search);
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (token) setValue("token", token);
    if (email) setValue("email", email);
    console.log("token:", token, "Email:", email); // Debug log
  }, [token, location, setValue]);

  const onSubmit = async (data) => {
    console.log("Form submitted with data:", data); // Debug log
    setLoading(true);
    try {
      const response = await fetch(
        `${backendURL}/api/reset-password/${data.token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: data.password, email: data.email }), // Send only password and email
        }
      );

      const result = await response.json();

      if (response.ok) {
        handleAlertShow({
          type: "success",
          message: result.message || "Password reset successfully",
          variant: "success",
        });
        reset();
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      } else {
        handleAlertShow({
          type: "error",
          message: result.message || "Failed to reset password",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error:", err);
      handleAlertShow({
        type: "error",
        message: "Network error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center blur-sm opacity-50"
        style={{ backgroundImage: `url(${UmorusPortrait})` }}
      />
      <div className="relative z-10 w-full max-w-lg p-6 sm:p-8 bg-white/95 dark:bg-gray-800/95 rounded-xl shadow-lg backdrop-blur-md space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Reset Password
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Create a new password for your account
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <input
            type="hidden"
            {...register("token")}
            placeholder="Reset Token"
          />
          <input type="hidden" {...register("email")} placeholder="Email" />
          <div className="space-y-5">
            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                New Password
              </label>
              <input
                {...register("password")}
                type="password"
                placeholder="Enter new password"
                className={`w-full px-3 py-2 border ${errors.password ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-darkMode focus:border-primary dark:focus:border-primary-darkMode transition-all placeholder-gray-500 dark:placeholder-gray-400`}
              />
              {errors.password && (
                <p className="text-sm text-red-600 dark:text-red-400 pl-2">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <label
                htmlFor="password_confirmation"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm Password
              </label>
              <input
                {...register("password_confirmation")}
                type="password"
                placeholder="Confirm new password"
                className={`w-full px-3 py-2 border ${errors.password_confirmation ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-darkMode focus:border-primary dark:focus:border-primary-darkMode transition-all placeholder-gray-500 dark:placeholder-gray-400`}
              />
              {errors.password_confirmation && (
                <p className="text-sm text-red-600 dark:text-red-400 pl-2">
                  {errors.password_confirmation.message}
                </p>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-light dark:bg-primary-darkMode dark:hover:bg-primary-light transition-colors duration-200 disabled:opacity-60 flex items-center justify-center">
            {loading ? (
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-gray-600 dark:text-gray-400">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-primary dark:text-primary-darkMode hover:text-primary-light dark:hover:text-primary-light">
              Back to Login
            </Link>
          </p>
        </div>
        {showAlert && (
          <Alert
            variant={submitStatus.variant}
            show={showAlert}
            onClose={handleAlertClose}
            autoClose={true}
            autoCloseTime={5000}
            className="w-full max-w-md">
            <AlertDescription>{submitStatus.message}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default PasswordReset;
