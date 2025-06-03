import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt, FaGlobeAfrica } from "react-icons/fa";
import {
  Award,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Globe,
  Users,
} from "lucide-react";

const backendURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:3001";

const NationalAwards = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [states, setStates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch states from the backend
  useEffect(() => {
    const fetchStates = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${backendURL}/api/getAwards`);
        if (!res.ok) {
          throw new Error("Failed to fetch awards");
        }
        const data = await res.json();
        const stateData = data.awards;

        // Extract unique state names and add Diaspora
        const uniqueStates = [
          ...new Set(stateData.map((award) => award.state).filter(Boolean)),
          "Diaspora",
        ].sort();

        // Map state names to objects with name and image
        const stateObjects = uniqueStates.map((state) => ({
          name: state,
          image:
            "https://imgs.search.brave.com/luHZr0M3yPIrZhEOpoqvoq_M-uvV37IlLWrQ2mZcTT4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy8x/LzFlL0ppZ2F3YV9T/dGF0ZV9GbGFnLnBu/Zw",
        }));

        setStates(stateObjects);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching states:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStates();
  }, []);

  const filteredStates = states.filter((state) =>
    state.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubscribe = (e) => {
    e.preventDefault();
    // In a real app, you would send this to your backend
    console.log("Subscribed with:", email);
    setIsSubscribed(true);
    setEmail("");
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  const handleStateClick = (stateName) => {
    navigate(`/regionalAward/${stateName.replace(/\s+/g, "-").toLowerCase()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 to-green-950 text-white mt-20">
      {/* Header */}
      <header className="py-8 px-4 text-center">
        <div className="md:flex justify-center items-center mb-4">
          <img src="/logo.png" alt="Pride of Nigeria" className="h-16 mr-3" />
          <h1 className="text-3xl md:text-4xl font-bold">
            PRIDE OF NIGERIA{" "}
            <span className="text-yellow-400">REGIONAL AWARDS</span>
          </h1>
        </div>
        <p className="text-lg max-w-2xl mx-auto">
          Celebrating outstanding individuals making a difference across
          Nigeria's regions
        </p>
      </header>

      {/* Search and Filter */}
      <div className="max-w-4xl mx-auto px-4 mb-12">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search for a region..."
            className="w-full pl-10 pr-4 py-3 rounded-full bg-green-800 border border-green-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white placeholder-green-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* States Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        {isLoading ? (
          <div className="text-center py-12">
            <div
              class
              className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl">Loading regions...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-xl text-red-400">Error: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-yellow-500 text-green-900 rounded-full font-bold hover:bg-yellow-600 transition-colors">
              Retry
            </button>
          </div>
        ) : filteredStates.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredStates.map((state) => (
              <div
                key={state.name}
                onClick={() => handleStateClick(state.name)}
                className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-2 hover:border-white">
                <div className="aspect-w-1 aspect-h-1">
                  <img
                    src={state.image}
                    alt={state.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-70"
                    onError={(e) => {
                      e.target.src = "/images/regions/default.jpg";
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="text-yellow-400 mr-2" />
                    <h3 className="text-xl font-bold text-white">
                      {state.name.toUpperCase()}
                    </h3>
                  </div>
                  <div className="mt-2 text-sm text-green-200">
                    PRIDE OF {state.name.toUpperCase()} AWARD
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl">No regions found matching "{searchTerm}"</p>
            <button
              onClick={() => setSearchTerm("")}
              className="mt-4 px-6 py-2 bg-yellow-500 text-green-900 rounded-full font-bold hover:bg-yellow-600 transition-colors">
              Clear Search
            </button>
          </div>
        )}
      </div>

      {/* Enhanced Diaspora Section */}
      <div className="bg-gradient-to-r from-green-800 to-green-700 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Diaspora Award Card */}
            <div className="lg:w-2/3 bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-green-600/30">
              <div className="p-8 md:p-10">
                <div className="flex items-center mb-6">
                  <div className="bg-yellow-500 p-3 rounded-full mr-4">
                    <FaGlobeAfrica className="text-2xl text-green-900" />
                  </div>
                  <h2 className="text-3xl font-bold">
                    PRIDE OF NIGERIAN DIASPORA AWARD
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-lg mb-6">
                      Celebrating Nigerians worldwide who are making exceptional
                      contributions to their communities while promoting
                      Nigeria's positive image globally.
                    </p>
                    <button
                      onClick={() => navigate("/regionalAward/diaspora")}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-green-900 font-bold rounded-lg transition-all">
                      <Users className="w-5 h-5" />
                      View Diaspora Honorees
                    </button>
                  </div>

                  <div className="border-l border-green-600/30 pl-8">
                    <h3 className="text-xl font-semibold mb-4">
                      Recent Honorees
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                        <span>
                          Dr. Ngozi Okonjo-Iweala - WTO Director-General
                        </span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                        <span>
                          Chimamanda Ngozi Adichie - Author & Activist
                        </span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                        <span>John Boyega - Actor & Producer</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-green-900/50 p-4 border-t border-green-600/30">
                <div className="flex justify-center space-x-6">
                  <a
                    href="#"
                    className="hover:text-yellow-400 transition-colors">
                    <Facebook className="w-6 h-6" />
                  </a>
                  <a
                    href="#"
                    className="hover:text-yellow-400 transition-colors">
                    <Twitter className="w-6 h-6" />
                  </a>
                  <a
                    href="#"
                    className="hover:text-yellow-400 transition-colors">
                    <Instagram className="w-6 h-6" />
                  </a>
                  <a
                    href="#"
                    className="hover:text-yellow-400 transition-colors">
                    <Linkedin className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>

            {/* Subscribe Card */}
            <div className="lg:w-1/3 bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-green-600/30">
              <div className="p-8 md:p-10">
                <div className="flex items-center mb-6">
                  <div className="bg-yellow-500 p-3 rounded-full mr-4">
                    <Mail className="text-2xl text-green-900" />
                  </div>
                  <h3 className="text-2xl font-bold">STAY CONNECTED</h3>
                </div>

                {isSubscribed ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold mb-2">Thank You!</h4>
                    <p>You've been subscribed to our updates.</p>
                  </div>
                ) : (
                  <>
                    <p className="mb-6">
                      Get the latest news about our diaspora honorees and award
                      events.
                    </p>
                    <form onSubmit={handleSubscribe}>
                      <div className="mb-4">
                        <input
                          type="email"
                          placeholder="Your email address"
                          className="w-full px-4 py-3 bg-green-800/50 border border-green-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-green-900 font-bold rounded-lg transition-colors">
                        Subscribe Now
                      </button>
                    </form>
                  </>
                )}

                <div className="mt-8 pt-6 border-t border-green-600/30">
                  <h4 className="font-semibold mb-3">QUICK LINKS</h4>
                  <ul className="space-y-2">
                    <li>
                      <a
                        href="#"
                        className="hover:text-yellow-400 transition-colors flex items-center">
                        <span className="w-1 h-1 bg-yellow-500 rounded-full mr-2"></span>
                        Nomination Criteria
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="hover:text-yellow-400 transition-colors flex items-center">
                        <span className="w-1 h-1 bg-yellow-500 rounded-full mr-2"></span>
                        Past Winners
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="hover:text-yellow-400 transition-colors flex items-center">
                        <span className="w-1 h-1 bg-yellow-500 rounded-full mr-2"></span>
                        Event Gallery
                      </a>
                    </li>
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

export default NationalAwards;
