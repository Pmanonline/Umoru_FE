import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Heart,
  Calendar,
  User,
  Clock,
  Grid,
  List,
  X,
} from "lucide-react";
import { Alert, AlertDescription } from "../components/tools/Alert";
import { CheckCircle, AlertCircle } from "lucide-react";
import ResourcesImage from "../assets/images/resources2.jpg";
import backendURL from "../config";
import LoaddingSpinner from "../components/tools/LoaddingSpinner";

const EventsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEventType, setSelectedEventType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favoriteEvents");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const eventTypes = [
    { value: "all", label: "All Event Types" },
    { value: "conference", label: "Conference" },
    { value: "workshop", label: "Workshop" },
    { value: "seminar", label: "Seminar" },
    { value: "webinar", label: "Webinar" },
    { value: "other", label: "Other" },
  ];

  useEffect(() => {
    localStorage.setItem("favoriteEvents", JSON.stringify([...favorites]));
  }, [favorites]);

  const showAlertMessage = useCallback((message, variant) => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${backendURL}/api/getEvents`);
        const data = await res.json();
        console.log("Fetched events:", data);
        if (res.ok && data.events) {
          setEvents(data.events);
        } else {
          throw new Error(data.message || "Failed to fetch events");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        showAlertMessage("Failed to fetch events", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [showAlertMessage]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape" && showModal) {
        setShowModal(false);
        setSelectedEvent(null);
      }
    },
    [showModal]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const stripHtml = (html) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const currentDate = new Date("2025-08-25");
  const upcomingEvents = events.filter(
    (event) => new Date(event.date) >= currentDate
  );
  const pastEvents = events.filter(
    (event) => new Date(event.date) < currentDate
  );

  const filteredUpcomingEvents = upcomingEvents
    .filter((event) => {
      const speakerNames = event.speakers
        .map((s) => s.name)
        .join(" ")
        .toLowerCase();
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        speakerNames.includes(searchTerm.toLowerCase());
      const matchesEventType =
        selectedEventType === "all" ||
        (event.eventType || "conference").toLowerCase() ===
          selectedEventType.toLowerCase();
      return matchesSearch && matchesEventType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.date) - new Date(a.date);
        case "oldest":
          return new Date(a.date) - new Date(b.date);
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const filteredPastEvents = pastEvents
    .filter((event) => {
      const speakerNames = event.speakers
        .map((s) => s.name)
        .join(" ")
        .toLowerCase();
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        speakerNames.includes(searchTerm.toLowerCase());
      const matchesEventType =
        selectedEventType === "all" ||
        (event.eventType || "conference").toLowerCase() ===
          selectedEventType.toLowerCase();
      return matchesSearch && matchesEventType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.date) - new Date(a.date);
        case "oldest":
          return new Date(a.date) - new Date(b.date);
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedEventType("all");
    setSortBy("newest");
    setShowFilters(false);
  };

  const toggleFavorite = (eventId) => {
    setFavorites((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-accent-cream dark:bg-accent-creamDark">
        <LoaddingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-accent-cream dark:bg-accent-creamDark text-primary-dark dark:text-white">
      {/* Hero Section */}
      <div className="relative min-h-[50vh] bg-primary-dark dark:bg-primary-darkMode bg-hero-gradient dark:bg-hero-gradient-dark overflow-hidden">
        <img
          src={ResourcesImage}
          alt="Events background"
          className="absolute inset-0 w-full h-full object-cover opacity-20 z-0"
        />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 z-10 max-w-7xl">
          <div className="text-center text-white">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-primary-light">
              Umoru Events
            </h1>
            <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto">
              Join Our Exciting Events to Learn, Connect, and Innovate
            </p>
            <div className="flex justify-center gap-4 sm:gap-6 text-sm sm:text-base">
              <div className="flex items-center px-3 sm:px-4 py-2 rounded-full bg-white/20 dark:bg-primary-darkMode/20 backdrop-blur-sm">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-accent-teal" />
                <span>{events.length} Events</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-6xl">
        {/* Controls Bar */}
        <div className="sticky top-0 z-40 bg-accent-cream/95 dark:bg-accent-creamDark/95 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-800/20 shadow-lg mb-6 sm:mb-8 p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex-1 min-w-[16rem] sm:min-w-[20rem]">
              <div className="relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-accent-charcoal dark:text-white" />
                <input
                  type="text"
                  placeholder="Search events or speakers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-[50] pl-10 sm:pl-12 pr-4 py-2 sm:py-3 rounded-xl border-2 border-accent-charcoal/20 dark:border-gray-800/20 bg-white/90 dark:bg-gray-800/90 text-primary-dark dark:text-white placeholder-accent-charcoal/50 dark:placeholder-white/50 focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all"
                  aria-label="Search events or speakers"
                />
              </div>
            </div>
            <button
              onClick={() => {
                console.log(
                  "Toggling showFilters from",
                  showFilters,
                  "to",
                  !showFilters
                );
                setShowFilters(!showFilters);
              }}
              className="md:hidden flex items-center px-3 sm:px-4 py-2 sm:py-3 rounded-xl border-2 border-accent-charcoal/20 dark:border-gray-800/20 bg-white/90 dark:bg-gray-800/90 text-primary-dark dark:text-white hover:bg-primary-light/20 dark:hover:bg-primary-darkMode/20 transition-all focus:ring-2 focus:ring-primary-light"
              aria-label="Toggle filters">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-accent-teal" />
              Filters
            </button>
            <div className="flex items-center space-x-2">
              <div className="flex rounded-xl p-1 bg-accent-cream/70 dark:bg-accent-creamDark/70">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-primary-light text-white" : "text-accent-charcoal dark:text-white hover:bg-primary-light/20 dark:hover:bg-primary-darkMode/20"} focus:ring-2 focus:ring-primary-light`}
                  aria-label="Grid view">
                  <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-primary-light text-white" : "text-accent-charcoal dark:text-white hover:bg-primary-light/20 dark:hover:bg-primary-darkMode/20"} focus:ring-2 focus:ring-primary-light`}
                  aria-label="List view">
                  <List className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
          <div
            className={`mt-4 pt-4 border-t border-accent-charcoal/20 dark:border-gray-800/20 ${showFilters ? "block" : "hidden"} md:block`}>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <select
                value={selectedEventType}
                onChange={(e) => setSelectedEventType(e.target.value)}
                className="px-3 sm:px-4 py-2 sm:py-3 rounded-xl border-2 border-accent-charcoal/20 dark:border-gray-800/20 bg-white/90 dark:bg-gray-800/90 text-primary-dark dark:text-white focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all w-full sm:w-auto"
                aria-label="Select event type">
                {eventTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 sm:px-4 py-2 sm:py-3 rounded-xl border-2 border-accent-charcoal/20 dark:border-gray-800/20 bg-white/90 dark:bg-gray-800/90 text-primary-dark dark:text-white focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all w-full sm:w-auto"
                aria-label="Sort by">
                {[
                  { value: "newest", label: "Newest First" },
                  { value: "oldest", label: "Oldest First" },
                  { value: "title", label: "Alphabetical" },
                ].map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {(searchTerm ||
                selectedEventType !== "all" ||
                sortBy !== "newest") && (
                <button
                  onClick={clearFilters}
                  className="px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-primary-light hover:text-primary-dark dark:hover:text-white font-medium transition-colors focus:ring-2 focus:ring-primary-light"
                  aria-label="Clear filters">
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mb-4 sm:mb-6">
          <p className="text-base sm:text-lg text-accent-charcoal dark:text-white">
            Showing {filteredUpcomingEvents.length + filteredPastEvents.length}{" "}
            of {events.length} events
          </p>
        </div>

        {/* Upcoming Events Section */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-primary-dark dark:text-white">
            Upcoming Events
          </h2>
          {filteredUpcomingEvents.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="text-6xl sm:text-8xl mb-4 sm:mb-6 text-accent-charcoal dark:text-white">
                📅
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 text-primary-dark dark:text-white">
                No upcoming events found
              </h3>
              <p className="text-base sm:text-lg text-accent-charcoal dark:text-white mb-4 sm:mb-6 max-w-md mx-auto">
                Try adjusting your search terms or filters
              </p>
              <button
                onClick={clearFilters}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-primary to-secondary text-white dark:text-white rounded-xl font-semibold text-sm sm:text-base hover:from-primary-light hover:to-secondary-light transition-all focus:ring-2 focus:ring-primary-light"
                aria-label="Clear all filters">
                Clear All Filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredUpcomingEvents.map((event) => (
                <div
                  key={event._id}
                  className="group bg-accent-cream dark:bg-accent-creamDark rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-gray-800/20">
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                    <img
                      src={event.image || ResourcesImage}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent"></div>
                    <button
                      onClick={() => toggleFavorite(event._id)}
                      className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 rounded-full bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm hover:bg-white/30 dark:hover:bg-gray-700/30 transition-colors focus:ring-2 focus:ring-primary-light"
                      aria-label={`Toggle favorite for ${event.title}`}>
                      <Heart
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${favorites.has(event._id) ? "fill-secondary text-secondary" : "text-white dark:text-white"}`}
                      />
                    </button>
                  </div>
                  <div className="p-4 sm:p-5">
                    <h3 className="font-bold text-base sm:text-lg lg:text-xl mb-2 line-clamp-2 group-hover:text-primary-light transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-sm sm:text-base text-accent-charcoal dark:text-white mb-3 line-clamp-2">
                      {stripHtml(event.content)}
                    </p>
                    <div className="flex flex-wrap items-center text-xs sm:text-sm text-accent-charcoal/80 dark:text-white/80 mb-3 sm:mb-4 gap-2 sm:gap-4">
                      <span className="flex items-center">
                        <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-accent-teal" />
                        {event.speakers.map((s) => s.name).join(", ")}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-accent-teal" />
                        {formatDate(event.date)}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowModal(true);
                      }}
                      className="flex-1 flex items-center justify-center px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-primary to-secondary text-white dark:text-white rounded-xl font-semibold text-sm sm:text-base hover:from-primary-light hover:to-secondary-light transition-all focus:ring-2 focus:ring-primary-light"
                      aria-label={`View details for ${event.title}`}>
                      Read More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-5">
              {filteredUpcomingEvents.map((event) => (
                <div
                  key={event._id}
                  className="bg-accent-cream dark:bg-accent-creamDark rounded-2xl p-4 sm:p-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-gray-800/20">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    <div className="flex-shrink-0 w-20 h-20 sm:w-16 sm:h-16 rounded-xl overflow-hidden">
                      <img
                        src={event.image || ResourcesImage}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
                        <div className="w-full">
                          <h3 className="font-bold text-base sm:text-lg mb-1 text-primary-dark dark:text-white line-clamp-2">
                            {event.title}
                          </h3>
                          <p className="text-sm sm:text-base text-accent-charcoal dark:text-white mb-2 sm:mb-3 line-clamp-2 overflow-hidden text-ellipsis">
                            {stripHtml(event.content)}
                          </p>
                          <div className="flex flex-wrap items-center text-xs sm:text-sm text-accent-charcoal/80 dark:text-white/80 gap-2 sm:gap-3">
                            <span className="flex items-center">
                              <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-accent-teal" />
                              {event.speakers.map((s) => s.name).join(", ")}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-accent-teal" />
                              {event.duration || "N/A"}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-accent-teal" />
                              {formatDate(event.date)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
                          <button
                            onClick={() => toggleFavorite(event._id)}
                            className="p-2 sm:p-3 rounded-full bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm hover:bg-white/30 dark:hover:bg-gray-700/30 transition-colors focus:ring-2 focus:ring-primary-light"
                            aria-label={`Toggle favorite for ${event.title}`}>
                            <Heart
                              className={`w-4 h-4 sm:w-5 sm:h-5 ${favorites.has(event._id) ? "fill-secondary text-secondary" : "text-accent-charcoal dark:text-white"}`}
                            />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedEvent(event);
                              setShowModal(true);
                            }}
                            className="flex items-center px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-primary to-secondary text-white dark:text-white rounded-xl font-semibold text-sm sm:text-base hover:from-primary-light hover:to-secondary-light transition-all focus:ring-2 focus:ring-primary-light"
                            aria-label={`View details for ${event.title}`}>
                            Read More
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Past Events Section */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-primary-dark dark:text-white">
            Past Events
          </h2>
          {filteredPastEvents.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="text-6xl sm:text-8xl mb-4 sm:mb-6 text-accent-charcoal dark:text-white">
                📅
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 text-primary-dark dark:text-white">
                No past events found
              </h3>
              <p className="text-base sm:text-lg text-accent-charcoal dark:text-white mb-4 sm:mb-6 max-w-md mx-auto">
                Try adjusting your search terms or filters
              </p>
              <button
                onClick={clearFilters}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-primary to-secondary text-white dark:text-white rounded-xl font-semibold text-sm sm:text-base hover:from-primary-light hover:to-secondary-light transition-all focus:ring-2 focus:ring-primary-light"
                aria-label="Clear all filters">
                Clear All Filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredPastEvents.map((event) => (
                <div
                  key={event._id}
                  className="group bg-accent-cream dark:bg-accent-creamDark rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-gray-800/20">
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                    <img
                      src={event.image || ResourcesImage}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent"></div>
                    <button
                      onClick={() => toggleFavorite(event._id)}
                      className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 rounded-full bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm hover:bg-white/30 dark:hover:bg-gray-700/30 transition-colors focus:ring-2 focus:ring-primary-light"
                      aria-label={`Toggle favorite for ${event.title}`}>
                      <Heart
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${favorites.has(event._id) ? "fill-secondary text-secondary" : "text-white dark:text-white"}`}
                      />
                    </button>
                  </div>
                  <div className="p-4 sm:p-5">
                    <h3 className="font-bold text-base sm:text-lg lg:text-xl mb-2 line-clamp-2 group-hover:text-primary-light transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-sm sm:text-base text-accent-charcoal dark:text-white mb-3 line-clamp-2">
                      {stripHtml(event.content)}
                    </p>
                    <div className="flex flex-wrap items-center text-xs sm:text-sm text-accent-charcoal/80 dark:text-white/80 mb-3 sm:mb-4 gap-2 sm:gap-4">
                      <span className="flex items-center">
                        <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-accent-teal" />
                        {event.speakers.map((s) => s.name).join(", ")}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-accent-teal" />
                        {formatDate(event.date)}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowModal(true);
                      }}
                      className="flex-1 flex items-center justify-center px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-primary to-secondary text-white dark:text-white rounded-xl font-semibold text-sm sm:text-base hover:from-primary-light hover:to-secondary-light transition-all focus:ring-2 focus:ring-primary-light"
                      aria-label={`View details for ${event.title}`}>
                      Read More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-5">
              {filteredPastEvents.map((event) => (
                <div
                  key={event._id}
                  className="bg-accent-cream dark:bg-accent-creamDark rounded-2xl p-4 sm:p-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-gray-800/20">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    <div className="flex-shrink-0 w-20 h-20 sm:w-16 sm:h-16 rounded-xl overflow-hidden">
                      <img
                        src={event.image || ResourcesImage}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
                        <div className="w-full">
                          <h3 className="font-bold text-base sm:text-lg mb-1 text-primary-dark dark:text-white line-clamp-2">
                            {event.title}
                          </h3>
                          <p className="text-sm sm:text-base text-accent-charcoal dark:text-white mb-2 sm:mb-3 line-clamp-2 overflow-hidden text-ellipsis">
                            {stripHtml(event.content)}
                          </p>
                          <div className="flex flex-wrap items-center text-xs sm:text-sm text-accent-charcoal/80 dark:text-white/80 gap-2 sm:gap-3">
                            <span className="flex items-center">
                              <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-accent-teal" />
                              {event.speakers.map((s) => s.name).join(", ")}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-accent-teal" />
                              {event.duration || "N/A"}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-accent-teal" />
                              {formatDate(event.date)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
                          <button
                            onClick={() => toggleFavorite(event._id)}
                            className="p-2 sm:p-3 rounded-full bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm hover:bg-white/30 dark:hover:bg-gray-700/30 transition-colors focus:ring-2 focus:ring-primary-light"
                            aria-label={`Toggle favorite for ${event.title}`}>
                            <Heart
                              className={`w-4 h-4 sm:w-5 sm:h-5 ${favorites.has(event._id) ? "fill-secondary text-secondary" : "text-accent-charcoal dark:text-white"}`}
                            />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedEvent(event);
                              setShowModal(true);
                            }}
                            className="flex items-center px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-primary to-secondary text-white dark:text-white rounded-xl font-semibold text-sm sm:text-base hover:from-primary-light hover:to-secondary-light transition-all focus:ring-2 focus:ring-primary-light"
                            aria-label={`View details for ${event.title}`}>
                            Read More
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {events.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <div className="text-6xl sm:text-8xl mb-4 sm:mb-6 text-accent-charcoal dark:text-white">
              📅
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 text-primary-dark dark:text-white">
              No events found
            </h3>
            <p className="text-base sm:text-lg text-accent-charcoal dark:text-white mb-4 sm:mb-6 max-w-md mx-auto">
              Check back later for upcoming events!
            </p>
            <button
              onClick={clearFilters}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-primary to-secondary text-white dark:text-white rounded-xl font-semibold text-sm sm:text-base hover:from-primary-light hover:to-secondary-light transition-all focus:ring-2 focus:ring-primary-light"
              aria-label="Clear all filters">
              Clear All Filters
            </button>
          </div>
        )}

        {showModal && selectedEvent && (
          <div
            className="fixed inset-0 bg-dark/50 dark:bg-dark/70 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
            role="dialog"
            aria-labelledby="modal-title"
            aria-modal="true">
            <div
              className="max-w-md w-full rounded-xl shadow-2xl bg-accent-cream dark:bg-accent-creamDark border border-white/20 dark:border-gray-800/20"
              onClick={(e) => e.stopPropagation()}>
              <div className="p-4 sm:p-5">
                <div className="flex justify-between items-start mb-3 sm:mb-4">
                  <h4
                    id="modal-title"
                    className="text-base sm:text-lg lg:text-xl font-semibold text-primary-dark dark:text-white">
                    Event Details
                  </h4>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 rounded-lg hover:bg-primary-light/10 dark:hover:bg-primary-darkMode/10 transition-colors focus:ring-2 focus:ring-primary-light"
                    aria-label="Close modal">
                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-accent-charcoal dark:text-white" />
                  </button>
                </div>
                <div className="mb-3 sm:mb-4">
                  <h5 className="font-medium text-sm sm:text-base lg:text-lg mb-2 text-primary-dark dark:text-white">
                    {selectedEvent.title}
                  </h5>
                  <p className="text-xs sm:text-sm text-accent-charcoal dark:text-white">
                    Event Type:{" "}
                    {eventTypes.find(
                      (type) =>
                        type.value === (selectedEvent.eventType || "conference")
                    )?.label || "Conference"}
                  </p>
                  <p className="text-xs sm:text-sm text-accent-charcoal dark:text-white">
                    Speakers:{" "}
                    {selectedEvent.speakers.map((s) => s.name).join(", ")}
                  </p>
                  <p className="text-xs sm:text-sm text-accent-charcoal dark:text-white">
                    Date: {formatDate(selectedEvent.date)}
                  </p>
                  <p className="text-xs sm:text-sm text-accent-charcoal dark:text-white">
                    Duration: {selectedEvent.duration || "N/A"}
                  </p>
                </div>
                <div className="flex gap-2 sm:gap-3">
                  <button
                    onClick={() =>
                      navigate(
                        `/SingleEvent/${selectedEvent.slug || selectedEvent._id}`
                      )
                    }
                    className="flex-1 flex items-center justify-center px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-primary to-secondary text-white dark:text-white rounded-xl font-semibold text-sm sm:text-base hover:from-primary-light hover:to-secondary-light transition-all focus:ring-2 focus:ring-primary-light"
                    aria-label={`Read more about ${selectedEvent.title}`}>
                    Read More
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border-2 border-accent-charcoal/20 dark:border-gray-800/20 text-accent-charcoal dark:text-white hover:bg-primary-light/10 dark:hover:bg-primary-darkMode/10 transition-colors text-sm sm:text-base focus:ring-2 focus:ring-primary-light"
                    aria-label="Cancel">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showAlert && (
          <Alert
            variant={alertConfig.variant}
            show={showAlert}
            onClose={() => setShowAlert(false)}
            autoClose={true}
            autoCloseTime={5000}>
            <AlertDescription>{alertConfig.message}</AlertDescription>
            {alertConfig.variant === "success" ? (
              <CheckCircle className="w-5 h-5 text-accent-green ml-2" />
            ) : (
              <AlertCircle className="w-5 h-5 text-accent-red ml-2" />
            )}
          </Alert>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
