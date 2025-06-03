import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import LoaddingSpinner from "../../components/tools/LoaddingSpinner";
import PrideImage1 from "../../assets/images/PrideImage1.jpg";
import backendURL from "../../config";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const PasswordReset = () => {
  const { token } = useParams(); // Get the reset token from the URL
  const navigate = useNavigate(); // initialize useNavigate hook
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${backendURL}/api/reset-password/${token}`,
        {
          password,
        }
      );
      setMessage(response.data.message);
      setSnackbarSeverity("success");
      setPassword("");
      setOpenSnackbar(true);

      // Navigate to /login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred");
      setSnackbarSeverity("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="text-center">
            <img src={PrideImage1} alt="Autograph Logo" />

            <p className="mt-2  font-bold text-lg text-gray-600">
              Reset Password
            </p>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Enter your new password below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your new password"
                required
                className="appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-btColour focus:border-btColour sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-[#1e293b] to-btColour hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-btColour transition-all duration-200 ease-in-out">
              {loading ? <LoaddingSpinner /> : "Set New Password"}
            </button>
          </div>
        </form>
      </div>

      {/* Snackbar for notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}>
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default PasswordReset;
