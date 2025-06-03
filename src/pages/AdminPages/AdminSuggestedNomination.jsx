import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Trash2,
  Edit,
  Loader2,
  Search,
  ChevronDown,
  Check,
  X as XIcon,
  Clock,
} from "lucide-react";
import moment from "moment";
import { Alert, AlertDescription } from "../../components/tools/Alert";

const backendURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:3001";

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const NominationTableRow = React.memo(
  ({ nomination, onDeleteClick, onStatusChange }) => {
    const statusBadgeClass = (status) => {
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

    const statusIcon = (status) => {
      switch (status.toLowerCase()) {
        case "approved":
          return <Check className="w-4 h-4" />;
        case "pending":
          return <Clock className="w-4 h-4" />;
        case "rejected":
          return <XIcon className="w-4 h-4" />;
        default:
          return null;
      }
    };

    return (
      <tr className="border-b hover:bg-gray-50 transition-colors">
        <td className="py-3 px-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">
            {moment(nomination.updatedAt).format("MMM D, YYYY")}
          </div>
        </td>
        <td className="py-3 px-4 whitespace-nowrap">
          <Link
            to={`/nomination/${nomination.slug}`}
            className="flex items-center">
            {nomination?.image ? (
              <img
                src={nomination.image}
                alt={nomination.nomineeName}
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
        <td className="py-3 px-4 whitespace-nowrap">
          <Link
            to={`/nomination/${nomination.slug}`}
            className="text-sm font-medium text-primary hover:underline hover:text-primary/80">
            {nomination.nomineeName}
          </Link>
        </td>
        <td className="py-3 px-4 whitespace-nowrap">
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-secondary/20 text-secondary">
            {nomination.category}
          </span>
        </td>
        <td className="py-3 px-4 whitespace-nowrap">
          <span className="text-sm text-gray-600">{nomination.continent}</span>
        </td>
        <td className="py-3 px-4 whitespace-nowrap">
          <span className="text-sm text-gray-600">{nomination.country}</span>
        </td>
        <td className="py-3 px-4 whitespace-nowrap">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${statusBadgeClass(nomination.status)}`}>
              {statusIcon(nomination.status)}
              {nomination.status}
            </span>
            <select
              value={nomination.status}
              onChange={(e) => onStatusChange(nomination._id, e.target.value)}
              className="text-xs border rounded p-1 focus:outline-none focus:ring-1 focus:ring-primary">
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </td>
        <td className="py-3 px-4 whitespace-nowrap flex space-x-2">
          <button
            onClick={() => onDeleteClick(nomination._id)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-red-500 hover:text-red-700 hover:bg-unity-coral/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sunlitgold"
            title="Delete">
            <Trash2 className="w-4 h-4" />
          </button>
        </td>
      </tr>
    );
  }
);

export default function AdminSuggestedNomination() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [nominations, setNominations] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [nominationIdToDelete, setNominationIdToDelete] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterContinent, setFilterContinent] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });

  const { userInfo } = useSelector((state) => state.auth);

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

  const fetchNominations = useCallback(
    async (
      startIndex = 0,
      search = "",
      category = "",
      continent = "",
      country = "",
      status = "",
      currentNominations = []
    ) => {
      setIsLoading(true);
      try {
        let url = `${backendURL}/api/getNominations?startIndex=${startIndex}&limit=9`;
        if (search) url += `&searchTerm=${search}`;
        if (category) url += `&category=${category}`;
        if (continent) url += `&continent=${continent}`;
        if (country) url += `&country=${country}`;
        if (status) url += `&status=${status}`;

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const data = await res.json();

        if (res.ok) {
          const newNominations =
            startIndex === 0
              ? data.nominations
              : [...currentNominations, ...data.nominations];
          setNominations(newNominations);
          setShowMore(data.nominations.length === 9);
        } else {
          showAlertMessage(
            data.message || "Failed to fetch nominations",
            "destructive"
          );
        }
      } catch (error) {
        showAlertMessage(
          error.message || "An error occurred while fetching nominations",
          "destructive"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [userInfo]
  );

  const { categories, continents, countries, statuses } = useMemo(() => {
    const uniqueCategories = [
      ...new Set(nominations.map((n) => n.category)),
    ].sort();
    const uniqueContinents = [
      ...new Set(nominations.map((n) => n.continent)),
    ].sort();
    const uniqueCountries = [
      ...new Set(nominations.map((n) => n.country)),
    ].sort();
    const uniqueStatuses = ["pending", "approved", "rejected"];
    return {
      categories: uniqueCategories,
      continents: uniqueContinents,
      countries: uniqueCountries,
      statuses: uniqueStatuses,
    };
  }, [nominations]);

  useEffect(() => {
    if (!userInfo) return;

    fetchNominations(
      0,
      debouncedSearchTerm,
      filterCategory,
      filterContinent,
      filterCountry,
      filterStatus,
      nominations
    );
  }, [
    userInfo,
    debouncedSearchTerm,
    filterCategory,
    filterContinent,
    filterCountry,
    filterStatus,
    fetchNominations,
  ]);

  const handleShowMore = () => {
    fetchNominations(
      nominations.length,
      debouncedSearchTerm,
      filterCategory,
      filterContinent,
      filterCountry,
      filterStatus,
      nominations
    );
  };

  const handleDeleteNomination = async () => {
    try {
      const res = await fetch(
        `${backendURL}/api/deleteNomination/${nominationIdToDelete}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setNominations((prev) =>
          prev.filter((nomination) => nomination._id !== nominationIdToDelete)
        );
        showAlertMessage("Nomination deleted successfully", "success");
        setDeleteOpen(false);
      } else {
        showAlertMessage(
          data.message || "Failed to delete nomination",
          "destructive"
        );
      }
    } catch (error) {
      showAlertMessage(
        error.message || "An error occurred while deleting nomination",
        "destructive"
      );
    }
  };

  const handleDeleteClick = (nominationId) => {
    setNominationIdToDelete(nominationId);
    setDeleteOpen(true);
  };

  const handleStatusChange = async (nominationId, newStatus) => {
    try {
      const res = await fetch(
        `${backendURL}/api/updateNominationStatus/${nominationId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setNominations((prev) =>
          prev.map((n) =>
            n._id === nominationId ? { ...n, status: newStatus } : n
          )
        );
        showAlertMessage("Nomination status updated", "success");
      } else {
        showAlertMessage(
          data.message || "Failed to update nomination status",
          "destructive"
        );
      }
    } catch (error) {
      showAlertMessage(
        error.message || "An error occurred while updating status",
        "destructive"
      );
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilterCategory("");
    setFilterContinent("");
    setFilterCountry("");
    setFilterStatus("");
  };

  if (isLoading && nominations.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-8 max-w-7xl bg-accent-cream">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-primary">Manage Nominations</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/suggest-nominee")}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors shadow-sm">
            <Plus className="w-5 h-5 mr-2" />
            Suggest New Nominee
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-primary mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search nominations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={filterContinent}
              onChange={(e) => setFilterContinent(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
              <option value="">All Continents</option>
              {continents.map((continent) => (
                <option key={continent} value={continent}>
                  {continent}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
              <option value="">All Statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Reset Filters
          </button>
        </div>
      </div>

      {/* Nominations Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {nominations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Date Updated
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Nominee Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Continent
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {nominations.map((nomination) => (
                  <NominationTableRow
                    key={nomination._id}
                    nomination={nomination}
                    onDeleteClick={handleDeleteClick}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </tbody>
            </table>

            {showMore && (
              <div className="px-4 py-3 border-t border-gray-200">
                <button
                  onClick={handleShowMore}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-primary bg-sunlit-gold hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50">
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Load More
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </>
                  )}
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
              No nominations found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ||
              filterCategory ||
              filterContinent ||
              filterCountry ||
              filterStatus
                ? "Try adjusting your search or filter criteria"
                : "Get started by creating a new nomination"}
            </p>
            <div className="mt-6"></div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-primary mb-2">
              Are you sure you want to delete this nomination?
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteOpen(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={handleDeleteNomination}
                className="flex items-center px-4 py-2 text-white bg-primary hover:text-secondary rounded-lg hover:bg-unity-coral/80">
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
}
