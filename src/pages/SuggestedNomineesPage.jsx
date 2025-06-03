import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Info,
  Search,
  Filter,
  X,
} from "lucide-react";
import { Alert, AlertDescription } from "../components/tools/Alert";
import { useNavigate } from "react-router-dom";

const backendURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:3001";

const SuggestedNomineesPage = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [nominations, setNominations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    country: "",
    continent: "",
    status: "",
    searchTerm: "",
  });
  const [sortOrder, setSortOrder] = useState("desc");
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalNominations, setTotalNominations] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const limit = 9; // Items per page

  const showAlertMessage = useCallback((message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  }, []);

  const fetchNominations = useCallback(async () => {
    setIsLoading(true);
    try {
      const startIndex = (currentPage - 1) * limit;
      const response = await axios.get(`${backendURL}/api/getNominations`, {
        params: {
          ...filters,
          order: sortOrder,
          startIndex,
          limit,
        },
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setNominations(response.data.nominations);
      setTotalNominations(response.data.totalNominations);
    } catch (err) {
      showAlertMessage(
        err.response?.data?.message || "Failed to fetch nominations",
        "destructive"
      );
    } finally {
      setIsLoading(false);
    }
  }, [filters, sortOrder, userInfo, showAlertMessage, currentPage]);

  useEffect(() => {
    if (userInfo) {
      fetchNominations();
    } else {
      navigate("/login");
    }
  }, [fetchNominations, userInfo, navigate]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1); // Reset to first page when sort changes
  };

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, searchTerm: e.target.value }));
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      country: "",
      continent: "",
      status: "",
      searchTerm: "",
    });
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalNominations / limit);

  const filteredNominations = useMemo(() => {
    return nominations.map((nomination) => (
      <NomineeCard
        key={nomination._id}
        nomination={nomination}
        onClick={() => navigate(`/nomination/${nomination?.slug}`)}
      />
    ));
  }, [nominations, navigate]);
  console.log(nominations);
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

  return (
    <div className="max-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8 bg-accent-cream min-h-screen mt-16">
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
          Suggested Nominees
        </h1>
        <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
          View all nominations submitted by users. Click on a nominee to see
          more details.
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="searchTerm"
              value={filters.searchTerm}
              onChange={handleSearchChange}
              placeholder="Search nominees..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </button>
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary">
              Clear
            </button>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
                <option value="">All Categories</option>
                <option value="Best Business Entrepreneur">
                  Best Business Entrepreneur
                </option>
                <option value="Humanitarian">Humanitarian</option>
                <option value="Innovation">Innovation</option>
                <option value="Emergency Services">Emergency Services</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <select
                name="country"
                value={filters.country}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
                <option value="">All Countries</option>
                <option value="Nigeria">Nigeria</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
                {/* Add more countries as needed */}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Continent
              </label>
              <select
                name="continent"
                value={filters.continent}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
                <option value="">All Continents</option>
                <option value="Africa">Africa</option>
                <option value="Asia">Asia</option>
                <option value="Europe">Europe</option>
                <option value="North America">North America</option>
                <option value="South America">South America</option>
                <option value="Australia">Australia</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Sort and Results Info */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <div className="text-sm text-gray-600">
          Showing {(currentPage - 1) * limit + 1} to{" "}
          {Math.min(currentPage * limit, totalNominations)} of{" "}
          {totalNominations} nominations
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700">Sort by:</label>
          <select
            value={sortOrder}
            onChange={handleSortChange}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Nominations Grid */}
      {nominations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {filteredNominations}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900">
            No nominations found
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Try adjusting your search or filter criteria
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            Clear all filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Page <span className="font-medium">{currentPage}</span> of{" "}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                <ChevronLeft className="h-5 w-5" />
                Previous
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === pageNum
                        ? "z-10 bg-primary border-primary text-white"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}>
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                Next
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Notification */}
      {showAlert && (
        <div className="fixed bottom-4 right-4 z-50 max-w-xs w-full">
          <Alert
            variant={alertConfig.variant}
            onClose={() => setShowAlert(false)}>
            <AlertDescription className="text-sm">
              {alertConfig.message}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
};

// Sub-component for Nominee Card
const NomineeCard = ({ nomination, onClick }) => {
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

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer h-full flex flex-col"
      onClick={onClick}>
      <div className="relative h-48 overflow-hidden">
        <img
          src={nomination.image || "/default-profile.jpg"}
          alt={nomination.nomineeName}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.target.src = "/default-profile.jpg";
          }}
        />
        <span
          className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${statusBadgeColor(nomination.status)}`}>
          {nomination.status}
        </span>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-primary mb-1 truncate">
          {nomination.nomineeName}
        </h3>
        <p className="text-sm font-medium text-gray-600 mb-2">
          {nomination.category}
        </p>
        <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
          {nomination.nominationReason}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
          <span>
            {nomination.country}, {nomination.continent}
          </span>
          <span>{new Date(nomination.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default SuggestedNomineesPage;
