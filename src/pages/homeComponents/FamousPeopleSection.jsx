import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const backendURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:3001";

// Skeleton Card Component for Loading State
const SkeletonCard = ({ isMobile }) => (
  <div
    className={`relative rounded-lg overflow-hidden animate-pulse ${
      isMobile ? "flex-shrink-0 w-40 aspect-[3/4]" : "aspect-square"
    }`}>
    <div className="w-full h-full bg-gray-200" />
    <div className="absolute bottom-0 left-0 right-0 p-3 bg-white/90 backdrop-blur-sm">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
    </div>
  </div>
);

const FamousPeopleSection = () => {
  const scrollRef = useRef(null);
  const [famousPeople, setFamousPeople] = useState([]);
  const [categories, setCategories] = useState([]);
  const [continents, setContinents] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedContinent, setSelectedContinent] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${backendURL}/api/getFamousPeople`);

      if (!response.ok) {
        throw new Error("Failed to fetch famous people");
      }

      const data = await response.json();
      const people = data.people || [];
      setFamousPeople(people);

      // Extract unique categories
      const uniqueCategories = [
        ...new Set(people.map((person) => person.category)),
      ].sort();
      setCategories(uniqueCategories);
      setSelectedCategory(uniqueCategories[0] || "");

      // Extract unique continents
      const uniqueContinents = [
        ...new Set(people.map((person) => person.continent)),
      ].sort();
      setContinents(uniqueContinents);

      // Extract countries with continent relationship
      const countryContinentMap = {};
      people.forEach((person) => {
        if (!countryContinentMap[person.country]) {
          countryContinentMap[person.country] = person.continent;
        }
      });

      const uniqueCountries = Object.entries(countryContinentMap)
        .map(([name, continent]) => ({ name, continent }))
        .sort((a, b) => a.name.localeCompare(b.name));

      setCountries(uniqueCountries);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching famous people:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Optimize scroll functions with useCallback
  const scrollLeft = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  }, []);

  const scrollRight = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  }, []);

  // Memoize filtered countries based on selected continent
  const filteredCountries = useMemo(() => {
    if (!selectedContinent) return countries;
    return countries.filter(
      (country) => country.continent === selectedContinent
    );
  }, [countries, selectedContinent]);

  // Memoize filtered people to prevent unnecessary recalculations
  const filteredPeople = useMemo(() => {
    return famousPeople.filter((person) => {
      const matchesCategory = selectedCategory
        ? person.category === selectedCategory
        : true;
      const matchesContinent = selectedContinent
        ? person.continent === selectedContinent
        : true;
      const matchesCountry = selectedCountry
        ? person.country === selectedCountry
        : true;
      return matchesCategory && matchesContinent && matchesCountry;
    });
  }, [famousPeople, selectedCategory, selectedContinent, selectedCountry]);

  // Reset country when continent changes
  useEffect(() => {
    setSelectedCountry("");
  }, [selectedContinent]);

  if (isLoading) {
    return (
      <section className="w-full py-12 md:py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4 pb-5 md:mb-0 max-w-[45rem] mx-auto text-center">
              Discover Famous People from Around the World
            </h1>
          </div>

          {/* Filter Skeleton */}
          <div className="flex flex-col items-center mb-5 gap-4">
            <div className="inline-flex rounded-md shadow-sm gap-2">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="px-4 py-2 bg-gray-200 rounded-md animate-pulse w-20 h-8"
                />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              <div className="h-10 bg-gray-200 rounded-md animate-pulse" />
              <div className="h-10 bg-gray-200 rounded-md animate-pulse" />
            </div>
          </div>

          {/* Skeleton Cards */}
          <div className="relative">
            {/* Desktop Grid Skeleton */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <SkeletonCard key={index} isMobile={false} />
              ))}
            </div>

            {/* Mobile Carousel Skeleton */}
            <div className="md:hidden relative">
              <div
                className="flex overflow-x-auto scrollbar-hide gap-6 pb-4 -mx-4 px-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                {[...Array(4)].map((_, index) => (
                  <SkeletonCard key={index} isMobile={true} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full py-12 md:py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center py-20">
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-red-600"
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
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{error}</h3>
          <p className="text-gray-600 mb-6">
            Unable to load famous people. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition-colors">
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12 md:py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4 pb-5 md:mb-0 max-w-[45rem] mx-auto text-center">
            Discover Famous People from Around the World
          </h1>
        </div>

        {/* Filters */}
        <div className="mb-8">
          {/* Category Filter */}
          <div className="flex justify-center mb-5">
            <div
              className="inline-flex rounded-md shadow-sm flex-wrap justify-center gap-2"
              role="group">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    selectedCategory === category
                      ? "bg-primary text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  } border border-gray-200 rounded-lg`}>
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Continent and Country Filters */}
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Continent
                </label>
                <select
                  value={selectedContinent}
                  onChange={(e) => setSelectedContinent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200">
                  <option value="">All Continents</option>
                  {continents.map((continent) => (
                    <option key={continent} value={continent}>
                      {continent}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Country
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                  disabled={!selectedContinent}>
                  <option value="">All Countries</option>
                  {filteredCountries.map((country) => (
                    <option key={country.name} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* People Grid/Carousel */}
        {filteredPeople.length > 0 ? (
          <div className="relative">
            {/* Desktop Grid - 4 columns */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredPeople.map((person) => (
                <Link
                  to={`/SingleFamousPerson/${person.slug}`}
                  key={person._id}
                  className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  {/* Image with gradient overlay */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={person.image || "/default-profile.jpg"}
                      alt={person.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = "/default-profile.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-primary/20 to-transparent" />
                    <span className="absolute bottom-3 left-3 bg-primary/70 text-white text-xs px-2 py-1 rounded">
                      {person.category}
                    </span>
                  </div>

                  {/* Always visible name at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-white/90 backdrop-blur-sm">
                    <h3 className="text-gray-700 font-semibold text-lg mb-1">
                      {person.name}
                    </h3>
                    <p className="text-primary text-sm line-clamp-2">
                      {person.description}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      {person.country}, {person.continent}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Mobile Carousel - Slimmer cards */}
            <div className="md:hidden relative">
              <div
                className="flex overflow-x-auto scrollbar-hide gap-6 pb-4 -mx-4 px-4"
                ref={scrollRef}
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                {filteredPeople.map((person) => (
                  <Link
                    to={`/SingleFamousPerson/${person.slug}`}
                    key={person._id}
                    className="flex-shrink-0 w-40 relative group rounded-lg overflow-hidden">
                    <div className="relative aspect-[3/4]">
                      <img
                        src={person.image || "/default-profile.jpg"}
                        alt={person.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.target.src = "/default-profile.jpg";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-white/90 backdrop-blur-sm">
                      <h3 className="text-gray-900 font-medium text-sm truncate">
                        {person.name}
                      </h3>
                      <p className="text-primary text-xs truncate">
                        {person.category}
                      </p>
                      <p className="text-gray-500 text-xs truncate">
                        {person.country}, {person.continent}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              {/* Navigation buttons */}
              <button
                onClick={scrollLeft}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 text-gray-800 p-2 rounded-full shadow-md hover:bg-white transition-colors"
                aria-label="Scroll left">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={scrollRight}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 text-gray-800 p-2 rounded-full shadow-md hover:bg-white transition-colors"
                aria-label="Scroll right">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            {categories.length > 0
              ? "No famous people found with the selected filters"
              : "No famous people data available"}
          </div>
        )}
      </div>
    </section>
  );
};

export default FamousPeopleSection;
