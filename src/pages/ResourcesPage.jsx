import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  Heart,
  BookOpen,
  Headphones,
  Video,
  FileText,
  Archive,
  Calendar,
  User,
  Clock,
  Grid,
  List,
  X,
  Share2,
} from "lucide-react";
import { Alert, AlertDescription } from "../components/tools/Alert"; // Adjust path as needed
import { CheckCircle, AlertCircle } from "lucide-react";
import ResourcesImage from "../assets/images/resources2.jpg";
import backendURL from "../config";
import LoaddingSpinner from "../components/tools/LoaddingSpinner";

const UmoruResourcesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFormat, setSelectedFormat] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [showModal, setShowModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [downloading, setDownloading] = useState(new Set());
  const [favorites, setFavorites] = useState(new Set());

  // Debug: Log showFilters state
  useEffect(() => {
    console.log("showFilters state:", showFilters);
  }, [showFilters]);

  const showAlertMessage = (message, variant) => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${backendURL}/api/resources`);
        const data = await res.json();
        console.log("Fetched resources:", data);
        if (res.ok && data.success) {
          setResources(data.resources);
        } else {
          throw new Error(data.message || "Failed to fetch resources");
        }
      } catch (error) {
        console.error("Error fetching resources:", error);
        showAlertMessage("Failed to fetch resources", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const getFormatIcon = (format) => {
    switch (format.toLowerCase()) {
      case "pdf":
        return <FileText className="w-4 h-4 text-accent-teal" />;
      case "mp3":
        return <Headphones className="w-4 h-4 text-accent-teal" />;
      case "mp4":
        return <Video className="w-4 h-4 text-accent-teal" />;
      case "epub":
        return <BookOpen className="w-4 h-4 text-accent-teal" />;
      default:
        return <Archive className="w-4 h-4 text-accent-teal" />;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Spirituality":
        return "🕉️";
      case "Health & Wellness":
        return "🌱";
      case "Education":
        return "📚";
      case "Finance":
        return "💰";
      case "Arts & Creativity":
        return "🎨";
      default:
        return "📁";
    }
  };

  const stripHtml = (html) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const filteredResources = resources.filter((resource) => {
    const authorNames = resource.author
      .map((a) => a.name)
      .join(" ")
      .toLowerCase();
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      authorNames.includes(searchTerm.toLowerCase()) ||
      (resource.tags || []).some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === "all" || resource.category === selectedCategory;
    const matchesFormat =
      selectedFormat === "all" ||
      resource.format.toLowerCase() === selectedFormat.toLowerCase();
    return matchesSearch && matchesCategory && matchesFormat;
  });

  const sortedResources = [...filteredResources].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.date) - new Date(a.date);
      case "oldest":
        return new Date(a.date) - new Date(b.date);
      case "popular":
        return (b.downloads || 0) - (a.downloads || 0);
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const handleDownload = async (resource) => {
    try {
      setDownloading((prev) => new Set([...prev, resource._id]));
      const res = await fetch(
        `${backendURL}/api/resources/${resource._id}/download`,
        {
          method: "PUT",
        }
      );
      const data = await res.json();
      console.log("Download response:", data);
      if (res.ok && data.success) {
        setResources((prev) =>
          prev.map((r) =>
            r._id === resource._id
              ? { ...r, downloads: data.data.downloads }
              : r
          )
        );
        const link = document.createElement("a");
        link.href = resource.url;
        link.download = `${resource.title}.${resource.format.toLowerCase()}`;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        throw new Error(data.message || "Failed to increment download count");
      }
    } catch (error) {
      console.error("Error incrementing download:", error);
      showAlertMessage("Failed to download resource", "error");
    } finally {
      setDownloading((prev) => {
        const newSet = new Set(prev);
        newSet.delete(resource._id);
        return newSet;
      });
    }
  };

  const toggleFavorite = (resourceId) => {
    setFavorites((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(resourceId)) {
        newSet.delete(resourceId);
      } else {
        newSet.add(resourceId);
      }
      return newSet;
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedFormat("all");
    setSortBy("newest");
    setShowFilters(false);
  };

  if (loading)
    return (
      <>
        <LoaddingSpinner />
      </>
    );

  return (
    <div className="min-h-screen bg-accent-cream dark:bg-accent-creamDark text-primary-dark dark:text-accent-charcoalDark mt-16r">
      {/* Hero Section */}
      <div className="relative bg-primary-dark dark:bg-primary-darkMode bg-hero-gradient dark:bg-hero-gradient-dark overflow-hidden">
        <img
          src={ResourcesImage}
          alt="Library background"
          className="absolute inset-0 w-full h-full object-cover opacity-20 z-0"
        />
        <div className="relative container mx-auto px-6 py-20 z-10">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-primary-light">
              Umoru Resource Library
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
              Discover, Learn, and Grow with Our Curated Collection
            </p>
            <div className="flex justify-center space-x-8 text-lg">
              <div className="flex items-center bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                <Download className="w-5 h-5 mr-2 text-accent-green" />
                <span>
                  {resources
                    .reduce((sum, r) => sum + (r.downloads || 0), 0)
                    .toLocaleString()}{" "}
                  Downloads
                </span>
              </div>
              <div className="flex items-center bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                <Archive className="w-5 h-5 mr-2 text-accent-teal" />
                <span>{resources.length} Resources</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Controls Bar */}
        <div className="sticky top-0 z-40 bg-accent-cream/95 dark:bg-accent-creamDark/95 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-accent-charcoalDark/20 shadow-lg mb-8 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-accent-charcoal dark:text-accent-charcoalDark" />
                <input
                  type="text"
                  placeholder="Search resources, authors, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-accent-charcoal/20 dark:border-accent-charcoalDark/20 bg-white/90 dark:bg-primary-customDark/90 text-primary-dark dark:text-accent-charcoalDark placeholder-accent-charcoal/50 dark:placeholder-accent-charcoalDark/50 focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all"
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
              className="md:hidden flex items-center px-4 py-3 rounded-xl border-2 border-accent-charcoal/20 dark:border-accent-charcoalDark/20 bg-white/90 dark:bg-primary-customDark/90 text-primary-dark dark:text-accent-charcoalDark hover:bg-primary-light/20 dark:hover:bg-primary-darkMode/20 transition-all">
              <Filter className="w-4 h-4 mr-2 text-accent-teal" />
              Filters
            </button>
            <div className="flex items-center space-x-2">
              <div className="flex rounded-xl p-1 bg-accent-cream/70 dark:bg-accent-creamDark/70">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-primary-light text-white" : "text-accent-charcoal dark:text-accent-charcoalDark hover:bg-primary-light/20 dark:hover:bg-primary-darkMode/20"}`}>
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-primary-light text-white" : "text-accent-charcoal dark:text-accent-charcoalDark hover:bg-primary-light/20 dark:hover:bg-primary-darkMode/20"}`}>
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <div
            className={`mt-4 pt-4 border-t border-accent-charcoal/20 dark:border-accent-charcoalDark/20 ${showFilters ? "block" : "hidden"} md:block`}>
            <div className="flex flex-wrap items-center gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 rounded-xl border-2 border-accent-charcoal/20 dark:border-accent-charcoalDark/20 bg-white/90 dark:bg-primary-customDark/90 text-primary-dark dark:text-accent-charcoalDark focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all">
                {[
                  "all",
                  "Spirituality",
                  "Health & Wellness",
                  "Education",
                  "Finance",
                  "Arts & Creativity",
                ].map((category) => (
                  <option key={category} value={category}>
                    {category === "all"
                      ? "All Categories"
                      : `${getCategoryIcon(category)} ${category}`}
                  </option>
                ))}
              </select>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="px-4 py-3 rounded-xl border-2 border-accent-charcoal/20 dark:border-accent-charcoalDark/20 bg-white/90 dark:bg-primary-customDark/90 text-primary-dark dark:text-accent-charcoalDark focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all">
                {["all", "PDF", "MP3", "MP4", "EPUB"].map((format) => (
                  <option key={format} value={format}>
                    {format === "all" ? "All Formats" : format}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 rounded-xl border-2 border-accent-charcoal/20 dark:border-accent-charcoalDark/20 bg-white/90 dark:bg-primary-customDark/90 text-primary-dark dark:text-accent-charcoalDark focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all">
                {[
                  { value: "newest", label: "Newest First" },
                  { value: "oldest", label: "Oldest First" },
                  { value: "popular", label: "Most Downloaded" },
                  { value: "title", label: "Alphabetical" },
                ].map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {(searchTerm ||
                selectedCategory !== "all" ||
                selectedFormat !== "all" ||
                sortBy !== "newest") && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-3 text-sm text-primary-light hover:text-primary-dark font-medium transition-colors">
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-accent-charcoal dark:text-accent-charcoalDark">
            Showing {sortedResources.length} of {resources.length} resources
          </p>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedResources.map((resource) => (
              <div
                key={resource._id}
                className="group bg-accent-cream dark:bg-accent-creamDark rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-accent-charcoalDark/20">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={resource.thumbnail}
                    alt={resource.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent"></div>
                  <div className="absolute top-4 left-4 flex space-x-2">
                    <div className="flex items-center px-3 py-1 rounded-full bg-white/20 dark:bg-primary-darkMode/20 backdrop-blur-sm text-white text-sm font-medium">
                      {getFormatIcon(resource.format)}
                      <span className="ml-2">{resource.format}</span>
                    </div>
                    <div className="flex items-center px-3 py-1 rounded-full bg-white/20 dark:bg-primary-darkMode/20 backdrop-blur-sm text-white text-sm font-medium">
                      <Download className="w-3 h-3 mr-1 text-accent-green" />
                      <span>{resource.downloads || 0}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFavorite(resource._id)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/20 dark:bg-primary-darkMode/20 backdrop-blur-sm hover:bg-white/30 dark:hover:bg-primary-darkMode/30 transition-colors">
                    <Heart
                      className={`w-4 h-4 ${favorites.has(resource._id) ? "fill-secondary text-secondary" : "text-white"}`}
                    />
                  </button>
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-primary-light/80 dark:bg-primary-darkMode/80 backdrop-blur-sm text-white text-sm font-medium">
                      {getCategoryIcon(resource.category)} {resource.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary-light transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-accent-charcoal dark:text-accent-charcoalDark mb-3 line-clamp-2">
                    {stripHtml(resource.description)}
                  </p>
                  <div className="flex items-center text-sm text-accent-charcoal/80 dark:text-accent-charcoalDark/80 mb-4">
                    <User className="w-4 h-4 mr-1 text-accent-teal" />
                    <span className="mr-4">
                      {resource.author.map((a) => a.name).join(", ")}
                    </span>
                    <Calendar className="w-4 h-4 mr-1 text-accent-teal" />
                    <span>{formatDate(resource.date)}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownload(resource)}
                      disabled={downloading.has(resource._id)}
                      className="flex-1 flex items-center justify-center w-auto bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:from-primary-light hover:to-secondary-light transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                      {downloading.has(resource._id) ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </>
                      )}
                    </button>
                    <button className="p-3 rounded-xl border-2 border-accent-charcoal/20 dark:border-accent-charcoalDark/20 hover:bg-primary-light/10 dark:hover:bg-primary-darkMode/10 transition-colors">
                      <Share2 className="w-4 h-4 text-accent-charcoal dark:text-accent-charcoalDark" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedResources.map((resource) => (
              <div
                key={resource._id}
                className="bg-accent-cream dark:bg-accent-creamDark rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-accent-charcoalDark/20">
                <div className="flex items-center gap-6">
                  <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden">
                    <img
                      src={resource.thumbnail}
                      alt={resource.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-lg mb-1 text-primary-dark dark:text-accent-charcoalDark">
                          {resource.title}
                        </h3>
                        <p className="text-sm text-accent-charcoal dark:text-accent-charcoalDark mb-2 line-clamp-1">
                          {stripHtml(resource.description)}
                        </p>
                        <div className="flex items-center text-sm text-accent-charcoal/80 dark:text-accent-charcoalDark/80 space-x-4">
                          <span className="flex items-center">
                            <User className="w-4 h-4 mr-1 text-accent-teal" />
                            {resource.author.map((a) => a.name).join(", ")}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1 text-accent-teal" />
                            {resource.duration || "N/A"}
                          </span>
                          <span className="flex items-center">
                            <Download className="w-4 h-4 mr-1 text-accent-green" />
                            {resource.downloads || 0}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleFavorite(resource._id)}
                          className="p-2 rounded-full bg-white/20 dark:bg-primary-darkMode/20 backdrop-blur-sm hover:bg-white/30 dark:hover:bg-primary-darkMode/30 transition-colors">
                          <Heart
                            className={`w-4 h-4 ${favorites.has(resource._id) ? "fill-secondary text-secondary" : "text-accent-charcoal dark:text-accent-charcoalDark"}`}
                          />
                        </button>
                        <button
                          onClick={() => handleDownload(resource)}
                          disabled={downloading.has(resource._id)}
                          className="flex items-center px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:from-primary-light hover:to-secondary-light transition-all disabled:opacity-50">
                          {downloading.has(resource._id) ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Downloading...
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {sortedResources.length === 0 && (
          <div className="text-center py-16">
            <div className="text-8xl mb-6 text-accent-charcoal dark:text-accent-charcoalDark">
              🔍
            </div>
            <h3 className="text-2xl font-bold mb-4 text-primary-dark dark:text-accent-charcoalDark">
              No resources found
            </h3>
            <p className="text-accent-charcoal dark:text-accent-charcoalDark mb-6 max-w-md mx-auto">
              Try adjusting your search terms or filters
            </p>
            <button
              onClick={clearFilters}
              className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:from-primary-light hover:to-secondary-light transition-all">
              Clear All Filters
            </button>
          </div>
        )}

        {showModal && selectedResource && (
          <div className="fixed inset-0 bg-dark/50 dark:bg-dark/70 flex items-center justify-center z-50 p-4">
            <div className="max-w-md w-full rounded-xl shadow-2xl bg-accent-cream dark:bg-accent-creamDark border border-white/20 dark:border-accent-charcoalDark/20">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-xl font-semibold text-primary-dark dark:text-accent-charcoalDark">
                    Download Resource
                  </h4>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 rounded-lg hover:bg-primary-light/10 dark:hover:bg-primary-darkMode/10 transition-colors">
                    <X className="w-5 h-5 text-accent-charcoal dark:text-accent-charcoalDark" />
                  </button>
                </div>
                <div className="mb-4">
                  <h5 className="font-medium mb-2 text-primary-dark dark:text-accent-charcoalDark">
                    {selectedResource.title}
                  </h5>
                  <p className="text-sm text-accent-charcoal dark:text-accent-charcoalDark">
                    Format: {selectedResource.format} | Size:{" "}
                    {selectedResource.size}
                  </p>
                  <p className="text-sm text-accent-charcoal dark:text-accent-charcoalDark">
                    Author:{" "}
                    {selectedResource.author.map((a) => a.name).join(", ")}
                  </p>
                  <p className="text-sm text-accent-charcoal dark:text-accent-charcoalDark">
                    Downloads: {selectedResource.downloads || 0}
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleDownload(selectedResource)}
                    disabled={downloading.has(selectedResource._id)}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:from-primary-light hover:to-secondary-light transition-all disabled:opacity-50">
                    {downloading.has(selectedResource._id) ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline"></div>
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2 inline" />
                        Confirm Download
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl border-2 border-accent-charcoal/20 dark:border-accent-charcoalDark/20 text-accent-charcoal dark:text-accent-charcoalDark hover:bg-primary-light/10 dark:hover:bg-primary-darkMode/10 transition-colors">
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

export default UmoruResourcesPage;
