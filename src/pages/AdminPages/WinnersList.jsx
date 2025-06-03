import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Loader2, Trash2, Edit, Plus, Search, ChevronDown } from "lucide-react";
import moment from "moment";
import { Alert, AlertDescription } from "../../components/tools/Alert";

const backendURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:3001";

// Debounce utility function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const WinnerTableRow = React.memo(({ winner, onDeleteClick }) => {
  return (
    <tr className="border-b hover:bg-gray-50 transition-colors">
      <td className="py-4 px-6 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {moment(winner.updatedAt).format("MMM D, YYYY")}
        </div>
      </td>
      <td className="py-4 px-6 whitespace-nowrap">
        <Link to={`/winners/${winner.slug}`} className="flex items-center">
          {winner.image ? (
            <img
              src={winner.image}
              alt={winner.name}
              className="w-10 h-10 rounded-full object-cover border border-gray-200"
              loading="lazy"
              onError={(e) => {
                e.target.src = "/default-profile.jpg";
              }}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-xs text-gray-500">No Image</span>
            </div>
          )}
        </Link>
      </td>
      <td className="py-4 px-6 whitespace-nowrap">
        <Link
          to={`/winners/${winner.slug}`}
          className="text-sm font-medium text-green-600 hover:underline hover:text-green-800">
          {winner.name}
        </Link>
      </td>
      <td className="py-4 px-6 whitespace-nowrap">
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
          {winner.awardCategory}
        </span>
      </td>
      <td className="py-4 px-6 whitespace-nowrap">
        <span className="text-sm text-gray-500">{winner.award}</span>
      </td>
      <td className="py-4 px-6 whitespace-nowrap">
        <span className="text-sm text-gray-500">{winner.year}</span>
      </td>
      <td className="py-4 px-6 whitespace-nowrap flex space-x-2">
        <Link
          to={`/Admin/CreateEditWinnerPage/${winner.slug}`}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          title="Edit">
          <Edit className="w-4 h-4" />
        </Link>
        <button
          onClick={() => onDeleteClick(winner._id)}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          title="Delete">
          <Trash2 className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
});

const AdminWinnersListPage = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [winners, setWinners] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showMore, setShowMore] = useState(true);
  const [winnerIdToDelete, setWinnerIdToDelete] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    year: "",
    awardCategory: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });

  const awardCategories = [
    "Humanitarian of the Year",
    "Innovator of the Year",
    "Emergency Services",
    "Young Achiever",
    "Community Champion",
    "Lifetime Achievement",
    "Environmental Hero",
  ];

  // Generate years from 2000 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2000 + 1 },
    (_, i) => currentYear - i
  );

  const showAlertMessage = (message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  const debounceSearch = useCallback(
    debounce((value) => {
      setDebouncedSearchTerm(value);
    }, 500),
    []
  );

  useEffect(() => {
    debounceSearch(searchTerm);
  }, [searchTerm, debounceSearch]);

  const fetchWinners = useCallback(
    async (
      startIndex = 0,
      search = "",
      year = "",
      category = "",
      currentWinners = []
    ) => {
      setIsLoading(true);
      try {
        let url = `${backendURL}/api/getWinners?startIndex=${startIndex}&limit=10`;
        if (search) url += `&searchTerm=${encodeURIComponent(search)}`;
        if (year) url += `&year=${year}`;
        if (category) url += `&awardCategory=${encodeURIComponent(category)}`;

        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const newWinners =
          startIndex === 0
            ? response.data.winners
            : [...currentWinners, ...response.data.winners];
        setWinners(newWinners);
        setShowMore(response.data.winners.length === 10);
      } catch (err) {
        showAlertMessage(
          err.response?.data?.message || "Failed to fetch winners",
          "destructive"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [userInfo]
  );

  useEffect(() => {
    fetchWinners(0, debouncedSearchTerm, filters.year, filters.awardCategory);
  }, [debouncedSearchTerm, filters, fetchWinners]);

  const handleShowMore = () => {
    fetchWinners(
      winners.length,
      debouncedSearchTerm,
      filters.year,
      filters.awardCategory,
      winners
    );
  };

  const handleDeleteWinner = async () => {
    try {
      await axios.delete(`${backendURL}/api/deleteWinner/${winnerIdToDelete}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setWinners((prev) =>
        prev.filter((winner) => winner._id !== winnerIdToDelete)
      );
      showAlertMessage("Winner deleted successfully", "success");
      setDeleteOpen(false);
    } catch (err) {
      showAlertMessage(
        err.response?.data?.message || "Failed to delete winner",
        "destructive"
      );
    }
  };

  const handleDeleteClick = (winnerId) => {
    setWinnerIdToDelete(winnerId);
    setDeleteOpen(true);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilters({ year: "", awardCategory: "" });
  };

  if (isLoading && winners.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto p-4 md:p-6 lg:p-8 max-w-7xl ">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-green-800">Manage Winners</h1>
        <Link to="/Admin/CreateEditWinnerPage">
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm">
            <Plus className="w-5 h-5 mr-2" />
            Add New Winner
          </button>
        </Link>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-green-800 mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search winners by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <select
              name="year"
              value={filters.year}
              onChange={handleFilterChange}
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500">
              <option value="">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              name="awardCategory"
              value={filters.awardCategory}
              onChange={handleFilterChange}
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500">
              <option value="">All Categories</option>
              {awardCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors md:col-span-3 md:w-auto ">
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Winners Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {winners.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Date Updated
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Image
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Award
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Year
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {winners.map((winner) => (
                  <WinnerTableRow
                    key={winner._id}
                    winner={winner}
                    onDeleteClick={handleDeleteClick}
                  />
                ))}
              </tbody>
            </table>
            {showMore && (
              <div className="px-6 py-4 border-t border-gray-200">
                <button
                  onClick={handleShowMore}
                  className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  Load More
                  <ChevronDown className="ml-2 h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              No winners found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filters.year || filters.awardCategory
                ? "Try adjusting your search or filter criteria"
                : "Get started by creating a new winner"}
            </p>
            <div className="mt-6">
              <Link
                to="/Admin/CreateEditWinnerPage"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                New Winner
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Are you sure you want to delete this winner?
            </h3>
            <p className="text-gray-600 mb-4">This action cannot be undone.</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setDeleteOpen(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={handleDeleteWinner}
                className="flex items-center px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700">
                <Trash2 className="w-5 h-5 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Component */}
      {showAlert && (
        <div className="fixed bottom-4 right-4 z-50">
          <Alert
            variant={alertConfig.variant}
            onClose={() => setShowAlert(false)}>
            <AlertDescription>{alertConfig.message}</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
};

export default AdminWinnersListPage;
