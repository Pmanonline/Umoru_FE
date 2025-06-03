import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";

const DonationErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent-cream mt-12">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg max-w-md text-center">
        <AlertCircle className="w-12 sm:w-16 h-12 sm:h-16 text-unity-coral mx-auto mb-4" />
        <h2 className="text-xl sm:text-2xl font-bold text-unity-coral mb-4">
          Donation Failed
        </h2>
        <p className="text-gray-600 text-sm sm:text-base mb-6">
          Something went wrong with your donation. Please try again or contact
          support.
        </p>
        <button
          onClick={() => navigate("/fund")}
          className="px-4 sm:px-6 py-2 sm:py-3 bg-sunlit-gold text-primary rounded-lg hover:bg-secondary font-medium">
          Try Again
        </button>
      </div>
    </div>
  );
};

export default DonationErrorPage;
