import React, { useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../features/Auth/authSlice";
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
    checkTokenValidity();
    const interval = setInterval(checkTokenValidity, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [checkTokenValidity]);

  const handleLogin = () => {
    setIsModalOpen(false);
    navigate("/login");
  };

  if (!isModalOpen || tokenValid) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-labelledby="token-expiration-modal-title"
      aria-describedby="token-expiration-modal-description"
      aria-modal="true">
      <div
        className="relative w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}>
        <div className="bg-accent-cream dark:bg-accent-creamDark rounded-xl overflow-hidden border border-accent-charcoal/20 dark:border-gray-800/20 shadow-2xl">
          <div className="bg-primary-dark dark:bg-primary-darkMode px-4 sm:px-6 py-4 flex items-center gap-3">
            <AlertCircle className="text-accent-teal" size={24} />
            <h3
              id="token-expiration-modal-title"
              className="text-xl sm:text-2xl font-bold text-white">
              Session Expired
            </h3>
          </div>
          <div className="p-4 sm:p-6">
            <p
              id="token-expiration-modal-description"
              className="text-sm sm:text-base text-primary-dark dark:text-white mb-6">
              For your security, your session has timed out. Please sign in
              again for a better user access!!
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-5 py-2 sm:py-3 text-sm sm:text-base font-medium text-primary-dark dark:text-white rounded-lg border border-accent-charcoal/20 dark:border-gray-800/20 hover:bg-primary-light/10 dark:hover:bg-primary-darkMode/10 transition-colors focus:ring-2 focus:ring-primary-light"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close session expired modal">
                Close
              </button>
              <button
                className="px-5 py-2 sm:py-3 text-sm sm:text-base font-medium text-white bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light rounded-lg transition-colors flex items-center gap-2 focus:ring-2 focus:ring-primary-light"
                onClick={handleLogin}
                aria-label="Login again">
                <LogIn size={18} />
                Login Again
              </button>
            </div>
          </div>
          <div className="bg-accent-cream/90 dark:bg-accent-creamDark/90 px-4 sm:px-6 py-3 text-center text-xs sm:text-sm text-accent-charcoal dark:text-white/80">
            Pride of Nigeria • Secured Access
          </div>
        </div>
      </div>
    </div>
  );
};

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
