import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "../components/tools/Alert";

const backendURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:3001";

const WinnersPage = () => {
  const [winnersData, setWinnersData] = useState({});
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });
  const carouselRef = useRef(null);
  const intervalRef = useRef(null);
  const { userInfo } = useSelector((state) => state.auth);

  const showAlertMessage = useCallback((message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  }, []);

  const fetchWinners = useCallback(async () => {
    if (Object.keys(winnersData).length > 0) return; // Prevent redundant fetches
    setIsLoading(true);
    try {
      const response = await axios.get(`${backendURL}/api/getWinners`, {
        headers: userInfo ? { Authorization: `Bearer ${userInfo.token}` } : {},
      });
      const grouped = response.data.winners.reduce((acc, winner) => {
        const year = winner.year.toString();
        if (!acc[year]) acc[year] = [];
        acc[year].push(winner);
        return acc;
      }, {});
      setWinnersData(grouped);
      const years = Object.keys(grouped).sort((a, b) => b - a);
      if (years.length > 0 && !selectedYear) {
        setSelectedYear(years[0]);
      }
    } catch (err) {
      showAlertMessage(
        err.response?.data?.message || "Failed to fetch winners",
        "destructive"
      );
    } finally {
      setIsLoading(false);
    }
  }, [winnersData, selectedYear, userInfo, showAlertMessage]);

  useEffect(() => {
    fetchWinners();
  }, [fetchWinners]);

  useEffect(() => {
    if (autoScroll && winnersData[selectedYear]?.length > 1) {
      intervalRef.current = setInterval(() => {
        setActiveIndex(
          (prevIndex) => (prevIndex + 1) % winnersData[selectedYear].length
        );
      }, 5000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoScroll, selectedYear, winnersData]);

  useEffect(() => {
    if (carouselRef.current && winnersData[selectedYear]?.length > 0) {
      const itemWidth = carouselRef.current.offsetWidth;
      carouselRef.current.scrollTo({
        left: activeIndex * itemWidth,
        behavior: "smooth",
      });
    }
  }, [activeIndex, selectedYear, winnersData]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? winnersData[selectedYear].length - 1 : prevIndex - 1
    );
    setAutoScroll(false);
    setTimeout(() => setAutoScroll(true), 10000);
  }, [selectedYear, winnersData]);

  const handleNext = useCallback(() => {
    setActiveIndex(
      (prevIndex) => (prevIndex + 1) % winnersData[selectedYear].length
    );
    setAutoScroll(false);
    setTimeout(() => setAutoScroll(true), 10000);
  }, [selectedYear, winnersData]);

  const handleYearChange = useCallback((year) => {
    setSelectedYear(year);
    setActiveIndex(0);
  }, []);

  const years = useMemo(
    () => Object.keys(winnersData).sort((a, b) => b - a),
    [winnersData]
  );

  const winnerCards = useMemo(() => {
    if (!winnersData[selectedYear] || winnersData[selectedYear].length === 0)
      return null;
    return winnersData[selectedYear].map((winner) => (
      <div key={winner._id} className="flex-shrink-0 w-full snap-start">
        <div className="flex flex-col md:flex-row items-center bg-white rounded-xl overflow-hidden shadow-lg">
          <div className="md:w-1/2 h-[22rem] w-full">
            <img
              src={winner.image || "/default-profile.jpg"}
              alt={winner.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/default-profile.jpg";
              }}
            />
          </div>
          <div className="md:w-1/2 p-4 sm:p-6 md:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-primary">
              {winner.name}
            </h2>
            <h3 className="text-lg sm:text-xl text-sunlit-gold font-semibold mb-2">
              {winner.award}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              {winner.awardCategory} - {winner.year}
            </p>
            <p className="text-base sm:text-lg mb-6 text-primary line-clamp-3">
              {winner.description}
            </p>
            <button className="bg-sunlit-gold hover:bg-secondary text-primary font-bold py-2 px-4 sm:px-6 rounded-full transition-colors">
              Read Full Story
            </button>
          </div>
        </div>
      </div>
    ));
  }, [selectedYear, winnersData]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-accent-cream mt-12">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-2">
            WINNERS {selectedYear}
          </h1>
          <div className="w-16 h-1 bg-sunlit-gold mx-auto"></div>
        </div>

        {/* Year Selection */}
        {years.length > 0 ? (
          <div className="flex justify-center flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => handleYearChange(year)}
                className={`px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded-full transition-all text-xs sm:text-sm font-medium ${
                  selectedYear === year
                    ? "bg-sunlit-gold text-primary font-bold"
                    : "bg-primary text-white hover:bg-secondary"
                }`}>
                {year}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8">
            <h3 className="text-base sm:text-lg font-medium text-primary">
              No winners available
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Check back later for winner announcements.
            </p>
          </div>
        )}

        {/* Winners Carousel */}
        {winnersData[selectedYear]?.length > 0 && (
          <div className="relative">
            <div
              ref={carouselRef}
              className="flex overflow-x-hidden scroll-smooth snap-x snap-mandatory"
              style={{ scrollbarWidth: "none" }}>
              {winnerCards}
            </div>

            {/* Carousel Controls and Indicators */}
            {winnersData[selectedYear].length > 1 && (
              <div className="flex flex-col items-center mt-4 sm:mt-6 gap-3">
                {/* Navigation Buttons */}
                <div className="flex justify-center items-center space-x-4 sm:space-x-6">
                  <button
                    onClick={handlePrev}
                    className="sm:absolute sm:left-2 sm:top-1/2 sm:-translate-y-1/2 bg-primary bg-opacity-80 hover:bg-opacity-100 p-2 sm:p-3 rounded-full shadow-lg transition-all"
                    aria-label="Previous winner">
                    <FiChevronLeft className="text-lg sm:text-xl" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="sm:absolute sm:right-2 sm:top-1/2 sm:-translate-y-1/2 bg-primary bg-opacity-80 hover:bg-opacity-100 p-2 sm:p-3 rounded-full shadow-lg transition-all"
                    aria-label="Next winner">
                    <FiChevronRight className="text-lg sm:text-xl" />
                  </button>
                </div>

                {/* Carousel Indicators */}
                <div className="flex justify-center space-x-2">
                  {winnersData[selectedYear].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setActiveIndex(index);
                        setAutoScroll(false);
                        setTimeout(() => setAutoScroll(true), 10000);
                      }}
                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                        index === activeIndex
                          ? "bg-sunlit-gold w-4 sm:w-6"
                          : "bg-primary"
                      }`}
                      aria-label={`Go to winner ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Alert Component */}
        {showAlert && (
          <div className="fixed bottom-4 right-4 z-50">
            <Alert
              variant={alertConfig.variant}
              onClose={() => setShowAlert(false)}>
              <AlertDescription>{alertConfig.message}</AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
};

export default WinnersPage;
