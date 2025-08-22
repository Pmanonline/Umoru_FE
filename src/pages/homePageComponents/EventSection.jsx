import React, { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Play,
  ArrowLeft,
  ArrowRight,
  Circle,
  Watch,
} from "lucide-react";
import { Link } from "react-router-dom";
const backendURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:3001";

const EventSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [slideDirection, setSlideDirection] = useState("next");
  const [events, setEvents] = useState([]);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${backendURL}/api/getEvents`);
        const data = await res.json();
        setEvents(data.events);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };
    fetchEvents();
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying || events.length === 0) return;

    const interval = setInterval(() => {
      setSlideDirection("next");
      setCurrentSlide((prev) => (prev + 1) % events.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, events.length]);

  // Countdown timer
  useEffect(() => {
    const currentEvent = events[currentSlide] || {};
    const updateTimer = () => {
      const eventDate = new Date(currentEvent.date);
      if (isNaN(eventDate.getTime())) return;
      const now = new Date();
      const difference = eventDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);

    return () => clearInterval(timerInterval);
  }, [currentSlide, events]);

  const nextSlide = () => {
    setSlideDirection("next");
    setCurrentSlide((prev) => (prev + 1) % events.length);
  };

  const prevSlide = () => {
    setSlideDirection("prev");
    setCurrentSlide((prev) => (prev - 1 + events.length) % events.length);
  };

  const goToSlide = (index) => {
    setSlideDirection(index > currentSlide ? "next" : "prev");
    setCurrentSlide(index);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return "Date Not Available";
    }
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const getEventTypeColor = (type) => {
    const colors = {
      conference: "from-blue-700 to-emerald-600",
      workshop: "from-blue-700 to-green-600",
      seminar: "from-red-700 to-green-700",
      webinar: "from-teal-400 to-green-500",
      other: "from-gray-600 to-gray-700",
    };
    return colors[type] || colors.other;
  };

  const getDaysUntil = (dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 0;
    const days = Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const currentEvent = events[currentSlide] || {};

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden bg-gray-200 dark:bg-gray-950 p-4 sm:p-6 text-gray-900 dark:text-gray-100"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}>
      {/* Header with Countdown */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-teal-700 dark:text-teal-300">
          Upcoming Events
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm sm:text-base font-semibold text-gray-600 dark:text-gray-300">
            Time Left:
          </span>
          <div className="flex space-x-1 sm:space-x-2">
            <span className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-700/20 dark:bg-blue-700/30 text-red-700 dark:text-teal-200 rounded-md text-xs sm:text-sm">
              {timeLeft.days}d
            </span>
            <span className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-700/20 dark:bg-blue-700/30 text-red-700 dark:text-teal-200 rounded-md text-xs sm:text-sm">
              {timeLeft.hours}h
            </span>
            <span className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-700/20 dark:bg-blue-700/30 text-red-700 dark:text-teal-200 rounded-md text-xs sm:text-sm">
              {timeLeft.minutes}m
            </span>
            <span className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-700/20 dark:bg-blue-700/30 text-red-700 dark:text-teal-200 rounded-md text-xs sm:text-sm">
              {timeLeft.seconds}s
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 z-30">
        <button
          onClick={prevSlide}
          className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200/30 dark:bg-gray-800/30 hover:bg-gray-300/40 dark:hover:bg-gray-700/40 backdrop-blur-sm border border-gray-300/20 dark:border-gray-700/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 group">
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-700 dark:group-hover:text-teal-400 transition-colors" />
        </button>
      </div>

      <div className="absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 z-30">
        <button
          onClick={nextSlide}
          className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200/30 dark:bg-gray-800/30 hover:bg-gray-300/40 dark:hover:bg-gray-700/40 backdrop-blur-sm border border-gray-300/20 dark:border-gray-700/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 group">
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-700 dark:group-hover:text-teal-400 transition-colors" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex space-x-2">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-blue-700 dark:bg-teal-400"
                  : "bg-gray-400/30 dark:bg-gray-600/30 hover:bg-gray-500/50 dark:hover:bg-gray-500/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-300/20 dark:bg-gray-700/20 z-30">
        <div
          className="h-full bg-gradient-to-r from-blue-700 to-green-600 transition-all duration-700"
          style={{
            width: `${((currentSlide + 1) / events.length) * 100}%`,
          }}></div>
      </div>

      {/* Content Container */}
      <div className="relative z-20 min-h-[calc(100vh-100px)] flex items-center">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 items-center">
            {/* Left Content */}
            <div
              className={`space-y-4 sm:space-y-6 transform transition-all duration-700 ${
                slideDirection === "next"
                  ? "animate-slide-in-left"
                  : "animate-slide-in-right"
              }`}>
              {/* Event Type & Days Until */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div
                  className={`inline-block bg-gradient-to-r ${getEventTypeColor(
                    currentEvent.eventType
                  )} px-2 sm:px-3 py-1 sm:py-1.5 rounded-full`}>
                  <span className="text-white font-semibold uppercase tracking-wide text-xs sm:text-sm">
                    {currentEvent.eventType}
                  </span>
                </div>

                {getDaysUntil(currentEvent.date) > 0 && (
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full animate-pulse">
                    <span className="text-white font-semibold text-xs sm:text-sm">
                      {getDaysUntil(currentEvent.date)} days left
                    </span>
                  </div>
                )}
              </div>

              {/* Category */}
              <div className="text-blue-700 dark:text-teal-400 font-semibold text-base sm:text-lg tracking-wide">
                {currentEvent.category}
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-blue-700 via-red-700 to-green-600 bg-clip-text text-transparent dark:from-teal-400 dark:via-teal-200 dark:to-green-400 leading-tight">
                {currentEvent.title}
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl line-clamp-3">
                {currentEvent.content
                  ? currentEvent.content.replace(/<\/?[^>]+(>|$)/g, "")
                  : ""}
              </p>

              {/* Event Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-blue-700 dark:text-teal-400" />
                    <span className="text-sm sm:text-base">
                      {formatDate(currentEvent.date)}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-blue-700 dark:text-teal-400" />
                    <span className="text-sm sm:text-base">
                      {currentEvent.venue || "Virtual Event"}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Watch className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-blue-700 dark:text-teal-400" />
                    <span className="text-sm sm:text-base">7:00 PM GMT</span>
                  </div>

                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-blue-700 dark:text-teal-400" />
                    <span className="text-sm sm:text-base">
                      {currentEvent.duration || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Speakers & Stats */}
            <div
              className={`space-y-4 sm:space-y-6 transform transition-all duration-700 delay-200 ${
                slideDirection === "next"
                  ? "animate-slide-in-right"
                  : "animate-slide-in-left"
              }`}>
              {/* Speakers Section */}
              <div className="bg-gray-100/10 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-300/20 dark:border-gray-700/30 rounded-xl p-3 sm:p-4">
                <h3 className="text-lg sm:text-axl font-extrabold text-teal-700 dark:text-teal-300 mb-3 sm:mb-4">
                  Featured Speakers
                </h3>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {currentEvent.speakers?.slice(0, 4).map((speaker, index) => (
                    <div key={index} className="text-center">
                      <img
                        src={speaker.image || "https://via.placeholder.com/50"}
                        alt={speaker.name || "Speaker"}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full mx-auto mb-1 sm:mb-2 object-cover border-2 border-blue-700/50"
                      />
                      <div className="text-gray-900 dark:text-gray-100 font-semibold text-xs sm:text-sm">
                        {speaker.name || "Unknown Speaker"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                <Link
                  to={`/SingleEvent/${currentEvent.slug}`}
                  className="w-full">
                  <button className="w-full bg-gradient-to-r from-blue-700 to-green-600 hover:from-red-700 hover:to-green-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-700/30 transform hover:-translate-y-0.5 text-sm sm:text-base flex-1 sm:flex-none">
                    Read More
                  </button>
                </Link>
                <Link to={`/SingleEvent/${currentEvent.slug}`}>
                  <button className="border-2 border-blue-700/50 hover:border-blue-700 text-gray-900 dark:text-gray-100 hover:text-blue-700 dark:hover:text-teal-400 font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-xl transition-all duration-300 hover:bg-blue-700/20 dark:hover:bg-blue-700/20 text-sm sm:text-base">
                    Register
                  </button>
                </Link>
              </div>

              {/* Play Button for Video */}
              {currentEvent.videoUrl && (
                <div className="flex justify-center">
                  <button className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200/30 dark:bg-gray-800/30 backdrop-blur-sm border border-blue-700/30 rounded-full flex items-center justify-center hover:bg-blue-700/40 dark:hover:bg-blue-700/40 transition-all duration-300 hover:scale-105 group">
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300 ml-0.5 sm:ml-1 group-hover:text-blue-700 dark:group-hover:text-teal-400 transition-colors" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.7s ease-out;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.7s ease-out;
        }

        .delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </section>
  );
};

export default EventSection;
