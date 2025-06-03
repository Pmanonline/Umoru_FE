import React, { useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";
import { AlertCircle, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const TokenExpirationModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const token = userInfo?.token;

  const checkTokenValidity = useCallback(() => {
    if (!token) {
      setTokenValid(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const expiresAt = decoded.exp * 1000;
      const now = Date.now();

      if (now >= expiresAt) {
        setTokenValid(false);
        setIsModalOpen(true);
        dispatch(logoutUser());
      } else {
        setTokenValid(true);
      }
    } catch (error) {
      setTokenValid(false);
      setIsModalOpen(true);
      dispatch(logoutUser());
    }
  }, [token, dispatch]);

  useEffect(() => {
    // Initial check
    checkTokenValidity();

    // Set up interval for periodic checks
    const interval = setInterval(checkTokenValidity, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [checkTokenValidity]);

  const handleLogin = () => {
    setIsModalOpen(false);
    navigate("/login");
  };

  if (!isModalOpen || tokenValid) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div
        className="relative w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}>
        {/* Pride of Nigeria themed modal */}
        <div className="bg-white rounded-xl overflow-hidden border border-green-100 shadow-2xl">
          {/* Header with Pride of Nigeria green */}
          <div className="bg-green-700 px-6 py-4 flex items-center gap-3">
            <AlertCircle className="text-white" size={24} />
            <h3 className="text-xl font-bold text-white">Session Expired</h3>
          </div>

          {/* Body */}
          <div className="p-6">
            <p className="text-gray-700 mb-6">
              Your session has expired. Please log in again to continue
              accessing Pride of Nigeria.
            </p>

            {/* Action buttons */}
            <div className="flex justify-end gap-3">
              <button
                className="px-5 py-2 text-sm font-medium text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                onClick={() => setIsModalOpen(false)}>
                Close
              </button>
              <button
                className="px-5 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                onClick={handleLogin}>
                <LogIn size={18} />
                Login Again
              </button>
            </div>
          </div>

          {/* Footer with subtle Pride of Nigeria branding */}
          <div className="bg-green-50 px-6 py-3 text-center text-xs text-green-800">
            Pride of Nigeria • Secured Access
          </div>
        </div>
      </div>
    </div>
  );
};

// Simplified and optimized custom hook
export const useCheckTokenExpiration = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const token = userInfo?.token;

  const checkToken = useCallback(() => {
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const expiresAt = decoded.exp * 1000;
      if (Date.now() >= expiresAt) {
        dispatch(logoutUser());
      }
    } catch (error) {
      console.error("Token validation failed:", error);
      dispatch(logoutUser());
    }
  }, [token, dispatch]);

  useEffect(() => {
    checkToken();
    const intervalId = setInterval(checkToken, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [checkToken]);
};
