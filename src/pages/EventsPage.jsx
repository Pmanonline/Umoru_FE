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
    <div className="min-h-screen bg-accent-cream dark:bg-gray-600 text-primary-dark dark:text-white mt-12">
      {/* Hero Section - Compact */}
      <div className="relative bg-primary-dark dark:bg-primary-darkMode bg-hero-gradient dark:bg-hero-gradient-dark overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative container mx-auto px-4 py-12 z-10 max-w-6xl">
          <div className="text-center text-white">
            <h1 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-primary-light">
              Umoru Events
            </h1>
            <p className="text-sm mb-6 opacity-90 max-w-lg mx-auto">
              Join Our Exciting Events to Learn, Connect, and Innovate
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <div className="flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                <Calendar className="w-3 h-3 mr-1 text-accent-teal" />
                <span>{events.length} Events</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Compact Controls Bar */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border shadow-sm mb-4 p-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events or speakers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-primary-dark dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-primary-dark dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
              <Filter className="w-4 h-4 mr-1" />
              Filters
            </button>

            <div className="flex items-center space-x-1">
              <div className="flex rounded-lg p-0.5 bg-gray-100 dark:bg-gray-700">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md transition-all text-xs ${viewMode === "grid" ? "bg-primary text-white" : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`}>
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-md transition-all text-xs ${viewMode === "list" ? "bg-primary text-white" : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`}>
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div
            className={`mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 ${showFilters ? "block" : "hidden"} md:block`}>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedEventType}
                onChange={(e) => setSelectedEventType(e.target.value)}
                className="px-2 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-primary-dark dark:text-white focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all">
                {eventTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-primary-dark dark:text-white focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all">
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
                  className="px-2 py-1.5 text-xs text-primary-light hover:text-primary-dark dark:hover:text-white font-medium transition-colors">
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mb-3">
          <p className="text-sm text-gray-600 dark:text-gray-300">
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
            <div className="text-center py-12">
              <div className="text-4xl mb-3 text-gray-400">📅</div>
              <h3 className="text-lg font-semibold mb-2 text-primary-dark dark:text-white">
                No upcoming events found
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
                Try adjusting your search terms or filters
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium text-sm hover:from-primary-light hover:to-secondary-light transition-all">
                Clear All Filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredUpcomingEvents.map((event) => (
                <div
                  key={event._id}
                  className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700">
                  {/* Image Section */}
                  <div className="relative h-28 overflow-hidden">
                    <img
                      src={event.image || ResourcesImage}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(event._id)}
                      className="absolute bottom-2 right-2 p-1.5 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors">
                      <Heart
                        className={`w-4 h-4 ${
                          favorites.has(event._id)
                            ? "fill-red-500 text-red-500"
                            : "text-white"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Content Section */}
                  <div className="p-3 space-y-2">
                    {/* Title */}
                    <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                      {event.title}
                    </h3>

                    {/* Short description */}
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-snug">
                      {stripHtml(event.content)}
                    </p>

                    {/* Speakers */}
                    {event.speakers?.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          Speakers
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {event.speakers.map((s, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-md p-1.5">
                              <img
                                src={s.image || "/default-avatar.png"}
                                alt={s.name}
                                className="w-6 h-6 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                                onError={(e) => {
                                  e.currentTarget.src = "/default-avatar.png";
                                }}
                              />
                              <span className="text-xs text-gray-800 dark:text-gray-200 truncate">
                                {s.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Date & Time */}
                    <div className="space-y-1">
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(event.date).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </div>
                    </div>

                    {/* Read More Button */}
                    <button
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowModal(true);
                      }}
                      className="w-full flex items-center justify-center px-3 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium text-xs hover:from-primary-light hover:to-secondary-light transition-all">
                      Read More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredUpcomingEvents.map((event) => (
                <div
                  key={event._id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden">
                      <img
                        src={event.image || ResourcesImage}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm mb-0.5 text-primary-dark dark:text-white line-clamp-1">
                            {event.title}
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 line-clamp-1">
                            {stripHtml(event.content)}
                          </p>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-3">
                            <span className="flex items-center">
                              <User className="w-2.5 h-2.5 mr-1" />
                              {event.speakers.map((s) => s.name).join(", ")}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-2.5 h-2.5 mr-1" />
                              {formatDate(event.date)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleFavorite(event._id)}
                            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <Heart
                              className={`w-3.5 h-3.5 ${favorites.has(event._id) ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                            />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedEvent(event);
                              setShowModal(true);
                            }}
                            className="flex items-center px-3 py-1.5 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium text-xs hover:from-primary-light hover:to-secondary-light transition-all">
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
            <div className="text-center py-12">
              <div className="text-4xl mb-3 text-gray-400">📅</div>
              <h3 className="text-lg font-semibold mb-2 text-primary-dark dark:text-white">
                No past events found
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
                Try adjusting your search terms or filters
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium text-sm hover:from-primary-light hover:to-secondary-light transition-all">
                Clear All Filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filteredPastEvents.map((event) => (
                // <div
                //   key={event._id}
                //   className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700">
                //   <div className="relative h-24 overflow-hidden">
                //     <img
                //       src={event.image || ResourcesImage}
                //       alt={event.title}
                //       className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                //     />
                //     <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                //     <button
                //       onClick={() => toggleFavorite(event._id)}
                //       className="absolute bottom-1 right-1 p-1 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors">
                //       <Heart
                //         className={`w-3 h-3 ${favorites.has(event._id) ? "fill-red-500 text-red-500" : "text-white"}`}
                //       />
                //     </button>
                //   </div>
                //   <div className="p-2">
                //     <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                //       {event.title}
                //     </h3>
                //     <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2 leading-tight">
                //       {stripHtml(event.content)}
                //     </p>
                //     <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2 gap-2">
                //       <span className="flex items-center">
                //         <User className="w-2.5 h-2.5 mr-1" />
                //         {event.speakers.map((s) => s.name).join(", ")}
                //       </span>
                //       <span className="flex items-center">
                //         <Calendar className="w-2.5 h-2.5 mr-1" />
                //         {formatDate(event.date)}
                //       </span>
                //     </div>
                //     <button
                //       onClick={() => {
                //         setSelectedEvent(event);
                //         setShowModal(true);
                //       }}
                //       className="flex-1 flex items-center justify-center px-2 py-1.5 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium text-xs hover:from-primary-light hover:to-secondary-light transition-all">
                //       Read More
                //     </button>
                //   </div>
                // </div>
                <div
                  key={event._id}
                  className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700">
                  {/* Image Section */}
                  <div className="relative h-28 overflow-hidden">
                    <img
                      src={event.image || ResourcesImage}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(event._id)}
                      className="absolute bottom-2 right-2 p-1.5 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors">
                      <Heart
                        className={`w-4 h-4 ${
                          favorites.has(event._id)
                            ? "fill-red-500 text-red-500"
                            : "text-white"
                        }`}
                      />
                    </button>

                    {/* Event Type Badge */}
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 rounded-full bg-primary/80 backdrop-blur-sm text-white text-xs font-medium">
                        {event.eventType || "Conference"}
                      </span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-3 space-y-2">
                    {/* Title */}
                    <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                      {event.title}
                    </h3>

                    {/* Short description */}
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-snug">
                      {stripHtml(event.content)}
                    </p>

                    {/* Speakers */}
                    {event.speakers?.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          Speakers
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {event.speakers.map((s, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-md p-1.5">
                              <img
                                src={s.image}
                                alt={s.name}
                                className="w-6 h-6 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                                onError={(e) => {
                                  e.currentTarget.src = "/default-avatar.png";
                                }}
                              />
                              <span className="text-xs text-gray-800 dark:text-gray-200 truncate">
                                {s.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Date & Time */}
                    <div className="space-y-1">
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(event.date).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </div>
                    </div>

                    {/* Read More Button */}
                    <button
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowModal(true);
                      }}
                      className="w-full flex items-center justify-center px-3 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium text-xs hover:from-primary-light hover:to-secondary-light transition-all">
                      Read More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredPastEvents.map((event) => (
                <div
                  key={event._id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden">
                      <img
                        src={event.image || ResourcesImage}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm mb-0.5 text-primary-dark dark:text-white line-clamp-1">
                            {event.title}
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 line-clamp-1">
                            {stripHtml(event.content)}
                          </p>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-3">
                            <span className="flex items-center">
                              <User className="w-2.5 h-2.5 mr-1" />
                              {event.speakers.map((s) => s.name).join(", ")}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-2.5 h-2.5 mr-1" />
                              {formatDate(event.date)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleFavorite(event._id)}
                            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <Heart
                              className={`w-3.5 h-3.5 ${favorites.has(event._id) ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                            />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedEvent(event);
                              setShowModal(true);
                            }}
                            className="flex items-center px-3 py-1.5 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium text-xs hover:from-primary-light hover:to-secondary-light transition-all">
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
          <div className="text-center py-12">
            <div className="text-4xl mb-3 text-gray-400">📅</div>
            <h3 className="text-lg font-semibold mb-2 text-primary-dark dark:text-white">
              No events found
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
              Check back later for upcoming events!
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium text-sm hover:from-primary-light hover:to-secondary-light transition-all">
              Clear All Filters
            </button>
          </div>
        )}

        {showModal && selectedEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="max-w-sm w-full rounded-lg shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-base font-semibold text-primary-dark dark:text-white">
                    Event Details
                  </h4>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
                <div className="mb-4">
                  <h5 className="font-medium text-sm mb-2 text-primary-dark dark:text-white line-clamp-2">
                    {selectedEvent.title}
                  </h5>
                  <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                    <p>
                      Event Type:{" "}
                      {eventTypes.find(
                        (type) =>
                          type.value ===
                          (selectedEvent.eventType || "conference")
                      )?.label || "Conference"}
                    </p>
                    <p>
                      Speakers:{" "}
                      {selectedEvent.speakers.map((s) => s.name).join(", ")}
                    </p>
                    <p>Date: {formatDate(selectedEvent.date)}</p>
                    <p>Duration: {selectedEvent.duration || "N/A"}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      navigate(
                        `/SingleEvent/${selectedEvent.slug || selectedEvent._id}`
                      )
                    }
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium text-sm hover:from-primary-light hover:to-secondary-light transition-all">
                    Read More
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
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
