// import React, { useState, useEffect } from "react";
// import { ChevronLeft, ChevronRight, Search } from "lucide-react";
// import businesses from "../assets/json/businessData.json";
// import BusinessCard from "../components/Cards/BusinessCard";
// import blacklistImage from "../assets/images/blacklist.jpg";

// const BlacklistPage = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [businessesPerPage] = useState(12);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterType, setFilterType] = useState("All");
//   const [sortBy, setSortBy] = useState("newest");

//   // Filter blacklisted businesses
//   const blacklistedBusinesses = businesses.filter(
//     (business) => business.blacklisted
//   );

//   // Filter and sort blacklisted businesses
//   const filteredBusinesses = blacklistedBusinesses
//     .filter((business) => {
//       const matchesSearch =
//         business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         business.reason?.toLowerCase().includes(searchQuery.toLowerCase());

//       const matchesType =
//         filterType === "All" ||
//         (filterType === "Business" && business.type === "business") ||
//         (filterType === "People" && business.type === "person");

//       return matchesSearch && matchesType;
//     })
//     .sort((a, b) => {
//       switch (sortBy) {
//         case "newest":
//           return new Date(b.blacklistedDate) - new Date(a.blacklistedDate);
//         case "oldest":
//           return new Date(a.blacklistedDate) - new Date(b.blacklistedDate);
//         case "name":
//           return a.name.localeCompare(b.name);
//         default:
//           return 0;
//       }
//     });

//   // Pagination logic
//   const indexOfLastBusiness = currentPage * businessesPerPage;
//   const indexOfFirstBusiness = indexOfLastBusiness - businessesPerPage;
//   const currentBusinesses = filteredBusinesses.slice(
//     indexOfFirstBusiness,
//     indexOfLastBusiness
//   );
//   const totalPages = Math.ceil(filteredBusinesses.length / businessesPerPage);

//   const handlePageChange = (pageNumber) => {
//     if (pageNumber < 1 || pageNumber > totalPages) return;
//     setCurrentPage(pageNumber);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // Pagination range generator
//   const generatePaginationRange = () => {
//     const range = [];
//     const maxVisiblePages = 5;
//     const ellipsis = "...";

//     if (totalPages <= maxVisiblePages) {
//       for (let i = 1; i <= totalPages; i++) {
//         range.push(i);
//       }
//     } else {
//       range.push(1);

//       if (currentPage > 3) {
//         range.push(ellipsis);
//       }

//       const start = Math.max(2, currentPage - 1);
//       const end = Math.min(totalPages - 1, currentPage + 1);
//       for (let i = start; i <= end; i++) {
//         range.push(i);
//       }

//       if (currentPage < totalPages - 2) {
//         range.push(ellipsis);
//       }

//       range.push(totalPages);
//     }

//     return range;
//   };

//   // Reset to first page when filters change
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchQuery, filterType, sortBy]);

//   return (
//     <>
//       {/* Hero Section */}
//       <div className="relative h-[50vh] flex flex-col justify-center items-center text-center mb-8 p-6">
//         <div
//           className="absolute inset-0 bg-cover bg-center opacity-80"
//           style={{ backgroundImage: `url(${blacklistImage})` }}></div>

//         <div className="relative z-10">
//           <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-red-500 to-black bg-clip-text text-transparent">
//             Blacklisted Businesses
//           </h1>
//           <p className="text-lg sm:text-xl mb-6 text-black">
//             Reasons for blacklist: Due to bad reports and credit reviews.
//           </p>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Search and Filters */}
//         <div className="mb-8 space-y-4">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search blacklisted businesses..."
//               className="w-auto pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//             <Search className="absolute left-4 top-3.5 text-gray-400" />
//           </div>

