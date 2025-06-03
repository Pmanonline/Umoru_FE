import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaGlobe } from "react-icons/fa";
import {
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Users,
} from "lucide-react";

const backendURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:3001";

// Memoized Continent Card Component
const ContinentCard = memo(({ continent, onClick }) => {
  const handleClick = useCallback(() => {
    onClick(continent.name);
  }, [continent.name, onClick]);

  return (
    <div
      onClick={handleClick}
      className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-2 hover:border-primary">
      <div className="aspect-w-1 aspect-h-1">
        <img
          src={continent.image}
          alt={continent.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-70"
          onError={(e) => {
            e.target.src = "/images/continents/default.jpg";
          }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
      <div className="absolute inset-0 flex flex-col justify-end p-4">
        <div className="flex items-center">
          <FaGlobe className="text-sunlit-gold mr-2" />
          <h3 className="text-lg sm:text-xl font-bold text-white">
            {continent.name.toUpperCase()}
          </h3>
        </div>
        <div className="mt-2 text-xs sm:text-sm text-gray-200">
          PRIDE OF {continent.name.toUpperCase()} AWARD
        </div>
      </div>
    </div>
  );
});

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
    {[...Array(6)].map((_, index) => (
      <div
        key={index}
        className="relative overflow-hidden rounded-xl shadow-lg bg-gray-200 animate-pulse">
        <div className="aspect-w-1 aspect-h-1 bg-gray-300"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-end p-4">
          <div className="h-5 w-3/4 bg-gray-400 rounded mb-2"></div>
          <div className="h-4 w-1/2 bg-gray-400 rounded"></div>
        </div>
      </div>
    ))}
  </div>
);

const ContinentAwardPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [continents, setContinents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContinents = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${backendURL}/api/getAwards`);
      if (!res.ok) {
        throw new Error("Failed to fetch awards");
      }
      const data = await res.json();
      const awardData = data.awards;

      const uniqueContinents = [
        ...new Set(awardData.map((award) => award.continent).filter(Boolean)),
      ].sort();

      const continentObjects = uniqueContinents.map((continent) => ({
        name: continent,
        image:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Hubble_ultra_deep_field.jpg/500px-Hubble_ultra_deep_field.jpg",
      }));

      setContinents(continentObjects);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching continents:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContinents();
  }, [fetchContinents]);

  const filteredContinents = useMemo(() => {
    return continents.filter((continent) =>
      continent.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [continents, searchTerm]);

  const handleSubscribe = useCallback(
    (e) => {
      e.preventDefault();
      console.log("Subscribed with:", email);
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    },
    [email]
  );

  const handleContinentClick = useCallback(
    (continentName) => {
      navigate(`/regionalAward/${continentName.toLowerCase()}`);
    },
    [navigate]
  );

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleEmailChange = useCallback((e) => {
    setEmail(e.target.value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  const handleReload = useCallback(() => {
    window.location.reload();
  }, []);

  const socialLinks = useMemo(
    () => [
      { icon: Facebook, href: "#" },
      { icon: Twitter, href: "#" },
      { icon: Instagram, href: "#" },
      { icon: Linkedin, href: "#" },
    ],
    []
  );

  const quickLinks = useMemo(
    () => [
      { text: "Nomination Criteria", href: "#" },
      { text: "Past Winners", href: "#" },
      { text: "Event Gallery", href: "#" },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-accent-cream mt-12">
      <header className="py-6 sm:py-8 px-4 text-center">
        <div className="md:flex justify-center items-center mb-4">
          <img
            src="/logo.png"
            alt="Pride of the World"
            className="h-12 sm:h-16 mr-3"
          />
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">
            PRIDE OF THE WORLD{" "}
            <span className="text-sunlit-gold">GLOBAL AWARDS</span>
          </h1>
        </div>
        <p className="text-base sm:text-lg max-w-2xl mx-auto text-gray-700">
          Celebrating outstanding individuals making a difference across the
          globe
        </p>
      </header>

      <div className="max-w-4xl mx-auto px-4 mb-12">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search for a continent..."
            className="w-full pl-10 pr-4 py-2 sm:py-3 rounded-full bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-gray-700 placeholder-gray-400 text-xs sm:text-sm"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-16">
        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-lg sm:text-xl text-unity-coral">
              Error: {error}
            </p>
            <button
              onClick={handleReload}
              className="mt-4 px-4 sm:px-6 py-1.5 sm:py-2 bg-sunlit-gold text-primary rounded-full font-bold hover:bg-secondary transition-colors text-xs sm:text-sm">
              Retry
            </button>
          </div>
        ) : filteredContinents.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredContinents.map((continent) => (
              <ContinentCard
                key={continent.name}
                continent={continent}
                onClick={handleContinentClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg sm:text-xl text-gray-700">
              No continents found matching "{searchTerm}"
            </p>
            <button
              onClick={handleClearSearch}
              className="mt-4 px-4 sm:px-6 py-1.5 sm:py-2 bg-sunlitgold/50 text-primary rounded-full font-bold hover:bg-secondary transition-colors text-xs sm:text-sm">
              Clear Search
            </button>
          </div>
        )}
      </div>

      <div className="bg-gray-50 py-12 sm:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
            <div className="lg:w-2/3 bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-gray-300/30">
              <div className="p-6 sm:p-8">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="bg-sunlit-gold p-2 sm:p-3 rounded-full mr-4">
                    <FaGlobe className="text-xl sm:text-2xl text-primary" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-blue-900">
                    PRIDE OF THE WORLD AWARD
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                  <div>
                    <p className="text-sm sm:text-base text-blue-900 mb-4 sm:mb-6">
                      Celebrating individuals worldwide who are making
                      exceptional contributions to their communities while
                      promoting global unity.
                    </p>
                    <button
                      onClick={() => navigate("/continent/global")}
                      className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white hover:bg-secondary  font-bold rounded-lg transition-all text-xs sm:text-sm">
                      <Users className="w-4 sm:w-5 h-4 sm:h-5" />
                      View Global Honorees
                    </button>
                  </div>

                  <div className="border-l border-gray-300/30 pl-6 sm:pl-8">
                    <h3 className="text-lg sm:text-xl font-semibold text-blue-900 mb-4">
                      Recent Honorees
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex items-center">
                        <div className="w-3 h-3 bg-sunlit-gold rounded-full mr-3"></div>
                        <span className="text-blue-900">
                          Dr. Tedros Adhanom Ghebreyesus - WHO Director-General
                        </span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-3 h-3 bg-sunlit-gold rounded-full mr-3"></div>
                        <span className="text-blue-900">
                          Malala Yousafzai - Education Activist
                        </span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-3 h-3 bg-sunlit-gold rounded-full mr-3"></div>
                        <span className="text-blue-900">
                          Elon Musk - Innovator & Entrepreneur
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 p-4 border-t border-gray-300/30">
                <div className="flex justify-center space-x-6">
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      className="hover:text-sunlit-gold transition-colors">
                      <link.icon className="w-5 sm:w-6 h-5 sm:h-6 text-white hover:text-secondary" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:w-1/3 bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-gray-300/30">
              <div className="p-6 sm:p-8">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="bg-sunlit-gold p-2 sm:p-3 rounded-full mr-4">
                    <Mail className="text-xl sm:text-2xl text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-2xl font-bold text-blue-900">
                    STAY CONNECTED
                  </h3>
                </div>

                {isSubscribed ? (
                  <div className="text-center py-6 sm:py-8">
                    <div className="w-12 sm:w-16 h-12 sm:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-6 sm:w-8 h-6 sm:h-8 text-blue-900"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h4 className="text-lg sm:text-xl font-semibold text-blue-900 mb-2">
                      Thank You!
                    </h4>
                    <p className="text-blue-900 text-xs sm:text-sm">
                      You've been subscribed to our updates.
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-blue-900 text-xs sm:text-sm mb-4 sm:mb-6">
                      Get the latest news about our global honorees and award
                      events.
                    </p>
                    <form onSubmit={handleSubscribe}>
                      <div className="mb-4">
                        <input
                          type="email"
                          placeholder="Your email address"
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-gray-300/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-sunlit-gold text-white placeholder-gray-400 text-xs sm:text-sm"
                          value={email}
                          onChange={handleEmailChange}
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white hover:bg-secondary  font-bold rounded-lg transition-colors text-xs sm:text-sm">
                        Subscribe Now
                      </button>
                    </form>
                  </>
                )}

                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-300/30">
                  <h4 className="font-semibold text-blue-900 mb-3 text-xs sm:text-sm">
                    QUICK LINKS
                  </h4>
                  <ul className="space-y-2">
                    {quickLinks.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.href}
                          className="hover:text-sunlit-gold transition-colors flex items-center text-blue-900 text-xs sm:text-sm">
                          <span className="w-1 h-1 bg-sunlit-gold rounded-full mr-2"></span>
                          {link.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContinentAwardPage;
