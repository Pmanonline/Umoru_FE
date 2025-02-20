// import React, { useState, useEffect, useMemo } from "react";
// import { Link } from "react-router-dom";
// import { ChevronLeft, ChevronRight, Search, Sliders } from "lucide-react";
// import people from "../assets/json/peopleData.json"; // Sample data
// import PeopleCard from "../components/Cards/PeopleCard";

// const PeoplePage = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [peoplePerPage] = useState(12);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedLocation, setSelectedLocation] = useState("Select Location");
//   const [selectedProfession, setSelectedProfession] =
//     useState("Select Profession");
//   const [sortBy, setSortBy] = useState("name");
//   const [sortOrder, setSortOrder] = useState("asc");
//   const [viewMode, setViewMode] = useState("grid");

//   // Get unique locations and professions
//   const locations = [
//     "Select Location",
//     ...new Set(people.map((p) => p.location).filter(Boolean)),
//   ];
//   const professions = [
//     "Select Profession",
//     ...new Set(people.map((p) => p.profession).filter(Boolean)),
//   ];

//   // Filter and sort people
//   const filteredPeople = useMemo(() => {
//     return people
//       .filter((person) => {
//         const matchesSearch =
//           person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           person.skills?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           person.location?.toLowerCase().includes(searchQuery.toLowerCase());

//         const matchesLocation =
//           selectedLocation === "Select Location" ||
//           person.location === selectedLocation;
//         const matchesProfession =
//           selectedProfession === "Select Profession" ||
//           person.profession === selectedProfession;

//         return matchesSearch && matchesLocation && matchesProfession;
//       })
//       .sort((a, b) => {
//         const multiplier = sortOrder === "asc" ? 1 : -1;
//         switch (sortBy) {
//           case "name":
//             return a.name.localeCompare(b.name) * multiplier;
//           case "profession":
//             return a.profession.localeCompare(b.profession) * multiplier;
//           default:
//             return 0;
//         }
//       });
//   }, [
//     people,
//     searchQuery,
//     selectedLocation,
//     selectedProfession,
//     sortBy,
//     sortOrder,
//   ]);

//   // Pagination
//   const indexOfLastPerson = currentPage * peoplePerPage;
//   const indexOfFirstPerson = indexOfLastPerson - peoplePerPage;
//   const currentPeople = filteredPeople.slice(
//     indexOfFirstPerson,
//     indexOfLastPerson
//   );
//   const totalPages = Math.ceil(filteredPeople.length / peoplePerPage);

//   const handlePageChange = (pageNumber) => {
//     if (pageNumber < 1 || pageNumber > totalPages) return;
//     setCurrentPage(pageNumber);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // Reset to first page when filters change
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchQuery, selectedLocation, selectedProfession, sortBy, sortOrder]);

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       {/* Search and Filters */}
//       <div className="mb-8 space-y-4">
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search people..."
//             className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//           <Search className="absolute left-4 top-3.5 text-gray-400" />
//         </div>

//         <div className="flex flex-wrap gap-4 items-center">
//           <select
//             className="bg-white border rounded-lg px-4 py-2"
//             value={selectedLocation}
//             onChange={(e) => setSelectedLocation(e.target.value)}>
//             {locations.map((location) => (
//               <option key={location} value={location}>
//                 {location}
//               </option>
//             ))}
//           </select>

//           <select
//             className="bg-white border rounded-lg px-4 py-2"
//             value={selectedProfession}
//             onChange={(e) => setSelectedProfession(e.target.value)}>
//             {professions.map((profession) => (
//               <option key={profession} value={profession}>
//                 {profession}
//               </option>
//             ))}
//           </select>

//           <div className="flex items-center space-x-2 ml-auto">
//             <label className="text-sm text-gray-600">Sort by:</label>
//             <select
//               className="bg-white border rounded-lg px-3 py-2"
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}>
//               <option value="name">Name</option>
//               <option value="profession">Profession</option>
//             </select>
//             <button
//               onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
//               className="p-2 hover:bg-gray-100 rounded-lg">
//               {sortOrder === "asc" ? "↑" : "↓"}
//             </button>
//           </div>
//         </div>

//         <div className="text-sm text-gray-600">
//           Showing {filteredPeople.length} results
//         </div>
//       </div>

