import React, { useState, useEffect } from "react";
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
  Search,
  Sliders,
} from "lucide-react";
import businesses from "../assets/json/businessData.json";
import BusinessCard from "../components/Cards/BusinessCard";
import businessImage from "../assets/images/E-business.png";

const AllBusinessesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [businessesPerPage] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Select States");
  const [selectedCategory, setSelectedCategory] = useState("Select Categories");
  const [sortBy, setSortBy] = useState("rating");
  const [sortOrder, setSortOrder] = useState("desc");
  const [viewMode, setViewMode] = useState("grid");

  // Get unique locations and categories
  const locations = [
    "Select States",
    ...new Set(businesses.map((b) => b.location).filter(Boolean)),
  ];
  const categories = [
    "Select Categories",
    ...new Set(
      businesses
        .flatMap((b) => b.category?.split(",").map((c) => c.trim()))
        .filter(Boolean)
    ),
  ];

  // Filter and sort businesses
  const filteredBusinesses = businesses
    .filter((business) => {
      const matchesSearch =
        business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.address?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLocation =
        selectedLocation === "Select States" ||
        business.location === selectedLocation;
      const matchesCategory =
        selectedCategory === "Select Categories" ||
        business.category?.includes(selectedCategory);

      return matchesSearch && matchesLocation && matchesCategory;
    })
    .sort((a, b) => {
      const multiplier = sortOrder === "asc" ? 1 : -1;
      switch (sortBy) {
        case "rating":
          return (a.rating - b.rating) * multiplier;
        case "name":
          return a.name.localeCompare(b.name) * multiplier;
        case "sinceDate":
          return (new Date(a.sinceDate) - new Date(b.sinceDate)) * multiplier;
        default:
          return 0;
      }
    });

  // Pagination
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Pagination range generator
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

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedLocation, selectedCategory, sortBy, sortOrder]);

  return (
    <>
      <div>
        {/* Hero Section */}
        <div className="relative h-[50vh] flex flex-col justify-center items-center text-center mb-8 p-6">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-80"
            style={{ backgroundImage: `url(${businessImage})` }}></div>

          {/* Overlay for better text visibility */}
          {/* <div className="absolute  opacity-60"></div> */}

          {/* Content */}
          <h1 className="relative text-4xl sm:text-5xl font-bold mb-4 text-white z-10">
            Find the Best Businesses Near You
          </h1>
          <p className="relative text-lg sm:text-xl mb-6 text-white z-10">
            Discover businesses by location, category, and essential services.
            Whether you're looking for a cozy café, a reliable plumber, or a
            trusted doctor, we've got you covered.
          </p>
          <div className="relative flex space-x-4 z-10">
            <button className="bg-white text-red-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              Explore Now
            </button>
            <button className="bg-transparent border-2 border-white text-white px-6 py-2 rounded-full font-semibold hover:bg-white hover:text-red-600 transition-colors">
              Find People
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex">
        {/* Main Content */}
        <div className="flex-1">
          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search businesses..."
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-4 top-3.5 text-gray-400" />
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <select
                className="bg-white border rounded-lg px-4 py-2"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>

              <select
                className="bg-white border rounded-lg px-4 py-2"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <div className="flex items-center space-x-2 ml-auto">
                <label className="text-sm text-gray-600">Sort by:</label>
                <select
                  className="bg-white border rounded-lg px-3 py-2"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}>
                  <option value="rating">Rating</option>
                  <option value="name">Name</option>
                  <option value="sinceDate">Date Added</option>
                </select>
                <button
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className="p-2 hover:bg-gray-100 rounded-lg">
                  {sortOrder === "asc" ? "↑" : "↓"}
                </button>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg ${
                    viewMode === "grid" ? "bg-gray-100" : "hover:bg-gray-50"
                  }`}>
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeWidth="2"
                      d="M4 6h6M4 12h6M4 18h6m10-12h-6m6 6h-6m6 6h-6"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg ${
                    viewMode === "list" ? "bg-gray-100" : "hover:bg-gray-50"
                  } hidden sm:block`}>
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              Showing {filteredBusinesses.length} results
            </div>
          </div>

          {/* Business Listings */}
          <div
            className={`gap-6 ${
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "space-y-6"
            }`}>
            {currentBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>

          {/* Modern Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 space-x-2">
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

        {/* Right Sidebar - Advertisements */}
        <div className="hidden lg:block w-[16rem] ml-8 space-y-6">
          <div className="bg-gray-100 rounded-xl p-4 h-96">
            <span className="text-sm text-gray-500">Advertisement</span>
            <div className="mt-4 h-full flex items-center justify-center">
              <span className="text-gray-400">Ad Space 300x600</span>
            </div>
          </div>
          <div className="bg-gray-100 rounded-xl p-4 h-96">
            <span className="text-sm text-gray-500">Advertisement</span>
            <div className="mt-4 h-full flex items-center justify-center">
              <span className="text-gray-400">Ad Space 300x600</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllBusinessesPage;
