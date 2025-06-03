import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Trash2, Edit, Loader2, Search, ChevronDown } from "lucide-react";
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

const AwardTableRow = React.memo(({ award, onDeleteClick }) => {
  return (
    <tr className="border-b hover:bg-gray-50 transition-colors">
      <td className="py-2 sm:py-3 px-3 sm:px-4 whitespace-nowrap">
        <div className="text-xs sm:text-sm text-gray-900">
          {moment(award.updatedAt).format("MMM D, YYYY")}
        </div>
      </td>
      <td className="py-2 sm:py-3 px-3 sm:px-4 whitespace-nowrap">
        <Link
          to={`/singleAward/Award-details/${award.slug}`}
          className="flex items-center">
          {award?.image ? (
            <img
              src={award.image}
              alt={award.name}
              className="w-10 h-10 rounded-full object-cover border border-gray-200"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/fallback-image.png";
              }}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-xs text-gray-500">No Image</span>
            </div>
          )}
        </Link>
      </td>
      <td className="py-2 sm:py-3 px-3 sm:px-4 whitespace-nowrap">
        <Link
          to={`/singleAward/Award-details/${award.slug}`}
          className="text-xs sm:text-sm font-medium text-primary hover:underline hover:text-primary/80">
          {award.name}
        </Link>
      </td>
      <td className="py-2 sm:py-3 px-3 sm:px-4 whitespace-nowrap">
        <div className="text-xs sm:text-sm text-gray-900">{award.award}</div>
      </td>
      <td className="py-2 sm:py-3 px-3 sm:px-4 whitespace-nowrap">
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-secondary/20 text-secondary">
          {award.category}
        </span>
      </td>
      <td className="py-2 sm:py-3 px-3 sm:px-4 whitespace-nowrap">
        <div className="text-xs sm:text-sm text-gray-900">{award.country}</div>
      </td>
      <td className="py-2 sm:py-3 px-3 sm:px-4 whitespace-nowrap">
        <div className="text-xs sm:text-sm text-gray-900">
          {award.continent}
        </div>
      </td>
      <td className="py-2 sm:py-3 px-3 sm:px-4 whitespace-nowrap">
        <div className="text-xs sm:text-sm font-medium text-gray-900">
          {award.year}
        </div>
      </td>
      <td className="py-2 sm:py-3 px-3 sm:px-4 whitespace-nowrap flex space-x-2">
        <Link
          to={`/Admin/CreateAward/${award.slug}`}
          className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 border border-transparent text-xs font-medium rounded-lg shadow-sm text-primary bg-sunlit-gold hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          title="Edit">
          <Edit className="w-4 h-4" />
        </Link>
        <button
          onClick={() => onDeleteClick(award._id)}
          className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 border border-transparent text-xs font-medium rounded-lg shadow-sm text-red-500 hover:text-red-700 hover:bg-sunlitgold hover:bg-unity-coral/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sunlitgold"
          title="Delete">
          <Trash2 className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
});

