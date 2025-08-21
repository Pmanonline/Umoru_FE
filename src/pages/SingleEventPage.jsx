import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  Share2,
  Play,
  Loader2,
  X,
  Bell,
  ChevronLeft,
  ChevronRight,
  Video,
} from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import backendURL from "../config";
import { Alert, AlertDescription } from "../components/tools/Alert";

// Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full relative max-h-[90vh] overflow-y-auto shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-1"
          aria-label="Close">
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  );
};

// Related Events Carousel Component
const RelatedEventsCarousel = ({ events }) => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const scroll = useCallback((scrollOffset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += scrollOffset;
    }
  }, []);

  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      .replace(/(\d+)/, (match) => {
        const day = parseInt(match);
        const suffix = ["th", "st", "nd", "rd"][
          day % 10 > 3 ? 0 : ((day % 100) - 20) % 10 || 3
        ];
        return `${day}${suffix}`;
      });
  }, []);

  const handleCardClick = useCallback(
    (slug) => {
      navigate(`/event/${slug}`);
      window.scrollTo(0, 0);
    },
    [navigate]
  );

  return (
    <div className="mt-12">
      <h2 className="text-2xl md:text-3xl font-bold text-teal-600 dark:text-teal-400 text-center mb-6">
        Related Events
      </h2>
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scroll-smooth gap-4 px-4 md:px-6 pb-4 scrollbar-hidden">
          {events.map((event) => (
            <motion.div
              key={event._id}
              className="min-w-[250px] max-w-[320px] flex-shrink-0 rounded-xl overflow-hidden bg-white/80 dark:bg-gray-800/80 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.02, y: -8 }}
              onClick={() => handleCardClick(event.slug)}>
              <div className="relative">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-40 md:h-48 object-cover"
                />
                <span
                  className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold text-white ${
                    new Date(event.date) < new Date()
                      ? "bg-teal-600"
                      : "bg-green-600"
                  }`}>
                  {new Date(event.date) < new Date()
                    ? "Past Event"
                    : "Upcoming"}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                  {event.title}
                </h3>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm">
                    <Calendar
                      size={14}
                      className="text-teal-600 dark:text-teal-400"
                    />
                    {formatDate(event.date)}
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm">
                    <MapPin
                      size={14}
                      className="text-teal-600 dark:text-teal-400"
                    />
                    <span className="truncate">
                      {event.venue || "Virtual Event"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-center mt-4 gap-2 hidden md:flex">
          <button
            onClick={() => scroll(-320)}
            className="p-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors"
            aria-label="Scroll left">
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll(320)}
            className="p-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors"
            aria-label="Scroll right">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Speakers Carousel Component
const SpeakersCarousel = ({ speakers }) => {
  if (!speakers || speakers.length === 0) return null;

  if (speakers.length === 1) {
    const speaker = speakers[0];
    return (
      <div className="flex justify-center mb-3">
        <div className="max-w-md bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-4">
            {speaker.image ? (
              <img
                src={speaker.image}
                alt={speaker.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-teal-600"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {speaker.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {speaker.name}
              </h3>
              <p className="text-teal-600 dark:text-teal-400 text-sm">
                {speaker.occupation}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {speaker.CoName}
              </p>
              {speaker.bio && (
                <p className="text-gray-700 dark:text-gray-300 text-sm mt-1 line-clamp-3">
                  {speaker.bio}
                </p>
              )}
            </div>
          </div>
          <span className="inline-block mt-2 bg-teal-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Featured Speaker
          </span>
        </div>
      </div>
    );
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: Math.min(speakers.length, 3),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    pauseOnHover: true,
    pauseOnFocus: true,
    arrows: true,
    cssEase: "cubic-bezier(0.4, 0, 0.2, 1)",
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 960, settings: { slidesToShow: 1, slidesToScroll: 1 } },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1, slidesToScroll: 1, arrows: false },
      },
    ],
  };

  return (
    <div className="relative">
      <style>
        {`
          .slick-dots { bottom: -40px; }
          .slick-dots li button:before { color: #047481; font-size: 10px; }
          .slick-dots li.slick-active button:before { color: #047481; }
          .slick-prev, .slick-next { z-index: 2; }
          .slick-prev:before, .slick-next:before { font-size: 20px; color: #047481; }
          .slick-prev { left: -40px; }
          .slick-next { right: -40px; }
          ${speakers.length <= 3 ? ".slick-prev, .slick-next { display: none !important; }" : ""}
        `}
      </style>
      <Slider {...settings}>
        {speakers.map((speaker) => (
          <div key={speaker._id} className="p-2">
            <div className="h-full min-h-[100px] bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mx-1">
              <div className="p-4 flex flex-col h-full">
                <div className="flex items-start gap-4 flex-1">
                  {speaker.image ? (
                    <img
                      src={speaker.image}
                      alt={speaker.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-teal-600"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-base">
                      {speaker.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                      {speaker.name}
                    </h3>
                    <p className="text-teal-600 dark:text-teal-400 text-sm">
                      {speaker.occupation}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {speaker.CoName}
                    </p>
                    {speaker.bio && (
                      <p className="text-gray-700 dark:text-gray-300 text-sm mt-1 line-clamp-3">
                        {speaker.bio}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-auto">
                  <span className="inline-block bg-teal-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    Speaker
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

// Add to Calendar Component
const AddToCalendar = ({ eventData }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const formatDateForCalendar = (date) =>
    new Date(date).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const generateCalendarUrl = (type) => {
    const startDate = formatDateForCalendar(eventData.date);
    const endDate = formatDateForCalendar(
      new Date(new Date(eventData.date).getTime() + 2 * 60 * 60 * 1000)
    );
    const title = encodeURIComponent(eventData.title);
    const details = encodeURIComponent(
      `${eventData.content.replace(/<[^>]*>/g, "").substring(0, 200)}...`
    );
    const location = encodeURIComponent(eventData.venue || "Virtual Event");

    return {
      google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`,
      outlook: `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&startdt=${startDate}&enddt=${endDate}&body=${details}&location=${location}`,
      yahoo: `https://calendar.yahoo.com/?v=60&view=d&type=20&title=${title}&st=${startDate}&dur=0200&desc=${details}&in_loc=${location}`,
    }[type];
  };

  const downloadICS = () => {
    const startDate = new Date(eventData.date);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Event Calendar//EN
BEGIN:VEVENT
UID:${Date.now()}@event.com
DTSTAMP:${formatDateForCalendar(new Date())}
DTSTART:${formatDateForCalendar(startDate)}
DTEND:${formatDateForCalendar(endDate)}
SUMMARY:${eventData.title}
DESCRIPTION:${eventData.content.replace(/<[^>]*>/g, "").substring(0, 200)}...
LOCATION:${eventData.venue || "Virtual Event"}
END:VEVENT
END:VCALENDAR`;
    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${eventData.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.ics`;
    a.click();
    URL.revokeObjectURL(url);
    handleClose();
  };

  return (
    <>
      <motion.button
        className="bg-gray-200 dark:bg-gray-700 border border-teal-600 dark:border-teal-400 text-teal-600 dark:text-teal-400 hover:bg-teal-600 dark:hover:bg-teal-400 hover:text-white dark:hover:text-gray-900 py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold text-base sm:text-lg transition-colors"
        onClick={handleOpen}
        variants={{
          hover: {
            scale: 1.05,
            boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)",
          },
          tap: { scale: 0.98 },
        }}
        whileHover="hover"
        whileTap="tap"
        aria-label="Add to calendar">
        Add to Calendar
      </motion.button>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center">
            Add to Calendar
          </h3>
          <a
            href={generateCalendarUrl("google")}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors text-center">
            Google Calendar
          </a>
          <a
            href={generateCalendarUrl("outlook")}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors text-center">
            Outlook Calendar
          </a>
          <a
            href={generateCalendarUrl("yahoo")}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors text-center">
            Yahoo Calendar
          </a>
          <button
            onClick={downloadICS}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
            Download ICS
          </button>
        </div>
      </Modal>
    </>
  );
};

// Share Feature Component
const ShareFeature = ({ eventData, showAlertMessage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleShare = (platform) => {
    if (!eventData) return;
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(eventData.title);
    const shareUrl = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`,
      whatsapp: `https://api.whatsapp.com/send?text=${title} ${url}`,
    }[platform];
    window.location.href = shareUrl;
    handleClose();
  };

  return (
    <>
      <motion.button
        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-teal-500 dark:hover:bg-teal-400 transition-colors"
        onClick={handleOpen}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Share event">
        <Share2 size={16} />
        <span className="text-xs sm:text-sm">Share</span>
      </motion.button>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center">
            Share Event
          </h3>
          <button
            onClick={() => handleShare("twitter")}
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors text-center">
            Twitter
          </button>
          <button
            onClick={() => handleShare("linkedin")}
            className="block w-full bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors text-center">
            LinkedIn
          </button>
          <button
            onClick={() => handleShare("whatsapp")}
            className="block w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors text-center">
            WhatsApp
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              showAlertMessage("Link copied to clipboard!", "success");
              handleClose();
            }}
            className="block w-full bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-500 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
            Copy Link
          </button>
        </div>
      </Modal>
    </>
  );
};

// Main SingleEventPage Component
const SingleEventPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });

  const showAlertMessage = useCallback((message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
  }, []);

  const [eventData, setEventData] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(127);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [registrationData, setRegistrationData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    countryOfResidence: "",
    careerStatus: "",
    interestAndAim: "",
    managesImmigrantCommunity: false,
    company: "",
  });

  // Fetch event data by slug
  const fetchEventDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${backendURL}/api/getEventBySlug/${slug}`);
      if (!res.ok) throw new Error("Failed to fetch event data");
      const data = await res.json();
      setEventData(data);
      if (data._id && (data.category || data.eventType)) {
        fetchRelatedEvents(data._id, data.category || data.eventType);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  // Fetch related events
  const fetchRelatedEvents = useCallback(async (currentEventId, category) => {
    try {
      const res = await fetch(
        `${backendURL}/api/related-events?category=${encodeURIComponent(category)}&currentEventId=${currentEventId}`
      );
      if (!res.ok) throw new Error("Failed to fetch related events");
      const data = await res.json();
      setRelatedEvents(data);
    } catch (err) {
      console.warn("Failed to load related events:", err.message);
    }
  }, []);

  useEffect(() => {
    fetchEventDetails();
  }, [fetchEventDetails]);

  // Countdown Timer
  useEffect(() => {
    if (!eventData || !eventData.date) return;
    const targetDate = new Date(eventData.date).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance < 0) {
        clearInterval(interval);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setCountdown({ days, hours, minutes, seconds });
    }, 1000);
    return () => clearInterval(interval);
  }, [eventData]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)" },
    tap: { scale: 0.98 },
  };

  const handleLike = useCallback(() => {
    setIsLiked((prev) => !prev);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
  }, [isLiked]);

  const handleNewsletterSubscribe = useCallback(
    async (e) => {
      e.preventDefault();
      if (!email) return;
      setSubLoading(true);
      try {
        const res = await fetch(`${backendURL}/api/newsletter-signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (res.ok) {
          showAlertMessage("Subscription successful!", "success");
          setEmail("");
          setIsSubscribed(true);
          setTimeout(() => setIsSubscribed(false), 3000);
        } else {
          showAlertMessage(
            data.message || "An error occurred. Please try again.",
            data.message.includes("already subscribed")
              ? "warning"
              : "destructive"
          );
        }
      } catch (err) {
        showAlertMessage("An error occurred. Please try again.", "destructive");
      } finally {
        setSubLoading(false);
      }
    },
    [email, showAlertMessage]
  );

  const handleRegistration = useCallback(
    async (e) => {
      e.preventDefault();
      setSubLoading(true);
      try {
        const isPastEvent = new Date(eventData.date) < new Date();
        const res = await fetch(`${backendURL}/api/register-event`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...registrationData,
            eventTitle: eventData.title,
            slug: eventData.slug,
            eventCategory: eventData.category || eventData.eventType,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          showAlertMessage(
            "Registration successful! Please check your email for confirmation.",
            "success"
          );
          setRegistrationData({
            fullName: "",
            email: "",
            mobileNumber: "",
            countryOfResidence: "",
            careerStatus: "",
            interestAndAim: "",
            managesImmigrantCommunity: false,
            company: "",
          });
          setTimeout(() => {
            if (
              isPastEvent &&
              eventData.eventType === "webinar" &&
              eventData.videoUrl
            ) {
              navigate(`/eventVideo/${eventData.slug}`);
            }
          }, 1500);
        } else {
          showAlertMessage(
            data.message || "Registration failed. Please try again.",
            "destructive"
          );
        }
      } catch (err) {
        showAlertMessage("An error occurred. Please try again.", "destructive");
      } finally {
        setSubLoading(false);
      }
    },
    [eventData, registrationData, navigate, showAlertMessage]
  );

  const handleVerifyEmail = useCallback(
    async (e) => {
      e.preventDefault();
      setIsVerifying(true);
      try {
        const res = await fetch(`${backendURL}/api/verify-registration`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: verifyEmail, slug: eventData.slug }),
        });
        const data = await res.json();
        if (res.ok) {
          showAlertMessage("Verification successful!", "success");
          setTimeout(() => {
            navigate(`/eventVideo/${eventData.slug}`);
            setShowVerifyModal(false);
          }, 1500);
        } else {
          showAlertMessage(
            data.message || "Email not found in registration list.",
            "destructive"
          );
        }
      } catch (err) {
        showAlertMessage("An error occurred. Please try again.", "destructive");
      } finally {
        setIsVerifying(false);
      }
    },
    [verifyEmail, eventData, navigate, showAlertMessage]
  );

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setRegistrationData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  const formatTime = useCallback((dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Time Not Available";
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      timeZone: "Africa/Lagos",
      timeZoneName: "short",
    }).format(date);
  }, []);

  const formattedDate = useMemo(
    () => (eventData ? formatDate(eventData.date) : "Date Not Available"),
    [eventData, formatDate]
  );
  const formattedTime = useMemo(
    () => (eventData ? formatTime(eventData.date) : "Time Not Available"),
    [eventData, formatTime]
  );
  const isUpcoming = useMemo(
    () => eventData && new Date(eventData.date) >= new Date(),
    [eventData]
  );
  const isPastWithVideo = useMemo(
    () =>
      eventData &&
      !isUpcoming &&
      eventData.eventType === "webinar" &&
      eventData.videoUrl,
    [eventData, isUpcoming]
  );

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <Loader2
          className="animate-spin text-teal-500 dark:text-teal-400"
          size={40}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-200 to-teal-100 dark:from-gray-800 dark:to-gray-900">
        <div className="text-red-600 dark:text-red-400 text-xl">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-200 to-teal-100 dark:from-gray-800 dark:to-gray-900">
        <div className="text-gray-900 dark:text-white text-xl">
          Event not found.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-teal-100 dark:from-gray-800 dark:to-gray-900">
      {/* Alert Component */}
      {showAlert && (
        <Alert
          variant={alertConfig.variant}
          show={showAlert}
          onClose={() => setShowAlert(false)}
          autoClose={true}
          autoCloseTime={5000}>
          <AlertDescription>{alertConfig.message}</AlertDescription>
        </Alert>
      )}

      {/* Header/Navigation */}
      <div className="relative z-20 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 sm:py-4">
            <motion.button
              className="flex items-center gap-2 text-gray-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              whileHover={{ x: -5 }}
              onClick={() => window.history.back()}
              aria-label="Back to events">
              <ChevronLeft size={20} />
              <span className="text-sm sm:text-base">Back to Events</span>
            </motion.button>
            <div className="flex items-center gap-2 sm:gap-4">
              <motion.button
                className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 rounded-lg transition-colors ${
                  isLiked
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-red-500 dark:hover:bg-red-500"
                }`}
                onClick={handleLike}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={isLiked ? "Unlike event" : "Like event"}>
                <Heart size={16} fill={isLiked ? "white" : "none"} />
                <span className="text-xs sm:text-sm">{likes}</span>
              </motion.button>
              <ShareFeature
                eventData={eventData}
                showAlertMessage={showAlertMessage}
              />
              <AddToCalendar eventData={eventData} />
            </div>
          </div>
        </div>
      </div>

      <div className="relative" ref={ref}>
        {/* Hero Section */}
        <motion.section
          className="relative py-12 sm:py-16"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <motion.div variants={itemVariants}>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-teal-500 text-white px-2 py-1 rounded-full text-xs sm:text-sm font-semibold">
                    {eventData.eventType}
                  </span>
                  <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs sm:text-sm font-semibold">
                    {eventData.category}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs sm:text-sm font-semibold text-white ${
                      isUpcoming ? "bg-green-600" : "bg-teal-600"
                    }`}>
                    {isUpcoming ? "Upcoming Event" : "Past Event"}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 font-montserrat-subrayada">
                  {eventData.title}
                </h1>
                <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-4 sm:mb-6">
                  {eventData.content
                    .replace(/<\/?[^>]+(>|$)/g, "")
                    .slice(0, 100) + "..."}
                </p>
                {countdown.days > 0 && (
                  <div className="mb-4 sm:mb-6 bg-white/80 dark:bg-gray-800/80 rounded-lg p-3 sm:p-4 shadow-lg">
                    <h3 className="text-sm sm:text-base text-teal-600 dark:text-teal-400 font-semibold mb-2">
                      Event Starts In
                    </h3>
                    <div className="flex gap-2 sm:gap-4 text-sm sm:text-base">
                      <div className="text-center">
                        <div className="text-gray-900 dark:text-white font-bold">
                          {countdown.days}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 text-xs">
                          Days
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-900 dark:text-white font-bold">
                          {countdown.hours}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 text-xs">
                          Hours
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-900 dark:text-white font-bold">
                          {countdown.minutes}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 text-xs">
                          Mins
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-900 dark:text-white font-bold">
                          {countdown.seconds}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 text-xs">
                          Secs
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 sm:mb-8">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Calendar
                      className="text-teal-600 dark:text-teal-400"
                      size={18}
                    />
                    <div>
                      <div className="font-medium">{formattedDate}</div>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        {formattedTime}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <MapPin
                      className="text-teal-600 dark:text-teal-400"
                      size={18}
                    />
                    <div>
                      <div className="font-medium">
                        {eventData.venue || "Virtual Event"}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        {eventData.eventType === "webinar"
                          ? "Online Event"
                          : "Physical Event"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Clock
                      className="text-teal-600 dark:text-teal-400"
                      size={18}
                    />
                    <div>
                      <div className="font-medium">
                        {eventData.duration || "2+ hours"}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  {eventData.meetingLink && (
                    <motion.a
                      href={eventData.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-teal-600 dark:bg-teal-400 hover:bg-teal-700 dark:hover:bg-teal-500 text-white dark:text-gray-900 py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold text-base sm:text-lg transition-colors text-center"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      aria-label="Join event">
                      Join Event
                    </motion.a>
                  )}
                  <AddToCalendar eventData={eventData} />
                </div>
                {isPastWithVideo && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => setShowVerifyModal(true)}
                      className="text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 font-medium text-sm hover:underline transition-colors"
                      aria-label="Watch recorded video">
                      Already registered? Watch recorded video →
                    </button>
                  </div>
                )}
              </motion.div>
              <motion.div className="relative" variants={itemVariants}>
                <div className="relative h-64 sm:h-80 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={eventData.image}
                    alt={eventData.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/70 dark:from-gray-900/50 to-transparent p-3 sm:p-4">
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {eventData.tags?.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-2 py-1 rounded-full text-xs sm:text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {eventData.videoUrl && (
                  <motion.a
                    href={eventData.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-4 right-4 bg-white/80 dark:bg-gray-800/80 rounded-full p-2 shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Watch video">
                    <Play
                      className="text-teal-600 dark:text-teal-400"
                      size={20}
                    />
                  </motion.a>
                )}
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Event Details Section */}
        <section className="py-12 sm:py-16 bg-white/80 dark:bg-gray-800/80">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
              <div className="lg:col-span-2">
                <motion.div
                  className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-5 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-lg mb-6 sm:mb-8"
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 }}>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                    About This Event
                  </h2>
                  <div
                    className="text-gray-700 dark:text-gray-300 space-y-3 sm:space-y-4"
                    dangerouslySetInnerHTML={{ __html: eventData.content }}
                  />
                </motion.div>

                {eventData.speakers?.length > 0 && (
                  <motion.div
                    className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-5 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-lg mb-6 sm:mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.6 }}>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                      Featured Speakers
                    </h2>
                    <SpeakersCarousel speakers={eventData.speakers} />
                  </motion.div>
                )}

                <motion.div
                  className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-5 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 1.0 }}>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                    {isUpcoming ? "Secure Your Spot" : "Access Event Content"}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 text-center max-w-md mx-auto">
                    {isUpcoming
                      ? "Register now to secure a spot and get a reminder"
                      : "Register to access the recorded session and resources"}
                  </p>
                  <form
                    onSubmit={handleRegistration}
                    className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          required
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-teal-600 dark:focus:border-teal-400"
                          placeholder="Enter your full name"
                          value={registrationData.fullName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-teal-600 dark:focus:border-teal-400"
                          placeholder="Enter your email"
                          value={registrationData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                          Mobile Number (WhatsApp) *
                        </label>
                        <input
                          type="tel"
                          name="mobileNumber"
                          required
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-teal-600 dark:focus:border-teal-400"
                          placeholder="Enter your mobile number"
                          value={registrationData.mobileNumber}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                          Country of Residence *
                        </label>
                        <input
                          type="text"
                          name="countryOfResidence"
                          required
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-teal-600 dark:focus:border-teal-400"
                          placeholder="Enter your country"
                          value={registrationData.countryOfResidence}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                          Career Status *
                        </label>
                        <select
                          name="careerStatus"
                          required
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-teal-600 dark:focus:border-teal-400"
                          value={registrationData.careerStatus}
                          onChange={handleInputChange}>
                          <option value="">Select career status</option>
                          <option value="Employed">Employed</option>
                          <option value="Unemployed">Unemployed</option>
                          <option value="Student">Student</option>
                          <option value="Solopreneur">Solopreneur</option>
                          <option value="Entrepreneur">Entrepreneur</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                          Company/Organization
                        </label>
                        <input
                          type="text"
                          name="company"
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-teal-600 dark:focus:border-teal-400"
                          placeholder="Your company name"
                          value={registrationData.company}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                        Why do you want to attend?
                      </label>
                      <textarea
                        name="interestAndAim"
                        rows={3}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-teal-600 dark:focus:border-teal-400 resize-none"
                        placeholder="Tell us about your goals and expectations..."
                        value={registrationData.interestAndAim}
                        onChange={handleInputChange}
                      />
                    </div>

                    <motion.button
                      type="submit"
                      className="w-full bg-teal-600 dark:bg-teal-400 hover:bg-teal-700 dark:hover:bg-teal-500 text-white dark:text-gray-900 py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold text-base sm:text-lg transition-colors disabled:opacity-50"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      disabled={subLoading}>
                      {subLoading ? (
                        <>
                          <Loader2
                            className="animate-spin mr-2 inline"
                            size={16}
                          />
                          Processing...
                        </>
                      ) : isUpcoming ? (
                        "Register Now"
                      ) : (
                        "Access Content"
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              </div>

              <div className="space-y-6 sm:space-y-8">
                <motion.div
                  className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 sm:p-5 border border-gray-200 dark:border-gray-700 shadow-lg"
                  initial={{ opacity: 0, x: 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 }}>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3">
                    Stay Connected
                  </h3>
                  <a
                    href="https://t.me/credulensubscribers"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors text-center mb-4">
                    Join Our Telegram Community
                  </a>
                  <form
                    onSubmit={handleNewsletterSubscribe}
                    className="space-y-3">
                    <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                      Subscribe to Newsletter
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-3">
                      Get notified about upcoming events and exclusive content.
                    </p>
                    <input
                      type="email"
                      required
                      className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-teal-600 dark:focus:border-teal-400 text-sm"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <motion.button
                      type="submit"
                      className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                        isSubscribed
                          ? "bg-teal-600 text-white"
                          : "bg-teal-600 dark:bg-teal-400 hover:bg-teal-700 dark:hover:bg-teal-500 text-white dark:text-gray-900"
                      } disabled:opacity-50`}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      disabled={subLoading || isSubscribed}>
                      {subLoading ? (
                        <>
                          <Loader2
                            className="animate-spin mr-2 inline"
                            size={16}
                          />
                          Subscribing...
                        </>
                      ) : isSubscribed ? (
                        "Subscribed!"
                      ) : (
                        <>
                          Subscribe Now
                          <Bell className="inline ml-2" size={14} />
                        </>
                      )}
                    </motion.button>
                  </form>
                </motion.div>

                <motion.div
                  className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 sm:p-5 border border-gray-200 dark:border-gray-700 shadow-lg"
                  initial={{ opacity: 0, x: 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.7 }}>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3">
                    Event Information
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Calendar
                        className="text-teal-600 dark:text-teal-400"
                        size={14}
                      />
                      <span className="text-xs sm:text-sm">
                        {formattedDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Clock
                        className="text-teal-600 dark:text-teal-400"
                        size={14}
                      />
                      <span className="text-xs sm:text-sm">
                        {formattedTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <MapPin
                        className="text-teal-600 dark:text-teal-400"
                        size={14}
                      />
                      <span className="text-xs sm:text-sm">
                        {eventData.venue || "Virtual Event"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Clock
                        className="text-teal-600 dark:text-teal-400"
                        size={14}
                      />
                      <span className="text-xs sm:text-sm">
                        {eventData.duration || "2+ hours"}
                      </span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 sm:p-5 border border-gray-200 dark:border-gray-700 shadow-lg"
                  initial={{ opacity: 0, x: 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.9 }}>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3">
                    Share This Event
                  </h3>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <motion.a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        eventData.title + " " + window.location.href
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}>
                      Twitter
                    </motion.a>
                    <motion.a
                      href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                        window.location.href
                      )}&title=${encodeURIComponent(eventData.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}>
                      LinkedIn
                    </motion.a>
                    <motion.a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                        eventData.title + " " + window.location.href
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}>
                      WhatsApp
                    </motion.a>
                    <motion.button
                      className="bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-500 text-white py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        showAlertMessage(
                          "Link copied to clipboard!",
                          "success"
                        );
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}>
                      Copy Link
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {relatedEvents.length > 0 && (
          <RelatedEventsCarousel events={relatedEvents} />
        )}
      </div>

      <Modal isOpen={showVerifyModal} onClose={() => setShowVerifyModal(false)}>
        <div className="text-center">
          <div className="bg-teal-100 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-2">
            <Video className="w-6 h-6 text-teal-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Access Recorded Session
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Verify your registration to watch the recorded event
          </p>
          <form onSubmit={handleVerifyEmail} className="space-y-4">
            <div className="text-left">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                Registered Email Address
              </label>
              <input
                type="email"
                required
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-teal-600 dark:focus:border-teal-400 text-sm"
                placeholder="Enter your registered email"
                value={verifyEmail}
                onChange={(e) => setVerifyEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-teal-600 dark:bg-teal-400 hover:bg-teal-700 dark:hover:bg-teal-500 text-white dark:text-gray-900 py-2 px-4 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 flex items-center justify-center"
              disabled={isVerifying}>
              {isVerifying ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Verifying...
                </>
              ) : (
                <>
                  Verify & Watch
                  <Video className="ml-2" size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default SingleEventPage;
