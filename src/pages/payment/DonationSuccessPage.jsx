import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const DonationSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const donation = location.state?.donation || {};

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent-cream mt-12">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg max-w-md text-center">
        <CheckCircle className="w-12 sm:w-16 h-12 sm:h-16 text-primary mx-auto mb-4" />
        <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">
          Thank You for Your Donation!
        </h2>
        <p className="text-gray-600 text-sm sm:text-base mb-6">
          Your generous contribution of ₦
          {donation.amount?.toLocaleString() || "N/A"} to{" "}
          {donation.program || "our programs"} will make a real impact.
        </p>
        <div className="text-left mb-6 space-y-2 text-sm sm:text-base">
          <p>
            <strong className="text-primary">Name:</strong>{" "}
            {donation.name || "N/A"}
          </p>
          <p>
            <strong className="text-primary">Program:</strong>{" "}
            {donation.program || "N/A"}
          </p>
          <p>
            <strong className="text-primary">Date:</strong>{" "}
            {donation.paymentDate || "N/A"}
          </p>
        </div>
        <button
          onClick={() => navigate("/fund")}
          className="px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white font-semibold rounded-lg hover:bg-secondary font-medium">
          Back to Fund Page
        </button>
      </div>
    </div>
  );
};

export default DonationSuccessPage;
