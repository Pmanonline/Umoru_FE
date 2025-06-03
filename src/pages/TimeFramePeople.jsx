// import React, { useState, useMemo } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { ArrowLeft, Search } from "lucide-react";
// import recommendedPeople from "../assets/json/recommendedPeopleData.json";

// const TimeFramePeople = () => {
//   const { timeframe } = useParams();
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");

//   // Capitalize timeframe for display and data lookup
//   const capitalizedTimeframe =
//     timeframe.charAt(0).toUpperCase() + timeframe.slice(1).toLowerCase();
//   const people = recommendedPeople[capitalizedTimeframe] || [];

//   // Get unique categories
//   const categories = useMemo(() => {
//     const uniqueCategories = [
//       "All",
//       ...new Set(people.map((person) => person.category)),
//     ].sort();
//     return uniqueCategories;
//   }, [people]);

//   // Filter people based on search and category
//   const filteredPeople = useMemo(() => {
//     return people.filter((person) => {
//       const matchesSearch = person.name
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase());
//       const matchesCategory =
//         selectedCategory === "All" || person.category === selectedCategory;
//       return matchesSearch && matchesCategory;
//     });
//   }, [people, searchTerm, selectedCategory]);

//   return (
//     <section className="min-h-screen bg-gray-50 py-12 md:py-16 px-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => navigate(-1)}
//               className="flex items-center text-green-700 hover:text-green-800"
//               aria-label="Go back">
//               <ArrowLeft className="w-6 h-6 mr-2" />
//               Back
//             </button>
//             <h1 className="text-3xl md:text-4xl font-bold text-green-900">
//               {capitalizedTimeframe} Recommended Heroes
//             </h1>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search by name..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//               />
//             </div>
//             <div className="flex-1">
//               <select
//                 value={selectedCategory}
//                 onChange={(e) => setSelectedCategory(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
//                 {categories.map((category) => (
//                   <option key={category} value={category}>
//                     {category}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* People Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredPeople.length > 0 ? (
//             filteredPeople.map((person) => (
//               <div
//                 key={person.id}
//                 className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
//                 <div className="relative w-full pb-[100%]">
//                   <img
//                     src={person.image}
//                     alt={person.name}
//                     className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
//                     onError={(e) =>
//                       (e.target.src = "https://via.placeholder.com/150")
//                     }
//                     loading="lazy"
//                   />
//                 </div>
//                 <div className="mt-4 text-center">
//                   <h3 className="text-lg font-bold text-gray-900">
//                     {person.name}
//                   </h3>
//                   <p className="text-sm text-green-900">{person.title}</p>
//                   <p className="text-sm text-gray-600 mt-1">{person.award}</p>
//                   <p className="text-xs text-gray-500 mt-1">
//                     {person.category} • {person.year}
//                   </p>
//                   <p className="text-sm text-gray-600 mt-2 line-clamp-3">
//                     {person.description}
//                   </p>
//                   <Link
//                     to={`/recommended/${person.slug}`}
//                     className="mt-4 inline-block text-green-700 hover:text-green-800 underline text-sm font-medium transition-colors">
//                     Read More
//                   </Link>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="col-span-full text-center py-12">
//               <p className="text-gray-600 text-lg">
//                 No heroes found for this timeframe or filter.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default TimeFramePeople;
import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";

const backendURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:3001";

const TimeframePeople = () => {
  const { timeframe } = useParams();
  const navigate = useNavigate();
  const [people, setPeople] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const capitalizedTimeframe =
    timeframe.charAt(0).toUpperCase() + timeframe.slice(1).toLowerCase();

  // Fetch people
  useEffect(() => {
    setIsLoading(true);
    fetch(`${backendURL}/api/recommended?timeframe=${capitalizedTimeframe}`)
      .then((res) => res.json())
      .then((data) => {
        setPeople(data.recommendedPersons);
        setIsLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch recommended persons");
        setIsLoading(false);
        console.error(err);
      });
  }, [capitalizedTimeframe]);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [
      "All",
      ...new Set(people.map((person) => person.category)),
    ].sort();
    return uniqueCategories;
  }, [people]);

  // Filter people
  const filteredPeople = useMemo(() => {
    return people.filter((person) => {
      const matchesSearch = person.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || person.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [people, searchTerm, selectedCategory]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-green-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-12 md:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-green-700 hover:text-green-800"
              aria-label="Go back">
              <ArrowLeft className="w-6 h-6 mr-2" />
              Back
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-green-900">
              {capitalizedTimeframe} Recommended Heroes
            </h1>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex-1">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPeople.length > 0 ? (
            filteredPeople.map((person) => (
              <div
                key={person._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                <div className="relative w-full pb-[100%]">
                  <img
                    src={person.image || "https://via.placeholder.com/150"}
                    alt={person.name}
                    className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                    loading="lazy"
                  />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-bold text-gray-900">
                    {person.name}
                  </h3>
                  <p className="text-sm text-green-900">{person.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{person.award}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {person.category} • {person.year}
                  </p>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                    {person.description}
                  </p>
                  <Link
                    to={`/recommended/${person.slug}`}
                    className="mt-4 inline-block text-green-700 hover:text-green-800 underline text-sm font-medium transition-colors">
                    Read More
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 text-lg">
                No heroes found for this timeframe or filter.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TimeframePeople;