//       {/* People Listings */}
//       <div
//         className={`gap-6 ${
//           viewMode === "grid"
//             ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
//             : "space-y-6"
//         }`}>
//         {currentPeople.map((person) => (
//           <PeopleCard key={person.id} person={person} />
//         ))}
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex justify-center items-center mt-8 space-x-2">
//           <button
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//             className={`p-2 rounded-full transition-colors ${
//               currentPage === 1
//                 ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//                 : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//             }`}>
//             <ChevronLeft size={18} />
//           </button>

//           {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//             <button
//               key={page}
//               onClick={() => handlePageChange(page)}
//               className={`px-4 py-2 rounded-full transition-colors ${
//                 currentPage === page
//                   ? "bg-red-600 text-white"
//                   : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//               }`}>
//               {page}
//             </button>
//           ))}

//           <button
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className={`p-2 rounded-full transition-colors ${
//               currentPage === totalPages
//                 ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//                 : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//             }`}>
//             <ChevronRight size={18} />
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PeoplePage;
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  MapPin,
  User,
  Mail,
  Phone,
  Share2,
  ExternalLink,
} from "lucide-react";
import people from "../assets/json/peopleData.json"; // Sample data
import PeopleCard from "../components/Cards/PeopleCard";
import peopleImage from "../assets/images/E-business.png";

const PeoplePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [peoplePerPage] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Select Location");
  const [selectedProfession, setSelectedProfession] =
    useState("Select Profession");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("grid");

  // Get unique locations and professions
  const locations = [
    "Select Location",
    ...new Set(people.map((p) => p.location).filter(Boolean)),
  ];
  const professions = [
    "Select Profession",
    ...new Set(people.map((p) => p.profession).filter(Boolean)),
  ];

  // Filter and sort people
  const filteredPeople = useMemo(() => {
    return people
      .filter((person) => {
        const matchesSearch =
          person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          person.skills?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          person.location?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesLocation =
          selectedLocation === "Select Location" ||
          person.location === selectedLocation;
        const matchesProfession =
          selectedProfession === "Select Profession" ||
          person.profession === selectedProfession;

        return matchesSearch && matchesLocation && matchesProfession;
      })
      .sort((a, b) => {
        const multiplier = sortOrder === "asc" ? 1 : -1;
        switch (sortBy) {
          case "name":
            return a.name.localeCompare(b.name) * multiplier;
          case "profession":
            return a.profession.localeCompare(b.profession) * multiplier;
          default:
            return 0;
        }
      });
  }, [
    people,
    searchQuery,
    selectedLocation,
    selectedProfession,
    sortBy,
    sortOrder,
  ]);

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

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedLocation, selectedProfession, sortBy, sortOrder]);

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[50vh] flex flex-col justify-center items-center text-center mb-8 p-6">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{ backgroundImage: `url(${peopleImage})` }}></div>

        {/* Content */}
        <h1 className="relative text-4xl sm:text-5xl font-bold mb-4 text-white z-10">
          Find the Best Professionals Near You
        </h1>
        <p className="relative text-lg sm:text-xl mb-6 text-white z-10">
          Discover skilled professionals by location, profession, and expertise.
          Whether you're looking for a designer, developer, or consultant, we've
          got you covered.
        </p>
        <div className="relative flex space-x-4 z-10">
          <button className="bg-white text-red-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
            Explore Now
          </button>
          <button className="bg-transparent border-2 border-white text-white px-6 py-2 rounded-full font-semibold hover:bg-white hover:text-red-600 transition-colors">
            Find Businesses
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex">
        {/* Left Section - People Listings */}
        <div className="flex-1">
          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search people..."
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
                value={selectedProfession}
                onChange={(e) => setSelectedProfession(e.target.value)}>
                {professions.map((profession) => (
                  <option key={profession} value={profession}>
                    {profession}
                  </option>
                ))}
              </select>

              <div className="flex items-center space-x-2 ml-auto">
                <label className="text-sm text-gray-600">Sort by:</label>
                <select
                  className="bg-white border rounded-lg px-3 py-2"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}>
                  <option value="name">Name</option>
                  <option value="profession">Profession</option>
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
              Showing {filteredPeople.length} results
            </div>
          </div>

          {/* People Listings */}
          <div
            className={`gap-6 ${
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "space-y-6"
            }`}>
            {currentPeople.map((person) => (
              <PeopleCard key={person.id} person={person} />
            ))}
          </div>

          {/* Pagination */}
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

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
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

export default PeoplePage;
