import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import backendURL from "../config";
import { Alert, AlertDescription } from "../components/tools/Alert";

const AccessRequestPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });

  const queryParams = new URLSearchParams(location.search);
  const requestId = queryParams.get("request_id");

  const showAlertMessage = (message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
  };

  const handleApprove = async () => {
    if (!requestId) {
      showAlertMessage("Invalid request ID", "destructive");
      return;
    }

    setAcceptLoading(true);
    try {
      const response = await axios.post(
        `${backendURL}/api/profile/approve-request/${requestId}`,
        {},
        { headers: { Authorization: `Bearer ${token.token}` } }
      );
      const data = response.data;
      if (data.status === "success") {
        showAlertMessage(
          data.message || "Profile access has been granted",
          "success"
        );
        setTimeout(() => navigate("/people"), 1000);
      } else {
        showAlertMessage(
          data.message || "Failed to approve request",
          "destructive"
        );
      }
    } catch (err) {
      showAlertMessage(
        err.response?.data?.message || "Error approving request",
        "destructive"
      );
    } finally {
      setAcceptLoading(false);
    }
  };

  const handleDeny = async () => {
    if (!requestId) {
      showAlertMessage("Invalid request ID", "destructive");
      return;
    }

    setRejectLoading(true);
    try {
      const response = await axios.post(
        `${backendURL}/api/profile/deny-request/${requestId}`,
        {},
        { headers: { Authorization: `Bearer ${token.token}` } }
      );
      const data = response.data;
      if (data.status === "success") {
        showAlertMessage(
          data.message || "Profile access has been denied",
          "success"
        );
        setTimeout(() => navigate("/people"), 1000); // Delay navigation to allow alert to be seen
      } else {
        showAlertMessage(
          data.message || "Failed to deny request",
          "destructive"
        );
      }
    } catch (err) {
      showAlertMessage(
        err.response?.data?.message || "Error denying request",
        "destructive"
      );
    } finally {
      setRejectLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full text-center transform transition-all duration-300 hover:shadow-3xl">
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Profile Access Request Decision
          </h1>
          <p className="text-gray-600 text-lg">
            Please review and decide on the access request for the profile. Your
            action will notify the requester accordingly.
          </p>
        </header>
        <div className="space-y-6">
          <p className="text-gray-700 text-base">
            Request ID:{" "}
            <span className="font-medium">{requestId || "N/A"}</span>
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button
              onClick={handleApprove}
              disabled={acceptLoading || rejectLoading}
              className="w-full sm:w-auto px-6 py-3 bg-green text-white font-semibold rounded-lg hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:bg-green-400 disabled:cursor-not-allowed transition-all duration-200 ease-in-out shadow-md hover:shadow-lg">
              {acceptLoading ? "Processing..." : "Accept"}
            </button>
            <button
              onClick={handleDeny}
              disabled={rejectLoading || acceptLoading}
              className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:bg-red-400 disabled:cursor-not-allowed transition-all duration-200 ease-in-out shadow-md hover:shadow-lg">
              {rejectLoading ? "Processing..." : "Reject"}
            </button>
          </div>
        </div>
        <button
          onClick={() => navigate("/people")}
          className="mt-8 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 ease-in-out">
          Back to People
        </button>
      </div>
      {/* Alert Component */}
      {showAlert && (
        <div className="fixed top-4 right-4 z-50">
          <Alert
            variant={alertConfig.variant}
            show={showAlert}
            onClose={() => setShowAlert(false)}
            autoClose={true}
            autoCloseTime={5000}>
            <AlertDescription>{alertConfig.message}</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
};

export default AccessRequestPage;
