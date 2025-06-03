import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Loader2, ChevronLeft, Info } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import countriesByContinent from "../assets/json/continentAndCountries.json";

const backendURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:3001";

const NominationDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [nomination, setNomination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNomination = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${backendURL}/api/getNominationBySlug/${slug}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        setNomination(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch nomination");
      } finally {
        setIsLoading(false);
      }
    };

    if (userInfo) {
      fetchNomination();
    } else {
      navigate("/login");
    }
  }, [slug, userInfo, navigate]);

  const statusBadgeColor = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
          Go Back
        </button>
      </div>
    );
  }

  if (!nomination) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Nomination Not Found
        </h2>
        <p className="text-gray-600 mb-4">
          The requested nomination could not be found.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8 bg-accent-cream min-h-screen mt-16">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-primary hover:text-primary-dark mb-6">
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back to Nominations
      </button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header Section */}
        <div className="p-6 border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-primary">
                {nomination.nomineeName}
              </h1>
              <p className="text-lg text-gray-600">{nomination.category}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadgeColor(nomination.status)}`}>
              {nomination.status}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-500">
            <span>
              Nominated by: {nomination.nominator?.name || "Anonymous"}
            </span>
            <span>•</span>
            <span>
              {nomination.country}, {nomination.continent}
            </span>
            <span>•</span>
            <span>
              Nominated on:{" "}
              {new Date(nomination.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Image Column */}
          <div className="lg:col-span-1">
            <div className="rounded-lg overflow-hidden bg-gray-100 aspect-square">
              <img
                src={nomination.image || "/default-profile.jpg"}
                alt={nomination.nomineeName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/default-profile.jpg";
                }}
              />
            </div>
          </div>

          {/* Details Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Nomination Reason */}
            <div>
              <h3 className="text-lg font-semibold text-primary mb-2">
                Nomination Reason
              </h3>
              <p className="text-gray-700">{nomination.nominationReason}</p>
            </div>

            {/* Why Deserves Award */}
            <div>
              <h3 className="text-lg font-semibold text-primary mb-2">
                Why They Deserve This Award
              </h3>
              <p className="text-gray-700 whitespace-pre-line">
                {nomination.whyDeserves}
              </p>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Category</h3>
                <p className="text-gray-900">{nomination.category}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Location</h3>
                <p className="text-gray-900">
                  {nomination.country}, {nomination.continent}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Nomination Date
                </h3>
                <p className="text-gray-900">
                  {new Date(nomination.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <p
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusBadgeColor(nomination.status)}`}>
                  {nomination.status}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Actions (if applicable) */}
      {userInfo?.isAdmin && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">
            Admin Actions
          </h3>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Approve Nomination
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
              Reject Nomination
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
              Request More Info
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NominationDetailPage;
