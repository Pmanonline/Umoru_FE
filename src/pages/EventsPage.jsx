import React, { useState, useEffect } from "react";
import { Search, Heart, Calendar, User, Clock, Video, X } from "lucide-react";
import { Alert, AlertDescription } from "../components/tools/Alert"; // Adjust path as needed
import { CheckCircle, AlertCircle } from "lucide-react";
import ResourcesImage from "../assets/images/resources2.jpg"; // Reuse as fallback
import backendURL from "../config";
import LoaddingSpinner from "../components/tools/LoaddingSpinner"; // Assumed to be a custom loading spinner component

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });
  const [favorites, setFavorites] = useState(() => {
    // Load favorites from localStorage on mount
    const saved = localStorage.getItem("favoriteEvents");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  // Persist favorites to localStorage
  useEffect(() => {
    localStorage.setItem("favoriteEvents", JSON.stringify([...favorites]));
  }, [favorites]);

  // Fetch events from backend
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
  }, []);

  const showAlertMessage = (message, variant) => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

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

  const currentDate = new Date("2025-08-11");
  const upcomingEvents = events.filter(
    (event) => new Date(event.date) >= currentDate
  );
  const pastEvents = events.filter(
    (event) => new Date(event.date) < currentDate
  );

  const filteredUpcomingEvents = upcomingEvents.filter((event) => {
    const speakerNames = event.speakers
      .map((s) => s.name)
      .join(" ")
      .toLowerCase();
    return (
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      speakerNames.includes(searchTerm.toLowerCase()) ||
      event.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const filteredPastEvents = pastEvents.filter((event) => {
    const speakerNames = event.speakers
      .map((s) => s.name)
      .join(" ")
      .toLowerCase();
    return (
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      speakerNames.includes(searchTerm.toLowerCase()) ||
      event.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return <LoaddingSpinner />;
  }

  return (
    <div className="min-h-screen bg-accent-cream dark:bg-accent-creamDark text-primary-dark dark:text-accent-charcoalDark mt-16">
      {/* Hero Section */}
      <div className="relative bg-primary-dark dark:bg-primary-darkMode bg-hero-gradient dark:bg-hero-gradient-dark overflow-hidden">
        <img
          src={ResourcesImage}
          alt="Events background"
          className="absolute inset-0 w-full h-full object-cover opacity-20 z-0"
        />
        <div className="relative container mx-auto px-6 py-20 z-10">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-primary-light">
              Umoru Events
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join Our Exciting Events to Learn, Connect, and Innovate
            </p>
            <div className="flex justify-center space-x-8 text-lg">
              <div className="flex items-center bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                <Calendar className="w-5 h-5 mr-2 text-accent-teal" />
                <span>{events.length} Events</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-accent-charcoal dark:text-accent-charcoalDark" />
            <input
              type="text"
              placeholder="Search events, speakers, or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-accent-charcoal/20 dark:border-accent-charcoalDark/20 bg-white/90 dark:bg-primary-customDark/90 text-primary-dark dark:text-accent-charcoalDark placeholder-accent-charcoal/50 dark:placeholder-accent-charcoalDark/50 focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Upcoming Events Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-primary-dark dark:text-accent-charcoalDark">
            Upcoming Events
          </h2>
          {filteredUpcomingEvents.length === 0 ? (
            <p className="text-accent-charcoal dark:text-accent-charcoalDark text-center">
              No upcoming events found. Try adjusting your search.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUpcomingEvents.map((event) => (
                <div
                  key={event._id}
                  className="group bg-accent-cream dark:bg-accent-creamDark rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-accent-charcoalDark/20">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.image || ResourcesImage}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-primary-light/80 dark:bg-primary-darkMode/80 backdrop-blur-sm text-white text-sm font-medium">
                        {event.category}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleFavorite(event._id)}
                      className="absolute top-4 right-4 p-2 rounded-full bg-white/20 dark:bg-primary-darkMode/20 backdrop-blur-sm hover:bg-white/30 dark:hover:bg-primary-darkMode/30 transition-colors">
                      <Heart
                        className={`w-4 h-4 ${favorites.has(event._id) ? "fill-secondary text-secondary" : "text-white"}`}
                      />
                    </button>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary-light transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-sm text-accent-charcoal dark:text-accent-charcoalDark mb-3 line-clamp-2">
                      {stripHtml(event.content)}
                    </p>
                    <div className="flex items-center text-sm text-accent-charcoal/80 dark:text-accent-charcoalDark/80 mb-4">
                      <User className="w-4 h-4 mr-1 text-accent-teal" />
                      <span className="mr-4">
                        {event.speakers.map((s) => s.name).join(", ")}
                      </span>
                      <Calendar className="w-4 h-4 mr-1 text-accent-teal" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center text-sm text-accent-charcoal/80 dark:text-accent-charcoalDark/80 mb-4">
                      <Clock className="w-4 h-4 mr-1 text-accent-teal" />
                      <span>{event.duration || "N/A"}</span>
                    </div>
                    <a
                      href={event.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:from-primary-light hover:to-secondary-light transition-all">
                      <Video className="w-4 h-4 mr-2 text-accent-green" />
                      Join Event
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Past Events Section */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-primary-dark dark:text-accent-charcoalDark">
            Past Events
          </h2>
          {filteredPastEvents.length === 0 ? (
            <p className="text-accent-charcoal dark:text-accent-charcoalDark text-center">
              No past events found. Try adjusting your search.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPastEvents.map((event) => (
                <div
                  key={event._id}
                  className="group bg-accent-cream dark:bg-accent-creamDark rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-accent-charcoalDark/20">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.image || ResourcesImage}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-primary-light/80 dark:bg-primary-darkMode/80 backdrop-blur-sm text-white text-sm font-medium">
                        {event.category}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleFavorite(event._id)}
                      className="absolute top-4 right-4 p-2 rounded-full bg-white/20 dark:bg-primary-darkMode/20 backdrop-blur-sm hover:bg-white/30 dark:hover:bg-primary-darkMode/30 transition-colors">
                      <Heart
                        className={`w-4 h-4 ${favorites.has(event._id) ? "fill-secondary text-secondary" : "text-white"}`}
                      />
                    </button>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary-light transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-sm text-accent-charcoal dark:text-accent-charcoalDark mb-3 line-clamp-2">
                      {stripHtml(event.content)}
                    </p>
                    <div className="flex items-center text-sm text-accent-charcoal/80 dark:text-accent-charcoalDark/80 mb-4">
                      <User className="w-4 h-4 mr-1 text-accent-teal" />
                      <span className="mr-4">
                        {event.speakers.map((s) => s.name).join(", ")}
                      </span>
                      <Calendar className="w-4 h-4 mr-1 text-accent-teal" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center text-sm text-accent-charcoal/80 dark:text-accent-charcoalDark/80 mb-4">
                      <Clock className="w-4 h-4 mr-1 text-accent-teal" />
                      <span>{event.duration || "N/A"}</span>
                    </div>
                    <a
                      href={event.videoUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:from-primary-light hover:to-secondary-light transition-all">
                      <Video className="w-4 h-4 mr-2 text-accent-green" />
                      View Details
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {events.length === 0 && (
          <div className="text-center py-16">
            <div className="text-8xl mb-6 text-accent-charcoal dark:text-accent-charcoalDark">
              📅
            </div>
            <h3 className="text-2xl font-bold mb-4 text-primary-dark dark:text-accent-charcoalDark">
              No events found
            </h3>
            <p className="text-accent-charcoal dark:text-accent-charcoalDark mb-6 max-w-md mx-auto">
              Check back later for upcoming events!
            </p>
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
