import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";

const backendURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:3001";

const AwardCard = ({ award }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col group">
      <div className="relative w-full aspect-[4/3]">
        <img
          src={award.image}
          alt={award.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = "/images/awards/default.jpg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <span className="inline-block text-xs font-medium text-white bg-primary px-3 py-1 rounded-full mb-2">
            {award.category}
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            {award.name}
          </h3>
        </div>
      </div>
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <div className="mb-4">
          <p className="text-primary font-medium mb-2 first-letter:uppercase">
            {award.award}
          </p>
          <p className="text-gray-600 text-xs sm:text-sm line-clamp-3 first-letter:uppercase">
            {award.description}
          </p>
        </div>
        <div className="mt-auto flex justify-between items-center">
          <span className="text-xs font-semibold text-gray-500">
            {award.year}
          </span>
          <Link
            to={`/singleAward/Award-details/${award.slug}`}
            className="inline-flex items-center text-primary hover:text-primary/80 font-semibold text-xs sm:text-sm font-medium"
            aria-label={`Read more about ${award.name}'s ${award.award}`}>
            Read More.. <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

const SingleCountryAward = () => {
  const { country } = useParams();
  const navigate = useNavigate();
  const [awards, setAwards] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${backendURL}/api/getAwards`);
        if (!res.ok) {
          throw new Error("Failed to fetch awards");
        }
        const data = await res.json();
        const countryAwards = data.awards.filter(
          (award) => award.country.toLowerCase() === country.toLowerCase()
        );

        setAwards(countryAwards);

        const uniqueCategories = [
          ...new Set(countryAwards.map((award) => award.category)),
        ].sort();
        setCategories(uniqueCategories);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching awards:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAwards();
  }, [country]);

  const awardsByCategory = categories.reduce((acc, category) => {
    acc[category] = awards.filter((award) => award.category === category);
    return acc;
  }, {});

  const formatCountryName = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <section className="mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-accent-cream mt-12">
      <div className="mb-6 sm:mb-8">
        <button
          onClick={() =>
            navigate(`/continent/${awards[0]?.continent.toLowerCase()}`)
          }
          className="flex items-center text-primary hover:text-primary/80 text-xs sm:text-sm">
          <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
          Back to {awards[0]?.continent} Countries
        </button>
      </div>

      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-4 uppercase">
          PRIDE OF {formatCountryName(country)}
        </h1>
        <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto">
          Celebrating excellence in {formatCountryName(country)} across various
          categories.
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg sm:text-xl text-gray-700">
              Loading awards...
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
              Unable to load awards. Please try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 sm:px-6 py-1.5 sm:py-2 bg-sunlit-gold text-primary rounded-lg font-medium hover:bg-secondary transition-colors text-xs sm:text-sm">
              Retry
            </button>
          </div>
        ) : awards.length > 0 ? (
          <div className="space-y-12">
            {categories.map((category) => (
              <div key={category}>
                <h2 className="text-lg sm:text-xl font-semibold text-primary mb-4 sm:mb-6">
                  {category} Awards
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {awardsByCategory[category].slice(0, 3).map((award) => (
                    <AwardCard key={award._id} award={award} />
                  ))}
                </div>
                {awardsByCategory[category].length > 3 && (
                  <div className="text-center mt-6 sm:mt-8">
                    <button
                      onClick={() =>
                        navigate(
                          `/country/${country.toLowerCase()}/category/${category.toLowerCase()}`
                        )
                      }
                      className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-sunlit-gold hover:bg-secondary text-primary font-medium rounded-lg shadow-md transition-colors text-xs sm:text-sm">
                      View All {category} Awards
                    </button>
                  </div>
                )}
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
              No awards found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto text-xs sm:text-sm">
              No awards are available for this country yet. Check back later.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SingleCountryAward;
