import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Mail,
  ExternalLink,
  Share2,
  Star,
  Phone,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import businesses from "../../assets/json/businessData.json";
import BusinessCard from "../Cards/BusinessCard";

const RecommendedBusinesses = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [businessesPerPage] = useState(6);

  // Filter only businesses from the JSON data
  const filteredBusinesses = businesses.filter(
    (item) => item.type === "business"
  );

  // Pagination logic
  const indexOfLastBusiness = currentPage * businessesPerPage;
  const indexOfFirstBusiness = indexOfLastBusiness - businessesPerPage;
  const currentBusinesses = filteredBusinesses.slice(
    indexOfFirstBusiness,
    indexOfLastBusiness
  );

  const totalPages = Math.ceil(filteredBusinesses.length / businessesPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const handleShare = (business) => {
    if (navigator.share) {
      navigator
        .share({
          title: business.name,
          text: `Check out ${business.name} on our platform!`,
          url: `https://edirect.ng/business/${business.id}`,
        })
        .catch(console.error);
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard
        .writeText(`https://edirect.ng/business/${business.id}`)
        .then(() => alert("Business link copied to clipboard!"));
    }
  };

  // Function to generate pagination range with ellipses
  const generatePaginationRange = () => {
    const range = [];
    const maxVisiblePages = 5; // Number of visible page buttons
    const ellipsis = "...";

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than or equal to maxVisiblePages
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      // Add first page
      range.push(1);

      // Add ellipsis or pages before current page
      if (currentPage > 3) {
        range.push(ellipsis);
      }

      // Add pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        range.push(i);
      }

      // Add ellipsis or pages after current page
      if (currentPage < totalPages - 2) {
        range.push(ellipsis);
      }

      // Add last page
      range.push(totalPages);
    }

    return range;
  };

  return (
    <div className="max-w-7xl mx-auto px- sm:px- lg:px-8 py-12 flex">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Recommended Businesses
          </h2>
          <Link
            to="/business"
            className="text-red-600 hover:text-red-700 font-medium flex items-center">
            View All
            <ExternalLink size={16} className="ml-1.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {currentBusinesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>

        {/* Modern Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 space-x-2">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-full transition-colors ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}>
              <ChevronLeft size={18} />
            </button>

            {/* Page Numbers */}
            {generatePaginationRange().map((page, index) =>
              page === "..." ? (
                <span
                  key={index}
                  className="px-4 py-2 text-gray-600 cursor-default">
                  {page}
                </span>
              ) : (
                <button
                  key={index}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    currentPage === page
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}>
                  {page}
                </button>
              )
            )}

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-full transition-colors ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}>
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Side Advertisements */}
      <div className="w-1/4 ml-4 Nlg:hidden">
        <div className="mt-8">
          <img
            src="https://via.placeholder.com/300x200"
            alt="Advertisement 1"
            className="w-full"
          />
        </div>
        <div className="mt-8">
          <img
            src="https://via.placeholder.com/300x200"
            alt="Advertisement 2"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default RecommendedBusinesses;