//           <div className="flex flex-wrap gap-4 items-center">
//             <div className="flex space-x-2">
//               <button
//                 onClick={() => setFilterType("All")}
//                 className={`px-4 py-2 rounded-full transition-colors ${
//                   filterType === "All"
//                     ? "bg-red-600 text-white"
//                     : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                 }`}>
//                 All
//               </button>
//               <button
//                 onClick={() => setFilterType("Business")}
//                 className={`px-4 py-2 rounded-full transition-colors ${
//                   filterType === "Business"
//                     ? "bg-red-600 text-white"
//                     : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                 }`}>
//                 Business
//               </button>
//               <button
//                 onClick={() => setFilterType("People")}
//                 className={`px-4 py-2 rounded-full transition-colors ${
//                   filterType === "People"
//                     ? "bg-red-600 text-white"
//                     : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                 }`}>
//                 People
//               </button>
//             </div>

//             <div className="ml-auto flex items-center space-x-2">
//               <label className="text-sm text-gray-600">Sort by:</label>
//               <select
//                 className="bg-white border rounded-lg px-3 py-2"
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}>
//                 <option value="newest">Newest</option>
//                 <option value="oldest">Oldest</option>
//                 <option value="name">Name</option>
//               </select>
//             </div>
//           </div>

//           <div className="text-sm text-gray-600 font-black">
//             Showing {filteredBusinesses.length} blacklisted results
//           </div>
//         </div>

//         {/* Blacklisted Businesses Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {currentBusinesses.map((business) => (
//             <BusinessCard key={business.id} business={business} />
//           ))}
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex justify-center items-center mt-8 space-x-2">
//             <button
//               onClick={() => handlePageChange(currentPage - 1)}
//               disabled={currentPage === 1}
//               className={`p-2 rounded-full transition-colors ${
//                 currentPage === 1
//                   ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//                   : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//               }`}>
//               <ChevronLeft size={18} />
//             </button>

//             {generatePaginationRange().map((page, index) =>
//               page === "..." ? (
//                 <span
//                   key={index}
//                   className="px-4 py-2 text-gray-600 cursor-default">
//                   {page}
//                 </span>
//               ) : (
//                 <button
//                   key={index}
//                   onClick={() => handlePageChange(page)}
//                   className={`px-4 py-2 rounded-full transition-colors ${
//                     currentPage === page
//                       ? "bg-red-600 text-white"
//                       : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                   }`}>
//                   {page}
//                 </button>
//               )
//             )}

//             <button
//               onClick={() => handlePageChange(currentPage + 1)}
//               disabled={currentPage === totalPages}
//               className={`p-2 rounded-full transition-colors ${
//                 currentPage === totalPages
//                   ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//                   : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//               }`}>
//               <ChevronRight size={18} />
//             </button>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default BlacklistPage;

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  AlertTriangle,
  Calendar,
  User,
  ShieldAlert,
  BadgeAlert,
} from "lucide-react";
import businesses from "../assets/json/businessData.json";
import BlacklistCard from "../components/Cards/blackListCard";
import blacklistImage from "../assets/images/blacklist.jpg";

const BlacklistPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [dateRangeFilter, setDateRangeFilter] = useState("All");

  // Filter blacklisted entities
  const blacklistedEntities = businesses.filter(
    (business) => business.blacklisted
  );

  // Enhanced filter and sort logic
  const filteredEntities = blacklistedEntities
    .filter((entity) => {
      const matchesSearch =
        entity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entity.blacklistReason
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        entity.category?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType =
        filterType === "All" || entity.type === filterType.toLowerCase();
      const matchesSeverity =
        severityFilter === "All" || entity.blacklistSeverity === severityFilter;
      const matchesDate =
        dateRangeFilter === "All" ||
        new Date(entity.blacklistedDate) >
          new Date().setMonth(
            new Date().getMonth() - parseInt(dateRangeFilter)
          );

      return matchesSearch && matchesType && matchesSeverity && matchesDate;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.blacklistedDate) - new Date(a.blacklistedDate);
        case "oldest":
          return new Date(a.blacklistedDate) - new Date(b.blacklistedDate);
        case "name":
          return a.name.localeCompare(b.name);
        case "reports":
          return b.blacklistReports - a.blacklistReports;
        default:
          return 0;
      }
    });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEntities.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredEntities.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate pagination range
  const generatePaginationRange = () => {
    const range = [];
    const maxVisiblePages = 5;
    const ellipsis = "...";

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) range.push(i);
    } else {
      range.push(1);
      if (currentPage > 3) range.push(ellipsis);

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) range.push(i);

      if (currentPage < totalPages - 2) range.push(ellipsis);
      range.push(totalPages);
    }

    return range;
  };

  useEffect(
    () => setCurrentPage(1),
    [searchQuery, filterType, sortBy, severityFilter, dateRangeFilter]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-red-800 to-red-600">
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-4">
            <BadgeAlert className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Consumer Protection Blacklist
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Verified reports of fraudulent activities, unresolved complaints,
              and regulatory violations
            </p>
            <div className="bg-red-100/20 p-4 rounded-lg">
              <p className="text-sm">
                <ShieldAlert className="inline mr-2 h-5 w-5" />
                Last updated: {new Date().toLocaleDateString()} | Total entries:{" "}
                {blacklistedEntities.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="mb-8 bg-white rounded-xl p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search blacklisted entities..."
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-4 top-3.5 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Sort By
              </label>
              <select
                className="rounded-lg border border-gray-200 px-4 py-3 focus:ring-red-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Alphabetical</option>
                <option value="reports">Report Count</option>
              </select>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Date Range
              </label>
              <select
                className="rounded-lg border border-gray-200 px-4 py-3 focus:ring-red-500"
                value={dateRangeFilter}
                onChange={(e) => setDateRangeFilter(e.target.value)}>
                <option value="All">All Time</option>
                <option value="3">Last 3 Months</option>
                <option value="6">Last 6 Months</option>
                <option value="12">Last Year</option>
              </select>
            </div>

            <div className="bg-red-50 p-4 rounded-lg md:col-span-2 flex items-center">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
              <p className="text-sm text-red-700">
                All listings are verified through official channels. Report
                discrepancies using the feedback button.
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <User className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold">Individual Listings</h3>
                <p className="text-2xl font-bold">
                  {
                    blacklistedEntities.filter((e) => e.type === "person")
                      .length
                  }
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <ShieldAlert className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold">High Severity Cases</h3>
                <p className="text-2xl font-bold">
                  {
                    blacklistedEntities.filter(
                      (e) => e.blacklistSeverity === "High"
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold">New This Month</h3>
                <p className="text-2xl font-bold">
                  {
                    blacklistedEntities.filter(
                      (e) =>
                        new Date(e.blacklistedDate) >
                        new Date().setMonth(new Date().getMonth() - 1)
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Blacklist Entries */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {currentItems.map((entity) => (
            <BlacklistCard key={entity.id} entity={entity} />
          ))}
        </div>

        {/* Pagination and Footer */}
        {totalPages > 1 && (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-full ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400"
                    : "bg-red-50 text-red-600 hover:bg-red-100"
                }`}>
                <ChevronLeft size={20} />
              </button>

              {generatePaginationRange().map((page, index) =>
                page === "..." ? (
                  <span key={index} className="px-4 py-2 text-gray-500">
                    •••
                  </span>
                ) : (
                  <button
                    key={index}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-full ${
                      currentPage === page
                        ? "bg-red-600 text-white"
                        : "bg-red-50 text-red-600 hover:bg-red-100"
                    }`}>
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-full ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400"
                    : "bg-red-50 text-red-600 hover:bg-red-100"
                }`}>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-8 p-6 bg-red-50 rounded-xl text-center text-sm text-red-700">
          <p>
            This blacklist is maintained for consumer protection purposes.
            Entities may petition for removal through the official appeals
            process. Listings are updated daily from verified sources.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlacklistPage;
