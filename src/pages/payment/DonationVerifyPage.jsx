import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";

const backendURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:3001";

const DonationVerifyPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get("reference");
      if (!reference) {
        setError("No payment reference provided.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${backendURL}/api/payments/verify?reference=${reference}`
        );
        if (response.data.success) {
          navigate("/donation/success", {
            state: { donation: response.data.data },
          });
        } else {
          setError(response.data.message || "Payment verification failed.");
        }
      } catch (err) {
        setError("An error occurred during verification.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-accent-cream mt-12">
        <div className="text-center">
          <Loader2 className="w-10 sm:w-12 h-10 sm:h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-base sm:text-lg text-primary">
            Verifying your payment...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-accent-cream mt-12">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg max-w-md text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-unity-coral mb-4">
            Verification Failed
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mb-6">{error}</p>
          <button
            onClick={() => navigate("/fund")}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-sunlit-gold text-primary rounded-lg hover:bg-secondary font-medium">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return null; // Handled by redirect
};

export default DonationVerifyPage;
