import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { FilterPeople } from "../components/Cards/BrowseComponent";
import PeopleCard from "../components/Cards/PeopleCard";
import peopleData from "../assets/json/peopleData.json";

const PeopleSearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  // State initialization
  const [searchQuery, setSearchQuery] = useState(
    queryParams.get("query") || ""
  );
  const [selectedLocation, setSelectedLocation] = useState(
    queryParams.get("location") || "All"
  );
  const [selectedProfession, setSelectedProfession] = useState(
    queryParams.get("profession") || "All"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const peoplePerPage = 9;

  // Sync state with URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchQuery(params.get("query") || "");
    setSelectedLocation(params.get("location") || "All");
    setSelectedProfession(params.get("profession") || "All");
  }, [location.search]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("query", searchQuery);
    if (selectedLocation !== "All") params.set("location", selectedLocation);
    if (selectedProfession !== "All")
      params.set("profession", selectedProfession);
    navigate(`/searchPage/people?${params.toString()}`);
  };

  const filteredPeople = peopleData.filter((person) => {
    const matchesSearch =
      person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.profession?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.skills?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation =
      selectedLocation === "All" || person.location === selectedLocation;
    const matchesProfession =
      selectedProfession === "All" || person.profession === selectedProfession;

    return matchesSearch && matchesLocation && matchesProfession;
  });

  // Pagination
  const indexOfLastPerson = currentPage * peoplePerPage;
  const indexOfFirstPerson = indexOfLastPerson - peoplePerPage;
  const currentPeople = filteredPeople.slice(
    indexOfFirstPerson,
    indexOfLastPerson
  );
  const totalPages = Math.ceil(filteredPeople.length / peoplePerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Pagination range generator
  const generatePaginationRange = () => {
    const range = [];
    const maxVisiblePages = 5;
    const ellipsis = "...";

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      range.push(1);
      if (currentPage > 3) {
        range.push(ellipsis);
      }
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        range.push(i);
      }
      if (currentPage < totalPages - 2) {
        range.push(ellipsis);
      }
      range.push(totalPages);
    }

    return range;
  };

  return (
    <>
      <div className="text-gray-600 text-center my-5 px-3 border-gray-200 p-2 border sm:w-[50%] mx-auto bg-gray-50">
        <span>
          <h1>People Search Results</h1>
        </span>
        <span className="text-sm">
          Showing {filteredPeople.length} results for "{searchQuery}"
        </span>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex">
        <div className="flex-1">
          {/* People Listings */}
          {filteredPeople.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {currentPeople.map((person) => (
                <PeopleCard key={person.id} person={person} />
              ))}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-500 text-lg mb-4">
                No results found for "{searchQuery}".
              </p>
              <p className="text-gray-500 mb-6">
                Try refining your search or check your spelling for better
                results.
              </p>
              <Link to={"/"}>
                <button className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                  Return to Home
                </button>
              </Link>
            </div>
          )}

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
      </div>
      <section className="max-w-5xl mx-auto">
        <FilterPeople showSearch={false} />
      </section>
    </>
  );
};

export default PeopleSearchPage;
