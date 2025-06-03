import React, { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const backendURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:3001";

// Skeleton Card Component for Loading State
const SkeletonCard = ({ isMobile }) => (
  <div
    className={`relative rounded-xl overflow-hidden animate-pulse bg-white shadow-lg p-6 flex flex-col items-center h-full ${
      isMobile ? "flex-shrink-0 snap-start" : ""
    }`}
    style={{
      minWidth: isMobile ? "calc(90% - 12px)" : "calc(33.333% - 16px)",
    }}>
    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gray-200 mb-6"></div>
    <div className="text-center w-full">
      <div className="h-4 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
      <div className="h-10 bg-gray-200 rounded-full w-32 mx-auto"></div>
    </div>
  </div>
);

const GlobalPrideBanner = () => {
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showArrows, setShowArrows] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [selectedTimeframe, setSelectedTimeframe] = useState("Today");
  const [selectedCountry, setSelectedCountry] = useState(""); // Default to empty for "All"
  const [countries, setCountries] = useState([]); // State for unique countries
  const [people, setPeople] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // // Fetch unique countries from the backend
  // useEffect(() => {
  //   const fetchUniqueCountries = async () => {
  //     try {
  //       const response = await fetch(`${backendURL}/api/getUniqueCountries`);
  //       if (!response.ok) throw new Error("Failed to fetch countries");
  //       const data = await response.json();
  //       setCountries(["", ...data]); // Empty string for "All Countries"
  //     } catch (error) {
  //       console.error("Error fetching countries:", error);
  //       setCountries([""]); // Fallback to "All Countries" if fetch fails
  //     }
  //   };
  //   fetchUniqueCountries();
  // }, []);

  // Fetch people for the selected timeframe and country with useCallback
  const fetchPeople = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        timeframe: selectedTimeframe,
        limit: "6",
      });
      if (selectedCountry) {
        queryParams.append("country", selectedCountry);
      }

      const response = await fetch(
        `${backendURL}/api/getRecommendedPersons?${queryParams.toString()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data || !Array.isArray(data.people)) {
        throw new Error("Invalid data format received");
      }

      // Extract unique countries from data.people
      const uniqueCountries = [
        "",
        ...new Set(data.people.map((person) => person.country).filter(Boolean)),
      ];
      setCountries(uniqueCountries);
      console.log("Unique countries:", uniqueCountries);

      setPeople(data.people || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to fetch recommended persons");
      setPeople([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedTimeframe, selectedCountry]);

  useEffect(() => {
    fetchPeople();
  }, [fetchPeople]);

  // Check device type and set initial states
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setShowArrows(people.length > (mobile ? 1 : 3));
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, [people.length]);

  // Handle scroll events to update currentIndex
  useEffect(() => {
    const carousel = scrollRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      const scrollLeft = carousel.scrollLeft;
      const itemWidth = carousel.children[0]?.offsetWidth || 0;
      const newIndex = Math.round(
        scrollLeft / (itemWidth + (isMobile ? 12 : 16))
      );
      setCurrentIndex(newIndex);
    };

    carousel.addEventListener("scroll", handleScroll);
    return () => carousel.removeEventListener("scroll", handleScroll);
  }, [people, isMobile]);

  // Drag handlers
  const handleDragStart = (e) => {
    setIsDragging(true);
    setDragStartX(e.type.includes("touch") ? e.touches[0].clientX : e.clientX);
    document.body.style.cursor = "grabbing";
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const x = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
    const diff = dragStartX - x;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += diff;
      setDragStartX(x);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    document.body.style.cursor = "";
  };

  // Navigation functions with useCallback
  const scrollLeft = useCallback(() => {
    if (scrollRef.current && scrollRef.current.children.length > 0) {
      const itemWidth = scrollRef.current.children[0].offsetWidth;
      scrollRef.current.scrollBy({
        left: -itemWidth * (isMobile ? 1 : 2),
        behavior: "smooth",
      });
    }
  }, [isMobile]);

  const scrollRight = useCallback(() => {
    if (scrollRef.current && scrollRef.current.children.length > 0) {
      const itemWidth = scrollRef.current.children[0].offsetWidth;
      scrollRef.current.scrollBy({
        left: itemWidth * (isMobile ? 1 : 2),
        behavior: "smooth",
      });
    }
  }, [isMobile]);

  const isPrevDisabled = currentIndex === 0 || isLoading;
  const isNextDisabled =
    currentIndex >= people.length - (isMobile ? 1 : 3) || isLoading;

  if (isLoading) {
    return (
      <section className="w-full py-8 md:py-12 px-4 bg-accent-cream">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col items-center mb-6 md:mb-8 gap-4">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Recommended Global Pride Ambassadors
              </h2>
              <p className="mt-2 text-gray-700 text-sm sm:text-base md:text-lg max-w-xl mx-auto">
                Discover our handpicked ambassadors who are making a global
                impact, updated based on your selected timeframe and country.
              </p>
            </div>
            <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-3">
              {/* Skeleton for Country Dropdown */}
              <div className="w-40 sm:w-48 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              {/* Skeleton for Timeframe Buttons */}
              <div className="flex flex-wrap justify-center gap-2 bg-white rounded-full p-1 shadow-lg">
                {["Today", "This Week", "This Month", "This Year"].map(
                  (_, index) => (
                    <div
                      key={index}
                      className="px-4 py-1.5 bg-gray-200 rounded-full animate-pulse w-20 h-8"
                    />
                  )
                )}
              </div>
            </div>
          </div>

          {/* Skeleton Carousel */}
          <div className="relative">
            <div
              className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-3 sm:gap-4 py-2 px-2"
              style={{
                scrollSnapType: "x mandatory",
              }}>
              {[...Array(isMobile ? 1 : 3)].map((_, index) => (
                <SkeletonCard key={index} isMobile={isMobile} />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full py-8 md:py-12 px-4 bg-accent-cream">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4">
            Global Pride Ambassadors
          </h2>
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <p className="font-bold">Error loading content</p>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-light">
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-8 md:py-12 px-4 bg-accent-cream">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center mb-6 md:mb-8 gap-4">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Global Pride Ambassadors
            </h2>
            <p className="mt-2 text-gray-700 text-sm sm:text-base md:text-lg max-w-xl mx-auto">
              Discover our handpicked ambassadors who are making a global
              impact, updated based on your selected timeframe and country.
            </p>
          </div>
          <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-3">
            {/* Country Filter */}
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-sm sm:text-base"
              disabled={isLoading}>
              <option value="">All Countries</option>
              {countries
                .filter((country) => country)
                .map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
            </select>
            {/* Timeframe Filter */}
            <div className="flex flex-wrap justify-center gap-2 bg-white rounded-full p-1 shadow-lg">
              {["Today", "This Week", "This Month", "This Year"].map(
                (period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedTimeframe(period)}
                    disabled={isLoading}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      period === selectedTimeframe
                        ? "bg-primary text-white"
                        : "hover:bg-primary/10 text-gray-800"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}>
                    {period}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          {showArrows && people.length > 0 && (
            <div className="hidden md:flex justify-between absolute top-1/2 left-0 right-0 -translate-y-1/2 z-20 px-4">
              <button
                onClick={scrollLeft}
                disabled={isPrevDisabled}
                className={`p-3 rounded-full bg-white shadow-lg hover:bg-primary/10 transition-all ${
                  isPrevDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                aria-label="Scroll left">
                <ChevronLeft size={28} className="text-primary" />
              </button>
              <button
                onClick={scrollRight}
                disabled={isNextDisabled}
                className={`p-3 rounded-full bg-white shadow-lg hover:bg-primary/10 transition-all ${
                  isNextDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                aria-label="Scroll right">
                <ChevronRight size={28} className="text-primary" />
              </button>
            </div>
          )}

          {showArrows && isMobile && people.length > 0 && (
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={scrollLeft}
                disabled={isPrevDisabled}
                className={`p-2 rounded-full bg-primary text-white hover:bg-primary-light transition-all ${
                  isPrevDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                aria-label="Scroll left">
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={scrollRight}
                disabled={isNextDisabled}
                className={`p-2 rounded-full bg-primary text-white hover:bg-primary-light transition-all ${
                  isNextDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                aria-label="Scroll right">
                <ChevronRight size={24} />
              </button>
            </div>
          )}

          <div
            ref={scrollRef}
            className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-3 sm:gap-4 py-2 px-2"
            style={{
              scrollBehavior: "smooth",
              scrollSnapType: "x mandatory",
            }}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}>
            {people.length > 0 ? (
              people.map((person) => (
                <div
                  key={person._id || person.id}
                  className={`flex-shrink-0 snap-start transition-transform duration-200 ${
                    isDragging ? "cursor-grabbing" : "cursor-grab"
                  }`}
                  style={{
                    scrollSnapAlign: "center",
                    minWidth: isMobile
                      ? "calc(90% - 12px)"
                      : "calc(33.333% - 16px)",
                  }}>
                  <div className="relative h-full flex flex-col items-center group bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="relative w-20 h-20 sm:w-24 md:w-28 sm:h-20 md:h-28 rounded-full overflow-hidden border-3 border-primary shadow-sm transform transition-all duration-300 group-hover:scale-105">
                      <img
                        src={person.image || "/default-profile.jpg"}
                        alt={person.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = "/default-profile.jpg";
                        }}
                      />
                      <div className="absolute inset-0 bg-primary bg-opacity-0 group-hover:bg-opacity-80 flex items-center justify-center transition-all duration-300 p-4">
                        <p className="text-white text-xs sm:text-sm text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {person.description || "No description available"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-6 text-center w-full">
                      <span className="inline-block px-3 py-1 text-xs font-semibold text-accent-teal bg-accent-teal/10 rounded-full mb-2">
                        {person.title || "Global Ambassador"}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                        {person.name || "Unknown"}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm mt-2 line-clamp-2">
                        {person.country || "Global"} |{" "}
                        {person.subtitle || "Global Changemaker"}
                      </p>
                      <Link
                        to={`/recommended/${person.slug || person._id || ""}`}
                        className="mt-3 sm:mt-4 inline-flex items-center px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-light text-sm font-medium transition-colors">
                        Discover More
                        <ChevronRight size={16} className="ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex-shrink-0 w-full text-center py-8">
                <p className="text-gray-600 text-base sm:text-lg">
                  No global ambassadors found for this timeframe and country.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-light">
                  Refresh
                </button>
              </div>
            )}
          </div>
        </div>

        {people.length > 3 && (
          <div className="text-center mt-6 md:mt-8">
            <Link
              to={`/recommended/${selectedTimeframe.toLowerCase().replace(" ", "-")}`}
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-full hover:bg-primary-light text-sm font-medium transition-colors shadow-lg hover:shadow-xl">
              View All {selectedTimeframe} Ambassadors
              <ChevronRight size={18} className="ml-2" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default GlobalPrideBanner;
