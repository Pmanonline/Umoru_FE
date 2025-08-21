// UMORUS-POR.../client/src/components/ForgotPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import { Mail } from "lucide-react";
import UmorusPortrait from "../../assets/images/authImage.png";
import backendURL from "../../config";
import { Alert, AlertDescription } from "../../components/tools/Alert";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });

  const showAlertMessage = (message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${backendURL}/api/forgot-password`, {
        email,
      });
      showAlertMessage(
        response.data.message || "Reset link sent to your email!",
        "success"
      );
      setEmail("");
    } catch (error) {
      showAlertMessage(
        error.response?.data?.message ||
          "An error occurred while sending reset link",
        "destructive"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      {/* Faded and Blurred Full Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center blur-sm opacity-50"
        style={{ backgroundImage: `url(${UmorusPortrait})` }}
      />

      <div className="relative z-10 w-full max-w-lg p-6 sm:p-8 bg-white/95 dark:bg-gray-800/95 rounded-xl shadow-lg backdrop-blur-md space-y-6">
        <div className="text-center space-y-2">
          <img
            src={UmorusPortrait} // Replace with your logo if different from background
            alt="Umorus Logo"
            className="mx-auto h-32 w-auto object-contain"
          />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Forgot Password?
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Enter your email to reset your password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                  className={`w-full px-3 py-2 pl-10 border ${
                    isLoading
                      ? "border-gray-300 bg-gray-100"
                      : "border-gray-300 dark:border-gray-600"
                  } rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-darkMode focus:border-primary dark:focus:border-primary-darkMode transition-all placeholder-gray-500 dark:placeholder-gray-400 disabled:cursor-not-allowed`}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-light dark:bg-primary-darkMode dark:hover:bg-primary-light transition-colors duration-200 disabled:opacity-60 flex items-center justify-center">
            {isLoading ? (
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              "Reset Password"
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

export default ForgotPassword;