export default function AwardLists() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [awards, setAwards] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [awardIdToDelete, setAwardIdToDelete] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [filterContinent, setFilterContinent] = useState("");
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

  const fetchAwards = useCallback(
    async (
      startIndex = 0,
      search = "",
      category = "",
      year = "",
      country = "",
      continent = "",
      currentAwards = []
    ) => {
      setIsLoading(true);
      try {
        let url = `${backendURL}/api/getAwards?startIndex=${startIndex}&limit=9`;
        if (search) url += `&searchTerm=${search}`;
        if (category) url += `&category=${category}`;
        if (year) url += `&year=${year}`;
        if (country) url += `&country=${country}`;
        if (continent) url += `&continent=${continent}`;

        const res = await fetch(url);
        const data = await res.json();
        console.log("Fetched awards:", data.awards);

        if (res.ok) {
          const newAwards =
            startIndex === 0 ? data.awards : [...currentAwards, ...data.awards];
          setAwards(newAwards);
          setShowMore(data.awards.length === 9);
        } else {
          showAlertMessage(
            data.message || "Failed to fetch awards",
            "destructive"
          );
        }
      } catch (error) {
        showAlertMessage(
          error.message || "An error occurred while fetching awards",
          "destructive"
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const { categories, years, countries, continents } = useMemo(() => {
    const uniqueCategories = [
      ...new Set(awards.map((award) => award.category)),
    ].sort();
    const uniqueYears = [...new Set(awards.map((award) => award.year))].sort(
      (a, b) => b - a
    );
    const uniqueCountries = [
      ...new Set(awards.map((award) => award.country)),
    ].sort();
    const uniqueContinents = [
      ...new Set(awards.map((award) => award.continent)),
    ].sort();
    return {
      categories: uniqueCategories,
      years: uniqueYears,
      countries: uniqueCountries,
      continents: uniqueContinents,
    };
  }, [awards]);

  useEffect(() => {
    if (!userInfo) return;

    fetchAwards(
      0,
      debouncedSearchTerm,
      filterCategory,
      filterYear,
      filterCountry,
      filterContinent,
      awards
    );
  }, [
    userInfo,
    debouncedSearchTerm,
    filterCategory,
    filterYear,
    filterCountry,
    filterContinent,
    fetchAwards,
  ]);

  const handleShowMore = () => {
    fetchAwards(
      awards.length,
      debouncedSearchTerm,
      filterCategory,
      filterYear,
      filterCountry,
      filterContinent,
      awards
    );
  };

  const handleDeleteAward = async () => {
    try {
      const res = await fetch(
        `${backendURL}/api/deleteAward/${awardIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setAwards((prev) =>
          prev.filter((award) => award._id !== awardIdToDelete)
        );
        showAlertMessage("Award deleted successfully", "success");
        setDeleteOpen(false);
      } else {
        showAlertMessage(
          data.message || "Failed to delete award",
          "destructive"
        );
      }
    } catch (error) {
      showAlertMessage(
        error.message || "An error occurred while deleting award",
        "destructive"
      );
    }
  };

  const handleDeleteClick = (awardId) => {
    setAwardIdToDelete(awardId);
    setDeleteOpen(true);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilterCategory("");
    setFilterYear("");
    setFilterCountry("");
    setFilterContinent("");
  };

  if (isLoading && awards.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-7xl bg-accent-cream mt-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 sm:mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-primary">
          Manage Awards
        </h1>
        <button
          onClick={() => navigate("/Admin/CreateAward")}
          className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-white  rounded-lg hover:bg-secondary transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary">
          <Plus className="w-5 h-5 mr-2" />
          Create New Award
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-semibold text-primary mb-4">
          Filters
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search awards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-xs sm:text-sm"
            />
          </div>

          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="block w-full pl-3 pr-10 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-xs sm:text-sm">
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
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="block w-full pl-3 pr-10 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-xs sm:text-sm">
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
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              className="block w-full pl-3 pr-10 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-xs sm:text-sm">
              <option value="">All Countries</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filterContinent}
              onChange={(e) => setFilterContinent(e.target.value)}
              className="block w-full pl-3 pr-10 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-xs sm:text-sm">
              <option value="">All Continents</option>
              {continents.map((continent) => (
                <option key={continent} value={continent}>
                  {continent}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleResetFilters}
            className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm">
            Reset Filters
          </button>
        </div>
      </div>

      {/* Awards Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {awards.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-primary text-white">
                <tr>
                  <th
                    scope="col"
                    className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Date Updated
                  </th>
                  <th
                    scope="col"
                    className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Image
                  </th>
                  <th
                    scope="col"
                    className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Awardee
                  </th>
                  <th
                    scope="col"
                    className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Award
                  </th>
                  <th
                    scope="col"
                    className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Country
                  </th>
                  <th
                    scope="col"
                    className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Continent
                  </th>
                  <th
                    scope="col"
                    className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Year
                  </th>
                  <th
                    scope="col"
                    className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {awards.map((award) => (
                  <AwardTableRow
                    key={award._id}
                    award={award}
                    onDeleteClick={handleDeleteClick}
                  />
                ))}
              </tbody>
            </table>

            {showMore && (
              <div className="px-3 sm:px-4 py-2 sm:py-3 border-t border-gray-200 flex justify-center">
                <button
                  onClick={handleShowMore}
                  className="flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-lg text-primary bg-sunlit-gold hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
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
            <h3 className="text-base sm:text-lg font-medium text-gray-900">
              No awards found
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">
              {searchTerm ||
              filterCategory ||
              filterYear ||
              filterCountry ||
              filterContinent
                ? "Try adjusting your search or filter criteria"
                : "Get started by creating a new award"}
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate("/Admin/CreateAward")}
                className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-lg shadow-sm text-primary bg-sunlit-gold hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                New Award
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-primary mb-2">
              Are you sure you want to delete this award?
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm mb-4">
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setDeleteOpen(false)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 text-xs sm:text-sm">
                Cancel
              </button>
              <button
                onClick={handleDeleteAward}
                className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-white bg-unity-coral rounded-lg hover:bg-unity-coral/80 text-xs sm:text-sm">
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
