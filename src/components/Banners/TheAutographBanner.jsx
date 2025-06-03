import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, Avatar, Chip } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import autographImage from "../../assets/images2/autograph2.png";

const MagazineBanner = () => {
  return (
    <div className="relative bg-gray-100 min-h-[300px] md:min-h-[400px] flex items-center ">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 blur-sm"
        style={{ backgroundImage: `url(${autographImage})` }}
      />

      <div className="relative max-w-6xl mx-auto px-4 w-full">
        <div className="text-center md:text-left">
          {/* Simplified Header */}
          <h2 className="text-xl sm:text-2xl md:text-4xl font-bold mb-4">
            Explore Nigeria's
            <br />
            <span className="text-red-600">Premium Lifestyle Digest</span>
          </h2>

          {/* Carousel */}
          <AutographMagazineCarousel />
        </div>
      </div>
    </div>
  );
};

export default MagazineBanner;

export const AutographMagazineCarousel = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const [showControls, setShowControls] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          "https://autoapi.theautographcollections.ng/api/getAllFashion?startIndex=0&limit=30"
        );
        const data = await response.json();
        const shuffled = [...data.posts].sort(() => 0.5 - Math.random());
        setArticles(shuffled.slice(0, 10));
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleCardClick = (slug) => {
    window.open(
      `https://www.theautographcollections.ng/content/${slug}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current && !isScrolling) {
      setIsScrolling(true);
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth * 0.8;

      container.scrollBy({
        left: direction === "next" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });

      setTimeout(() => setIsScrolling(false), 500);
    }
  };

  const stripHtml = (html) => {
    return html.replace(/<[^>]*>/g, "").substring(0, 80) + "...";
  };

  if (isLoading) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-600" />
      </div>
    );
  }

  return (
    <div
      className="relative w-full max-w-full mx-auto my-4 md:my-8"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}>
      <div className="p-2 bg-gradient-to-r from-purple-900 to-purple-700 text-red-500 rounded-t-lg">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center justify-center">
          <span className="mr-2">✨</span> Autograph Magazine Features
          <span className="ml-2">✨</span>
        </h2>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto py-4 px-2 sm:py-6 sm:px-4 snap-x snap-mandatory hide-scrollbar bg-gradient-to-b from-purple-50 to-white rounded-b-lg"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {articles.map((article) => (
          <Card
            key={article._id}
            onClick={() => handleCardClick(article.slug)}
            className="flex-shrink-0 w-64 sm:w-72 md:w-80 snap-start overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-1 active:scale-95">
            {/* Image Section */}
            <div className="h-40 sm:h-48 relative">
              <img
                src={`https://autoapi.theautographcollections.ng/${article.image1}`}
                alt={article.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/placeholder-magazine.jpg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <Chip
                label={article.postType}
                size="small"
                className="absolute z-50 top-2 left-2 font-medium"
                sx={{
                  backgroundColor: "red", // Red background
                  color: "white", // White text
                  "& .MuiChip-label": {
                    color: "white", // Ensure text is white
                    paddingLeft: "8px",
                    paddingRight: "8px",
                  },
                }}
              />
            </div>

            {/* Content Section */}
            <div className="p-3 sm:p-4">
              <h3 className="font-bold text-sm sm:text-base md:text-lg line-clamp-2 mb-2 text-gray-800">
                {article.title}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 mb-3">
                {stripHtml(article.content)}
              </p>

              {/* Author and Date Section */}
              <div className="flex items-center justify-between border-t pt-2 sm:pt-3">
                <div className="flex items-center gap-2">
                  <Avatar
                    src={article.authorId?.image || "/default-avatar.png"}
                    alt={article.authorId?.name}
                    sx={{ width: 24, height: 24 }}
                    className="sm:w-7 sm:h-7"
                  />
                  <span className="text-xs font-medium text-gray-700 truncate max-w-[80px] sm:max-w-[100px]">
                    {article.authorId?.name || "Unknown Author"}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <AccessTimeIcon sx={{ fontSize: 12 }} />
                  <time dateTime={article.createdAt}>
                    {format(new Date(article.createdAt), "MMM d, yyyy")}
                  </time>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Navigation Controls */}
      {articles.length > 0 && (
        <div
          className={`absolute inset-y-0 left-0 right-0 flex items-center justify-between px-1 sm:px-2 pointer-events-none transition-opacity duration-200 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              scroll("prev");
            }}
            className="pointer-events-auto p-1 sm:p-2 rounded-full bg-white/90 shadow-md hover:bg-white transition-colors"
            aria-label="Previous article">
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-purple-800" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              scroll("next");
            }}
            className="pointer-events-auto p-1 sm:p-2 rounded-full bg-white/90 shadow-md hover:bg-white transition-colors"
            aria-label="Next article">
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-purple-800" />
          </button>
        </div>
      )}

      {/* View All Button */}
      <div className="text-center mt-4 sm:mt-6">
        <Link target="_blank" to={"https://www.theautographcollections.ng"}>
          <button className="px-1 py-1 sm:px-4 sm:py-2 bg-purple-600 text-gray-900 border border-red-400 text-sm sm:text-base rounded-full hover:bg-purple-700 transition-colors shadow-md flex items-center mx-auto">
            View All Articles
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
          </button>
        </Link>
      </div>
    </div>
  );
};
