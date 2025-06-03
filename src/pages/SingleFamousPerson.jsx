import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const backendURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:3001";

// Memoized Related Person Card
const RelatedPersonCard = memo(({ person }) => (
  <div className="flex-shrink-0 w-64">
    <Link to={`/SingleFamousPerson/${person.slug}`} className="block group">
      <div className="relative rounded-lg overflow-hidden shadow-md h-40 bg-gray-200">
        <img
          src={person.image || "/default-profile.jpg"}
          alt={person.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.src = "/default-profile.jpg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <span className="text-white font-medium">View Profile</span>
        </div>
      </div>
      <div className="mt-3">
        <h4 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
          {person.name}
        </h4>
        <p className="text-sm text-gray-600">{person.category}</p>
      </div>
    </Link>
  </div>
));

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="w-full max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Hero Section Skeleton */}
        <div className="h-64 md:h-96 w-full bg-gray-200 animate-pulse"></div>

        {/* Content Section Skeleton */}
        <div className="grid md:grid-cols-3 gap-8 p-6 md:p-8">
          <div className="md:col-span-2 space-y-4">
            <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse"></div>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
          <div className="md:col-span-1">
            <div className="bg-green-50 rounded-lg p-6 h-64 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Error Component
const ErrorComponent = memo(({ error, onRetry }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center py-16 bg-white rounded-xl shadow-sm max-w-md w-full">
      <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-red-600"
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
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {error || "Person not found"}
      </h3>
      <p className="text-gray-600 mb-6">
        Unable to load the person. Please try again later.
      </p>
      <Link
        to="/"
        className="inline-flex items-center px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
        aria-label="Back to famous people">
        Home
      </Link>
    </div>
  </div>
));

const SingleFamousPerson = () => {
  const { slug } = useParams();
  const [person, setPerson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [relatedPersons, setRelatedPersons] = useState([]);
  const [carouselScroll, setCarouselScroll] = useState(0);

  // Memoized fetch functions
  const fetchPerson = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${backendURL}/api/getFamousPersonBySlug/${slug}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch famous person");
      }
      const data = await res.json();
      setPerson(data);
      return data.category;
    } catch (err) {
      setError(err.message);
      console.error("Error fetching famous person:", err);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  const fetchRelatedPersons = useCallback(async (category, currentSlug) => {
    try {
      const res = await fetch(
        `${backendURL}/api/getFamousPeopleByCategory/${category}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch related persons");
      }
      const data = await res.json();
      const filteredData = data.filter((person) => person.slug !== currentSlug);
      setRelatedPersons(filteredData);
    } catch (err) {
      console.error("Error fetching related persons:", err);
    }
  }, []);

  useEffect(() => {
    fetchPerson().then((category) => {
      if (category) {
        fetchRelatedPersons(category, slug);
      }
    });
  }, [slug, fetchPerson, fetchRelatedPersons]);

  // Memoized video ID
  const videoId = useMemo(() => {
    if (!person || !person.videoLink) return null;
    const match = person.videoLink.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    ) || [null, person.videoLink];
    return match[1];
  }, [person]);

  // Memoized event handlers
  const handlePlayVideo = useCallback(() => {
    setShowVideoModal(true);
  }, []);

  const handleCloseVideo = useCallback(() => {
    setShowVideoModal(false);
  }, []);

  const scrollCarousel = useCallback((direction) => {
    const container = document.getElementById("related-persons-carousel");
    const scrollAmount = 300;

    if (direction === "left") {
      container.scrollLeft -= scrollAmount;
      setCarouselScroll((prev) => Math.max(0, prev - scrollAmount));
    } else {
      container.scrollLeft += scrollAmount;
      setCarouselScroll((prev) => prev + scrollAmount);
    }
  }, []);

  // Memoized social links
  const socialLinks = useMemo(
    () => [
      { icon: Twitter, href: "#", label: "Visit Twitter" },
      { icon: Facebook, href: "#", label: "Visit Facebook" },
      { icon: Linkedin, href: "#", label: "Visit LinkedIn" },
      { icon: Instagram, href: "#", label: "Visit Instagram" },
    ],
    []
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !person) {
    return <ErrorComponent error={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to={`/famousPeople/${person.category.toLowerCase().replace(/\s+/g, "-")}`}
            className="inline-flex items-center text-green-600 hover:text-green-800"
            aria-label={`Back to ${person.category} famous people`}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to {person.category} Famous People
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Hero Section */}
          <div className="relative">
            <div className="h-64 md:h-96 w-full bg-gray-200">
              <img
                src={person.image || "/default-profile.jpg"}
                alt={person.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src = "/default-profile.jpg";
                }}
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 md:p-8">
              <div className="max-w-4xl mx-auto">
                <span className="inline-block bg-yellow-500 text-green-900 text-xs font-semibold px-3 py-1 rounded-full mb-2">
                  {person.category}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  {person.name}
                </h1>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="grid md:grid-cols-3 gap-8 p-6 md:p-8">
            {/* Main Content */}
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold text-green-800 mb-4">
                About {person.name}
              </h2>
              <div
                className="prose max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: person.fullDescription }}
              />

              {/* Image Gallery */}
              {person.additionalImages?.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-green-800 mb-4">
                    Image Gallery
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {person.additionalImages.map((image, index) => (
                      <div
                        key={index}
                        className="relative rounded-lg overflow-hidden shadow-md">
                        <img
                          src={image}
                          alt={`${person.name} gallery image ${index + 1}`}
                          className="w-full h-48 object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = "/default-profile.jpg";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-green-50 rounded-lg p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-green-800 mb-4">
                  About {person.name}
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium">{person.category}</p>
                  </div>

                  <div className="pt-4 border-t border-green-200">
                    <h4 className="text-sm font-semibold text-gray-500 mb-3">
                      Connect
                    </h4>
                    <div className="flex space-x-4">
                      {person.profileLink && (
                        <a
                          href={person.profileLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800"
                          aria-label="Visit profile">
                          <Globe className="w-5 h-5" />
                        </a>
                      )}
                      {socialLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link.href}
                          className="text-green-600 hover:text-green-800"
                          aria-label={link.label}>
                          <link.icon className="w-5 h-5" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Section */}
          <div className="border-t border-gray-200 px-6 py-8 md:px-8">
            <h3 className="text-xl font-semibold text-green-800 mb-6">
              Highlight Video
            </h3>
            {videoId ? (
              <div className="max-w-md mx-start">
                <div
                  className="relative group rounded-xl overflow-hidden cursor-pointer shadow-lg transition-all hover:shadow-xl"
                  onClick={handlePlayVideo}
                  role="button"
                  aria-label={`Play highlight video for ${person.name}`}
                  tabIndex="0">
                  <div className="aspect-w-16 aspect-h-9 bg-black">
                    <img
                      src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                      alt={`Highlight video for ${person.name}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-red-600 text-white p-4 rounded-full transform group-hover:scale-110 transition-transform">
                      <Play size={24} className="fill-current" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white text-sm px-3 py-1 rounded-full flex items-center">
                    <Play size={14} className="mr-1" />
                    <span>{person.videoDuration || "Watch"}</span>
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-800">
                  {person.name} - {person.category}
                </h3>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-100 rounded-lg">
                <p className="text-gray-600">
                  No video available for this person. Check back later for
                  updates.
                </p>
              </div>
            )}
          </div>

          {/* Related Persons Carousel */}
          {relatedPersons.length > 0 && (
            <div className="border-t border-gray-200 px-6 py-8 md:px-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-green-800">
                  More from {person.category}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => scrollCarousel("left")}
                    disabled={carouselScroll === 0}
                    className={`p-2 rounded-full ${carouselScroll === 0 ? "text-gray-400 cursor-not-allowed" : "text-green-600 hover:bg-green-100"}`}
                    aria-label="Scroll carousel left">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => scrollCarousel("right")}
                    className="p-2 rounded-full text-green-600 hover:bg-green-100"
                    aria-label="Scroll carousel right">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div
                id="related-persons-carousel"
                className="relative overflow-hidden">
                <div
                  className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2"
                  style={{ scrollBehavior: "smooth" }}>
                  {relatedPersons.map((relatedPerson) => (
                    <RelatedPersonCard
                      key={relatedPerson._id}
                      person={relatedPerson}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && videoId && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={handleCloseVideo}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 z-10"
              aria-label="Close video">
              <X size={32} />
            </button>
            <div className="aspect-w-16 aspect-h-9 w-full">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                className="w-full h-full rounded-lg"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={`${person.name} - ${person.category}`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleFamousPerson;
