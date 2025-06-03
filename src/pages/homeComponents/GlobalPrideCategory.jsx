import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import Diamond from "../../assets/images/diamond.png";

const backendURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:3001";

const AwardCard = ({ pride, layoutType = 1 }) => {
  const cardLayouts = {
    1: (
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
        <div className="relative w-full pb-[80%]">
          <img
            src={pride.image || "/default-profile.jpg"}
            alt={pride.name}
            className="absolute top-0 left-0 w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "/default-profile.jpg";
            }}
          />
        </div>
        <div className="p-4">
          <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0">
            <div>
              <h3 className="font-bold text-sm sm:text-md">{pride.name}</h3>
            </div>
            <div className="text-xs bg-primary/10 text-primary p-2 rounded-lg">
              {pride.award}
            </div>
          </div>
          <p className="text-gray-600 text-sm mt-4 line-clamp-3">
            {pride.description}
          </p>
          <div className="mt-3 flex justify-between items-center">
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
              {pride.category}
            </span>
            <span className="text-xs text-gray-500">{pride.country}</span>
          </div>
          <div className="mt-4">
            <Link
              to={`/Single-pride/${pride.slug}`}
              className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light transition-colors"
              aria-label={`Read more about ${pride.name}`}>
              Read More
            </Link>
          </div>
        </div>
      </div>
    ),
    2: (
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-1/2 pb-[100%] sm:pb-[50%]">
          <img
            src={pride.image || "/default-profile.jpg"}
            alt={pride.name}
            className="absolute top-0 left-0 w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "/default-profile.jpg";
            }}
          />
        </div>
        <div className="p-4 flex flex-col justify-between w-full sm:w-1/2">
          <div>
            <div className="text-xs bg-primary/10 text-primary p-2 rounded-lg mb-2">
              {pride.award}
            </div>
            <h3 className="font-bold text-sm sm:text-md mb-2">{pride.name}</h3>
            <p className="text-gray-600 text-sm line-clamp-3">
              {pride.description}
            </p>
          </div>
          <div className="mt-3 flex justify-between items-center">
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
              {pride.category}
            </span>
            <span className="text-xs text-gray-500">{pride.country}</span>
          </div>
          <div className="mt-4">
            <Link
              to={`/Single-pride/${pride.slug}`}
              className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light transition-colors"
              aria-label={`Read more about ${pride.name}`}>
              Read More
            </Link>
          </div>
        </div>
      </div>
    ),
  };

  return cardLayouts[layoutType] || cardLayouts[1];
};

const GlobalPrideCategory = () => {
  const [prideEntries, setPrideEntries] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentModalCategory, setCurrentModalCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch pride entries
  useEffect(() => {
    const fetchPrideEntries = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${backendURL}/api/getPrideEntries?limit=10`);
        if (!res.ok) throw new Error("Failed to fetch pride entries");
        const data = await res.json();
        setPrideEntries(data.prideEntries);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching pride entries:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrideEntries();
  }, []);

  const categories = [
    "All",
    ...new Set(prideEntries.map((pride) => pride.category)),
  ].sort();
  const countries = [
    "All",
    ...new Set(prideEntries.map((pride) => pride.country)),
  ].sort();

  const filteredPrideEntries = prideEntries.filter((pride) => {
    const categoryMatch =
      selectedCategory === "All" || pride.category === selectedCategory;
    const countryMatch =
      selectedCountry === "All" || pride.country === selectedCountry;
    return categoryMatch && countryMatch;
  });

  const prideByCategory = categories.reduce((acc, category) => {
    if (category !== "All") {
      acc[category] = prideEntries.filter(
        (pride) => pride.category === category
      );
    }
    return acc;
  }, {});

  // Group pride entries for display: 1 large + 2 small
  const groupedPrideEntries = [];
  const MAX_VISIBLE = 3; // Show max 3 items before "View More"

  for (
    let i = 0;
    i < Math.min(filteredPrideEntries.length, MAX_VISIBLE);
    i += 3
  ) {
    groupedPrideEntries.push({
      large: filteredPrideEntries[i],
      small1: filteredPrideEntries[i + 1],
      small2: filteredPrideEntries[i + 2],
    });
  }

  const openModalForCategory = (category) => {
    setCurrentModalCategory(category);
    setModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 bg-white rounded-xl shadow-sm max-w-md mx-auto">
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
        <p className="text-gray-600">
          Unable to load pride entries. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <section className="mx-auto md:px-24 py-[5rem] bg-accent-cream">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-medium text-primary">
          THE PRIDE OF THE WORLD
        </h2>
        <div className="flex justify-center items-center gap-4 mt-4">
          <img src={Diamond} alt="Diamond icon" className="w-4 h-4" />
          <span className="text-primary font-medium text-2xl">IN CATEGORY</span>
          <img src={Diamond} alt="Diamond icon" className="w-4 h-4" />
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col md:flex-row justify-center gap-4 mb-8 px-4">
        <div className="flex-1 max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-white border border-gray-300 text-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Country
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full bg-white border border-gray-300 text-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pride Entries Grid */}
      <div className="mx-5">
        {filteredPrideEntries.length > 0 ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {groupedPrideEntries.map((group, index) => (
                <React.Fragment key={index}>
                  {/* Large Pride Entry (Left Side, Half Width, Square Image) */}
                  <div>
                    {group.large && (
                      <AwardCard pride={group.large} layoutType={1} />
                    )}
                  </div>
                  {/* Two Smaller Pride Entries (Right Side, Stacked, Square Images) */}
                  <div className="grid grid-rows-2 gap-6">
                    {group.small1 && (
                      <AwardCard pride={group.small1} layoutType={2} />
                    )}
                    {group.small2 && (
                      <AwardCard pride={group.small2} layoutType={2} />
                    )}
                  </div>
                </React.Fragment>
              ))}
            </div>

            {/* View More Button */}
            {filteredPrideEntries.length > MAX_VISIBLE &&
              selectedCategory !== "All" && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => openModalForCategory(selectedCategory)}
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white font-medium px-6 py-3 rounded-full transition-colors shadow-md">
                    View More {selectedCategory} Pride Entries
                  </button>
                </div>
              )}
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="mx-auto w-24 h-24 bg-accent-cream rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-primary"
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
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No pride entries found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Try adjusting your filters or check back later for new pride
              entries.
            </p>
          </div>
        )}
      </div>

      {/* Modal for View More */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold text-primary">
                {currentModalCategory} Pride Entries
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prideByCategory[currentModalCategory]?.map((pride) => (
                <AwardCard key={pride._id} pride={pride} layoutType={1} />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default GlobalPrideCategory;
