import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, User, Lock } from "lucide-react";
import PrideImage1 from "../../assets/images/PrideImage1.jpg";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import Cookies from "js-cookie";
import backendURL from "../../config";
import edirectURL from "../../config3";
import { Alert, AlertDescription } from "../../components/tools/Alert";

// Define validation schema using yup
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
  const [showDirectoryModal, setShowDirectoryModal] = useState(false);

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

      try {
        const secondResponse = await fetch(`${edirectURL}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.username,
            email: data.email.toLowerCase(),
            password: data.password,
            password_confirmation: data.confirmPassword,
            role: "user",
          }),
        });

        if (secondResponse.ok) {
          setShowDirectoryModal(true);
        }
      } catch (error) {
        console.error("Directory registration failed:", error);
      }

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12 mt-8">
      <div className="w-full max-w-md space-y-8 bg-white p-6 sm:p-8 rounded-2xl shadow-xl transform transition-all duration-300">
        <div className="text-center space-y-2">
          <img
            src={PrideImage1}
            alt="Autograph Logo"
            className="mx-auto h-32 w-auto object-contain"
          />
          <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-600">Register to get started</p>
        </div>

        <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
          <div className="space-y-5">
            <InputField
              id="username"
              type="text"
              placeholder="Username"
              icon={<User className="h-5 w-5 text-gray-500" />}
              register={register("username")}
              error={errors.username}
              disabled={isLoading}
            />
            <InputField
              id="email"
              type="email"
              placeholder="Email address"
              icon={<Mail className="h-5 w-5 text-gray-500" />}
              register={register("email")}
              error={errors.email}
              disabled={isLoading}
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
                  className="focus:outline-none"
                  disabled={isLoading}>
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
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
              icon={<Lock className="h-5 w-5 text-gray-500" />}
              toggleIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="focus:outline-none"
                  disabled={isLoading}>
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
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
                  : "text-green-600 hover:text-green-700 transition-colors"
              }`}>
              Already have an account?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg font-medium hover:from-green-700 hover:to-green-600 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center">
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
            <AlertDescription>{alertConfig.message}</AlertDescription>
          </Alert>
        )}

        {showDirectoryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4">
              <h3 className="text-xl font-bold text-gray-900">
                Directory Registration
              </h3>
              <p className="text-gray-600">
                You've also been registered on our Directory platform. Please
                check your email to verify your Directory account.
              </p>
              <button
                onClick={() => setShowDirectoryModal(false)}
                className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg font-medium hover:from-green-700 hover:to-green-600 transition-all duration-200">
                Close
              </button>
            </div>
          </div>
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
        className={`w-full px-3 py-3 pl-10 pr-10 border ${
          error ? "border-red-300" : "border-gray-300"
        } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed`}
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

export default RegisterUser;
