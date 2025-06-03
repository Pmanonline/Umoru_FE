import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Globe,
  Play,
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  X,
} from "lucide-react";

const backendURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:3001";

const SingleAward = () => {
  const { slug } = useParams();
  const [award, setAward] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

  useEffect(() => {
    const fetchAward = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${backendURL}/api/getAwardBySlug/${slug}`);
        if (!res.ok) {
          throw new Error("Failed to fetch award");
        }
        const data = await res.json();
        setAward(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching award:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAward();
  }, [slug]);

  const getVideoId = () => {
    if (!award) return null;

    if (award.videoID) return award.videoID;

    if (!award.videoLink) return null;

    const match = award.videoLink.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return match ? match[1] : null;
  };

  const videoId = getVideoId();

  const handlePlayVideo = () => {
    setShowVideoModal(true);
  };

  const handleCloseVideo = () => {
    setShowVideoModal(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-accent-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg sm:text-xl text-gray-700">Loading award...</p>
        </div>
      </div>
    );
  }

  if (error || !award) {
    return (
      <div className="min-h-screen bg-accent-cream flex items-center justify-center">
        <div className="text-center py-12 bg-white rounded-xl shadow-sm max-w-md w-full">
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
            {error || "Award not found"}
          </h3>
          <p className="text-gray-600 mb-4 sm:mb-6 text-xs sm:text-sm">
            Unable to load the award. Please try again later.
          </p>
          <Link
            to={`/country/${award?.country.toLowerCase()}`}
            className="inline-flex items-center px-4 sm:px-6 py-1.5 sm:py-2 bg-sunlit-gold text-primary rounded-lg font-medium hover:bg-secondary transition-colors text-xs sm:text-sm"
            aria-label="Back to awards">
            Back to Awards
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-accent-cream">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to={`/country/${award.country.toLowerCase()}`}
            className="inline-flex items-center text-primary hover:text-primary/80 text-xs sm:text-sm"
            aria-label={`Back to ${award.country} awards`}>
            <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
            Back to {award.country} Awards
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="relative">
            <div className="h-64 md:h-96 w-full bg-gray-200">
              <img
                src={award.image}
                alt={award.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/images/awards/default.jpg";
                }}
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 sm:p-6 md:p-8">
              <div className="max-w-4xl mx-auto">
                <span className="inline-block bg-sunlit-gold text-primary text-xs font-semibold px-3 py-1 rounded-full mb-2">
                  {award.category}
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {award.name}
                </h1>
                <p className="text-lg sm:text-xl text-gray-200 mt-1">
                  {award.award} ({award.year})
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 p-4 sm:p-6 md:p-8">
            <div className="md:col-span-2">
              <h2 className="text-lg sm:text-xl font-bold text-primary mb-4">
                Award Recognition
              </h2>
              <div
                className="prose max-w-none text-gray-700 text-xs sm:text-sm"
                dangerouslySetInnerHTML={{ __html: award.fullDescription }}
              />

              <h3 className="text-base sm:text-lg font-semibold text-primary mt-6 sm:mt-8 mb-4">
                Key Achievements
              </h3>
              <ul className="space-y-3">
                {award.achievements && award.achievements.length > 0 ? (
                  award.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 mt-1 mr-3">
                        <svg
                          className="w-4 sm:w-5 h-4 sm:h-5 text-primary"
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
                      </span>
                      <span className="text-gray-700 text-xs sm:text-sm">
                        {achievement}
                      </span>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500 text-xs sm:text-sm">
                    No achievements listed yet.
                  </p>
                )}
              </ul>
            </div>

            <div className="md:col-span-1">
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 sticky top-6">
                <h3 className="text-base sm:text-lg font-semibold text-primary mb-4">
                  About the Award
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500">Category</p>
                    <p className="font-medium text-xs sm:text-sm">
                      {award.category}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Year Awarded</p>
                    <p className="font-medium text-xs sm:text-sm">
                      {award.year}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Country</p>
                    <p className="font-medium text-xs sm:text-sm">
                      {award.country}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Continent</p>
                    <p className="font-medium text-xs sm:text-sm">
                      {award.continent}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-xs font-semibold text-gray-500 mb-3">
                      Connect
                    </h4>
                    <div className="flex space-x-4">
                      {award.socialMedia?.website && (
                        <a
                          href={award.socialMedia.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80"
                          aria-label="Visit website">
                          <Globe className="w-4 sm:w-5 h-4 sm:h-5" />
                        </a>
                      )}
                      {award.socialMedia?.twitter && (
                        <a
                          href={award.socialMedia.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80"
                          aria-label="Visit Twitter">
                          <Twitter className="w-4 sm:w-5 h-4 sm:h-5" />
                        </a>
                      )}
                      {award.socialMedia?.facebook && (
                        <a
                          href={award.socialMedia.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80"
                          aria-label="Visit Facebook">
                          <Facebook className="w-4 sm:w-5 h-4 sm:h-5" />
                        </a>
                      )}
                      {award.socialMedia?.linkedin && (
                        <a
                          href={award.socialMedia.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80"
                          aria-label="Visit LinkedIn">
                          <Linkedin className="w-4 sm:w-5 h-4 sm:h-5" />
                        </a>
                      )}
                      {award.socialMedia?.instagram && (
                        <a
                          href={award.socialMedia.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80"
                          aria-label="Visit Instagram">
                          <Instagram className="w-4 sm:w-5 h-4 sm:h-5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {award.profileLink && (
                    <div className="pt-4">
                      <Link
                        to={award.profileLink}
                        className="w-full flex justify-center items-center px-4 sm:px-6 py-2 sm:py-3 bg-sunlit-gold hover:bg-secondary text-primary font-medium rounded-lg shadow-sm transition-colors text-xs sm:text-sm"
                        aria-label={`View full profile of ${award.name}`}>
                        View Full Profile
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 px-4 sm:px-6 py-6 sm:py-8 md:px-8">
            <h3 className="text-base sm:text-lg font-semibold text-primary mb-4 sm:mb-6">
              Award Highlight Video
            </h3>
            {videoId ? (
              <div className="max-w-md mx-start">
                <div
                  className="relative group rounded-xl overflow-hidden cursor-pointer shadow-lg transition-all hover:shadow-xl"
                  onClick={handlePlayVideo}
                  role="button"
                  aria-label={`Play highlight video for ${award.name}`}
                  tabIndex="0">
                  <div className="aspect-w-16 aspect-h-9 bg-black">
                    <img
                      src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                      alt={`Highlight video for ${award.name}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-primary text-white p-3 sm:p-4 rounded-full transform group-hover:scale-110 transition-transform">
                      <Play size={20} className="fill-current" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white text-xs px-3 py-1 rounded-full flex items-center">
                    <Play size={14} className="mr-1" />
                    <span>{award.videoDuration || "Watch"}</span>
                  </div>
                </div>
                <h3 className="mt-4 text-base sm:text-lg font-medium text-gray-800">
                  {award.name} - {award.award}
                </h3>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-100 rounded-lg">
                <p className="text-gray-600 text-xs sm:text-sm">
                  No video available for this award. Check back later for
                  updates.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showVideoModal && videoId && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={handleCloseVideo}
              className="absolute -top-10 sm:-top-12 right-0 text-white hover:text-gray-300 z-10"
              aria-label="Close video">
              <X size={28} />
            </button>
            <div className="aspect-w-16 aspect-h-9 w-full">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                className="w-full h-full rounded-lg"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={`${award.name} - ${award.award}`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleAward;
