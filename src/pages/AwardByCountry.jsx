// import React, { useState, useEffect } from "react";
// import { useParams, Link } from "react-router-dom";
// import Diamond from "../assets/images/diamond.png";
// import { X, ChevronRight, ChevronLeft } from "lucide-react";

// const backendURL =
//   import.meta.env.MODE === "production"
//     ? import.meta.env.VITE_BACKEND_URL
//     : "http://localhost:3001";

// const AwardCard = ({ award }) => {
//   return (
//     <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col group">
//       <div className="relative w-full aspect-[4/3]">
//         <img
//           src={award.image}
//           alt={award.name}
//           className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
//           onError={(e) => {
//             e.target.src = "/images/awards/default.jpg";
//           }}
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
//         <div className="absolute bottom-0 left-0 right-0 p-4">
//           <span className="inline-block text-xs font-medium text-white bg-green-600 px-3 py-1 rounded-full mb-2">
//             {award.category}
//           </span>
//           <h3 className="text-xl font-bold text-white">{award.name}</h3>
//         </div>
//       </div>
//       <div className="p-5 flex flex-col flex-grow">
//         <div className="mb-4">
//           <p className="text-green-600 font-medium mb-2">{award.award}</p>
//           <p className="text-gray-600 text-sm line-clamp-3">
//             {award.description}
//           </p>
//         </div>
//         <div className="mt-auto flex justify-between items-center">
//           <span className="text-xs text-gray-500">{award.year}</span>
//           <Link
//             to={`/singleAward/Award-details/${award.slug}`}
//             className="inline-flex items-center text-green-600 hover:text-green-800 text-sm font-medium"
//             aria-label={`Read more about ${award.name}'s ${award.award}`}>
//             Read More <ChevronRight className="w-4 h-4 ml-1" />
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// const AwardByCountry = () => {
//   const { state } = useParams();
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [selectedYear, setSelectedYear] = useState("All");
//   const [modalOpen, setModalOpen] = useState(false);
//   const [currentModalCategory, setCurrentModalCategory] = useState("");
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [awards, setAwards] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [years, setYears] = useState(["All"]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch awards from the backend
//   useEffect(() => {
//     const fetchAwards = async () => {
//       try {
//         setIsLoading(true);
//         const res = await fetch(`${backendURL}/api/getAwards`);
//         if (!res.ok) {
//           throw new Error("Failed to fetch awards");
//         }
//         const data = await res.json();
//         const stateAwards = data.awards.filter(
//           (award) => award.state.toLowerCase() === state.toLowerCase()
//         );

//         setAwards(stateAwards);

//         // Extract unique categories
//         const uniqueCategories = [
//           ...new Set(stateAwards.map((award) => award.category)),
//         ].sort();
//         setCategories(uniqueCategories);

//         // Extract unique years
//         const uniqueYears = [
//           "All",
//           ...new Set(stateAwards.map((award) => award.year.toString())),
//         ].sort((a, b) => (a === "All" ? -1 : b === "All" ? 1 : b - a));
//         setYears(uniqueYears);
//       } catch (err) {
//         setError(err.message);
//         console.error("Error fetching awards:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchAwards();
//   }, [state]);

//   const filteredAwards = awards.filter((award) => {
//     const categoryMatch =
//       selectedCategory === "All" || award.category === selectedCategory;
//     const yearMatch =
//       selectedYear === "All" || award.year.toString() === selectedYear;
//     return categoryMatch && yearMatch;
//   });

//   const awardsByCategory = categories.reduce((acc, category) => {
//     acc[category] = filteredAwards.filter(
//       (award) => award.category === category
//     );
//     return acc;
//   }, {});

//   // Group awards into slides for carousel
//   const slides = [];
//   const awardsPerSlide = 3;

//   for (let i = 0; i < filteredAwards.length; i += awardsPerSlide) {
//     slides.push(filteredAwards.slice(i, i + awardsPerSlide));
//   }

//   const nextSlide = () => {
//     setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
//   };

//   const prevSlide = () => {
//     setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
//   };

//   const openModalForCategory = (category) => {
//     setCurrentModalCategory(category);
//     setModalOpen(true);
//   };

//   const formatStateName = (name) => {
//     return name
//       .split(" ")
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
//       .join(" ");
//   };

//   return (
//     <section className="mx-auto px-4 md:px-8 lg:px-16 py-12 bg-gray-50 mt-9">
//       {/* Hero Header */}
//       <div className="text-center mb-12">
//         <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
//           PRIDE OF {formatStateName(state)}
//         </h1>
//         <div className="flex justify-center items-center gap-3">
//           <img src={Diamond} alt="Diamond icon" className="w-4 h-4" />
//           <span className="text-green-800 font-medium text-xl">
//             HONORING EXCELLENCE IN {formatStateName(state)}
//           </span>
//           <img src={Diamond} alt="Diamond icon" className="w-4 h-4" />
//         </div>
//       </div>

//       {/* Filter Controls */}
//       <div className="flex flex-col md:flex-row justify-center gap-4 mb-12">
//         <div className="w-full md:w-auto">
//           <div className="relative">
//             <select
//               value={selectedCategory}
//               onChange={(e) => setSelectedCategory(e.target.value)}
//               className="appearance-none w-full md:w-64 bg-white border border-gray-300 text-gray-800 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-green-500"
//               aria-label="Select award category">
//               <option value="All">All Categories</option>
//               {categories.map((category) => (
//                 <option key={category} value={category}>
//                   {category}
//                 </option>
//               ))}
//             </select>
//             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//               <svg
//                 className="fill-current h-4 w-4"
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 20 20">
//                 <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
//               </svg>
//             </div>
//           </div>
//         </div>
//         <div className="w-full md:w-auto">
//           <div className="relative">
//             <select
//               value={selectedYear}
//               onChange={(e) => setSelectedYear(e.target.value)}
//               className="appearance-none w-full md:w-48 bg-white border border-gray-300 text-gray-800 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-green-500"
//               aria-label="Select award year">
//               {years.map((year) => (
//                 <option key={year} value={year}>
//                   {year === "All" ? "All Years" : year}
//                 </option>
//               ))}
//             </select>
//             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//               <svg
//                 className="fill-current h-4 w-4"
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 20 20">
//                 <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
//               </svg>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Awards Display */}
//       {isLoading ? (
//         <div className="text-center py-16">
//           <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-xl text-gray-800">Loading awards...</p>
//         </div>
//       ) : error ? (
//         <div className="text-center py-16 bg-white rounded-xl shadow-sm">
//           <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-12 w-12 text-red-600"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor">
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//               />
//             </svg>
//           </div>
//           <h3 className="text-xl font-semibold text-gray-800 mb-2">
//             Error: {error}
//           </h3>
//           <p className="text-gray-600 max-w-md mx-auto">
//             Unable to load awards. Please try again later.
//           </p>
//           <button
//             onClick={() => window.location.reload()}
//             className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
//             Retry
//           </button>
//         </div>
//       ) : filteredAwards.length > 0 ? (
//         <div className="relative">
//           {/* Carousel for multiple slides */}
//           {slides.length > 1 && (
//             <>
//               <button
//                 onClick={prevSlide}
//                 className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
//                 aria-label="Previous slide">
//                 <ChevronLeft className="w-5 h-5 text-green-600" />
//               </button>
//               <button
//                 onClick={nextSlide}
//                 className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
//                 aria-label="Next slide">
//                 <ChevronRight className="w-5 h-5 text-green-600" />
//               </button>
//             </>
//           )}

//           {/* Current Slide */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {slides[currentSlide]?.map((award, index) => (
//               <AwardCard
//                 key={award._id}
//                 award={award}
//                 size={
//                   index === 0 && slides[currentSlide].length < 3
//                     ? "large"
//                     : "medium"
//                 }
//               />
//             ))}
//           </div>

//           {/* Slide Indicators */}
//           {slides.length > 1 && (
//             <div className="flex justify-center mt-8 space-x-2">
//               {slides.map((_, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setCurrentSlide(index)}
//                   className={`w-3 h-3 rounded-full transition-all ${
//                     index === currentSlide ? "bg-green-600 w-6" : "bg-gray-300"
//                   }`}
//                   aria-label={`Go to slide ${index + 1}`}
//                 />
//               ))}
//             </div>
//           )}

//           {/* View More Button for Categories */}
//           {selectedCategory !== "All" &&
//             awardsByCategory[selectedCategory]?.length > 3 && (
//               <div className="text-center mt-12">
//                 <button
//                   onClick={() => openModalForCategory(selectedCategory)}
//                   className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md transition-colors"
//                   aria-label={`View all ${selectedCategory} awards`}>
//                   View All {selectedCategory} Awards
//                 </button>
//               </div>
//             )}
//         </div>
//       ) : (
//         <div className="text-center py-16 bg-white rounded-xl shadow-sm">
//           <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-12 w-12 text-green-600"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor">
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//               />
//             </svg>
//           </div>
//           <h3 className="text-xl font-semibold text-gray-800 mb-2">
//             No awards found
//           </h3>
//           <p className="text-gray-600 max-w-md mx-auto">
//             Try adjusting your filters or check back later for new award
//             winners.
//           </p>
//         </div>
//       )}

//       {/* Category Modal */}
//       {modalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center">
//               <h3 className="text-2xl font-bold text-green-800">
//                 {currentModalCategory} Awards in {formatStateName(state)}
//               </h3>
//               <button
//                 onClick={() => setModalOpen(false)}
//                 className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
//                 aria-label="Close modal">
//                 <X size={24} />
//               </button>
//             </div>
//             <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {awardsByCategory[currentModalCategory]?.map((award) => (
//                 <AwardCard key={award._id} award={award} />
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// };

// export default AwardByCountry;
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaGlobe } from "react-icons/fa";
import { ArrowLeft } from "lucide-react";

const backendURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:3001";

const AwardByCountry = () => {
  const { continent } = useParams();
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${backendURL}/api/getAwards`);
        if (!res.ok) {
          throw new Error("Failed to fetch awards");
        }
        const data = await res.json();
        const continentAwards = data.awards.filter(
          (award) => award.continent.toLowerCase() === continent.toLowerCase()
        );

        const uniqueCountries = [
          ...new Set(
            continentAwards.map((award) => award.country).filter(Boolean)
          ),
        ].sort();

        const countryObjects = uniqueCountries.map((country) => ({
          name: country,
          image:
            "https://hbr.org/resources/images/article_assets/1990/03/Apr22_22_1303046094.jpg",
        }));

        setCountries(countryObjects);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching countries:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, [continent]);

  const handleCountryClick = (countryName) => {
    navigate(`/nationsAward/${countryName.toLowerCase()}`);
  };

  const formatContinentName = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <section className="mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-accent-cream mt-12">
      <div className="mb-6 sm:mb-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-primary hover:text-primary/80 text-xs sm:text-sm">
          <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
          Back to Continents
        </button>
      </div>

      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-4 uppercase">
          PRIDE OF {formatContinentName(continent)}
        </h1>
        <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto">
          Explore award-winning individuals from{" "}
          {formatContinentName(continent)} making a global impact.
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg sm:text-xl text-gray-700">
              Loading countries...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-unity-coral"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
              Error: {error}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto text-xs sm:text-sm">
              Unable to load countries. Please try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 sm:px-6 py-1.5 sm:py-2 bg-sunlit-gold text-primary rounded-lg font-medium hover:bg-secondary transition-colors text-xs sm:text-sm">
              Retry
            </button>
          </div>
        ) : countries.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {countries.map((country) => (
              <div
                key={country.name}
                onClick={() => handleCountryClick(country.name)}
                className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-2 hover:border-primary">
                <div className="aspect-w-1 aspect-h-1">
                  <img
                    src={country.image}
                    alt={country.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-95"
                    onError={(e) => {
                      e.target.src = "/images/countries/default.jpg";
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <div className="flex items-center">
                    <FaGlobe className="text-sunlit-gold mr-2" />
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      {country.name.toUpperCase()}
                    </h3>
                  </div>
                  <div className="mt-2 text-xs sm:text-sm text-gray-200">
                    PRIDE OF {country.name.toUpperCase()} AWARD
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
              No countries found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto text-xs sm:text-sm">
              No awards are available for this continent yet. Check back later.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AwardByCountry;
