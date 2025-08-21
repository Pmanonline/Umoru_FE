// UMORUS-POR.../client/src/components/RegisterUser.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, User, Lock } from "lucide-react";
import UmorusPortrait from "../../assets/images/authImage.png";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import Cookies from "js-cookie";
import backendURL from "../../config";
import { Alert, AlertDescription } from "../../components/tools/Alert";

// Validation schema
const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
});

const RegisterUser = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const showAlertMessage = (message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  const submitForm = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${backendURL}/api/register`,
        {
          email: data.email.toLowerCase(),
          password: data.password,
          username: data.username,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: false,
        }
      );

      if (typeof window !== "undefined") {
        Cookies.set("userToken", response.data.token, {
          expires: 7,
          sameSite: "strict",
          secure: true,
        });
        Cookies.set("userInfo", JSON.stringify(response.data.user), {
          expires: 7,
          sameSite: "strict",
          secure: true,
        });
      }

      showAlertMessage(
        "Registered successfully! Redirecting to login...",
        "success"
      );

      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      showAlertMessage(
        error.response?.data?.message || error.message || "Registration failed",
        "destructive"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 mt-9">
      {/* Faded and Blurred Full Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center blur-sm opacity-50"
        style={{ backgroundImage: `url(${UmorusPortrait})` }}
      />

      <div className="relative z-10 w-full max-w-lg p-6 sm:p-8 bg-white/95 dark:bg-gray-800/95 rounded-xl shadow-lg backdrop-blur-md space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create Account
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Register to get started
          </p>
        </div>

        <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
          <div className="space-y-5">
            <InputField
              id="username"
              type="text"
              placeholder="Username"
              icon={
                <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              }
              register={register("username")}
              error={errors.username}
              disabled={isLoading}
            />
            <InputField
              id="email"
              type="email"
              placeholder="Email address"
              icon={
                <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              }
              register={register("email")}
              error={errors.email}
              disabled={isLoading}
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
                  onClick={() => setShowPassword(!showPassword)}
                  className="focus:outline-none"
                  disabled={isLoading}>
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  )}
                </button>
              }
              register={register("password")}
              error={errors.password}
              disabled={isLoading}
            />
            <InputField
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              icon={
                <Lock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              }
              toggleIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="focus:outline-none"
                  disabled={isLoading}>
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  )}
                </button>
              }
              register={register("confirmPassword")}
              error={errors.confirmPassword}
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end text-sm">
            <Link
              to="/login"
              className={`${
                isLoading
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-primary dark:text-primary-darkMode hover:text-primary-light dark:hover:text-primary-light"
              }`}>
              Already have an account?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-light dark:bg-primary-darkMode dark:hover:bg-primary-light transition-colors duration-200 disabled:opacity-60 flex items-center justify-center">
            {isLoading ? (
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        {showAlert && (
          <Alert
            variant={alertConfig.variant}
            show={showAlert}
            onClose={() => setShowAlert(false)}
            autoClose={true}
            autoCloseTime={5000}
            className="w-full max-w-md">
            <AlertDescription>{alertConfig.message}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
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
  disabled,
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
        disabled={disabled}
        className={`w-full px-3 py-2 pl-10 pr-10 border ${error ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-darkMode focus:border-primary dark:focus:border-primary-darkMode transition-all placeholder-gray-500 dark:placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed`}
      />
      {toggleIcon && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {toggleIcon}
        </div>
      )}
    </div>
    {error && (
      <p className="text-sm text-red-600 dark:text-red-400 pl-2">
        {error.message}
      </p>
    )}
  </div>
);

export default RegisterUser;
