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
import { Alert, AlertDescription } from "../components/tools/Alert";
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

      // First, update the download count on the server
      const countRes = await fetch(
        `${backendURL}/api/resources/${resource._id}/download`,
        {
          method: "PUT",
        }
      );
      const countData = await countRes.json();
      console.log("Download count response:", countData);

      if (countRes.ok && countData.success) {
        // Update the local state with new download count
        setResources((prev) =>
          prev.map((r) =>
            r._id === resource._id
              ? { ...r, downloads: countData.data.downloads }
              : r
          )
        );
      }

      // Now fetch the actual file content
      const fileResponse = await fetch(resource.url, {
        method: "GET",
        mode: "cors", // Enable CORS
      });

      if (!fileResponse.ok) {
        throw new Error(`Failed to fetch file: ${fileResponse.status}`);
      }

      // Get the file as a blob
      const blob = await fileResponse.blob();

      // Create a temporary URL for the blob
      const blobUrl = window.URL.createObjectURL(blob);

      // Create and trigger download
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${resource.title}.${resource.format.toLowerCase()}`;
      link.style.display = "none"; // Hide the link

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the blob URL to free memory
      window.URL.revokeObjectURL(blobUrl);

      showAlertMessage("Download started successfully!", "success");
    } catch (error) {
      console.error("Error downloading file:", error);

      // Fallback: if blob download fails, use the original method
      if (error.message.includes("CORS") || error.message.includes("fetch")) {
        console.log("CORS error detected, falling back to direct link...");
        try {
          const link = document.createElement("a");
          link.href = resource.url;
          link.download = `${resource.title}.${resource.format.toLowerCase()}`;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          showAlertMessage(
            "Download initiated (may open in new tab)",
            "success"
          );
        } catch (fallbackError) {
          console.error("Fallback download also failed:", fallbackError);
          showAlertMessage("Failed to download resource", "error");
        }
      } else {
        showAlertMessage("Failed to download resource", "error");
      }
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
      <div className="min-h-screen flex items-center justify-center bg-accent-cream dark:bg-accent-creamDark">
        <LoaddingSpinner />
      </div>
    );
  return (
    <div className="min-h-screen bg-accent-cream dark:bg-gray-600 text-primary-dark dark:text-white mt-12">
      {/* Hero Section - Compact */}
      <div className="relative bg-primary-dark dark:bg-primary-darkMode bg-hero-gradient dark:bg-hero-gradient-dark overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative container mx-auto px-4 py-12 z-10 max-w-6xl">
          <div className="text-center text-white">
            <h1 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-primary-light">
              Resource Library
            </h1>
            <p className="text-sm mb-6 opacity-90 max-w-lg mx-auto">
              Discover, Learn, and Grow with Our Curated Collection
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <div className="flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                <Download className="w-3 h-3 mr-1 text-accent-green" />
                <span>
                  {resources
                    .reduce((sum, r) => sum + (r.downloads || 0), 0)
                    .toLocaleString()}{" "}
                  Downloads
                </span>
              </div>
              <div className="flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                <Archive className="w-3 h-3 mr-1 text-accent-teal" />
                <span>{resources.length} Resources</span>
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
                  placeholder="Search resources..."
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
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-2 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-primary-dark dark:text-white focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all">
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
                className="px-2 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-primary-dark dark:text-white focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all">
                {["all", "PDF", "MP3", "MP4", "EPUB"].map((format) => (
                  <option key={format} value={format}>
                    {format === "all" ? "All Formats" : format}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-primary-dark dark:text-white focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all">
                {[
                  { value: "newest", label: "Newest" },
                  { value: "oldest", label: "Oldest" },
                  { value: "popular", label: "Popular" },
                  { value: "title", label: "A-Z" },
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
                  className="px-2 py-1.5 text-xs text-primary-light hover:text-primary-dark dark:hover:text-white font-medium transition-colors">
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mb-3">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Showing {sortedResources.length} of {resources.length} resources
          </p>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {sortedResources.map((resource) => (
              <div
                key={resource._id}
                className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700">
                {/* Compact Image */}
                <div className="relative h-24 overflow-hidden">
                  <img
                    src={resource.thumbnail}
                    alt={resource.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                  {/* Top badges */}
                  <div className="absolute top-1 left-1 flex gap-1">
                    <div className="flex items-center px-1.5 py-0.5 rounded-full bg-black/30 backdrop-blur-sm text-white text-xs font-medium">
                      {getFormatIcon(resource.format)}
                      <span className="ml-1">{resource.format}</span>
                    </div>
                  </div>

                  {/* Download count */}
                  <div className="absolute top-1 right-1">
                    <div className="flex items-center px-1.5 py-0.5 rounded-full bg-black/30 backdrop-blur-sm text-white text-xs">
                      <Download className="w-2.5 h-2.5 mr-1 text-accent-green" />
                      <span>{resource.downloads || 0}</span>
                    </div>
                  </div>

                  {/* Favorite button */}
                  <button
                    onClick={() => toggleFavorite(resource._id)}
                    className="absolute bottom-1 right-1 p-1 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors">
                    <Heart
                      className={`w-3 h-3 ${favorites.has(resource._id) ? "fill-red-500 text-red-500" : "text-white"}`}
                    />
                  </button>

                  {/* Category */}
                  <div className="absolute bottom-1 left-1">
                    <span className="px-1.5 py-0.5 rounded-full bg-primary/80 backdrop-blur-sm text-white text-xs font-medium">
                      {getCategoryIcon(resource.category)}
                    </span>
                  </div>
                </div>

                {/* Compact Content */}
                <div className="p-2">
                  <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                    {resource.title}
                  </h3>

                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2 leading-tight">
                    {stripHtml(resource.description)}
                  </p>

                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2 gap-2">
                    <span className="flex items-center">
                      <User className="w-2.5 h-2.5 mr-1" />
                      {resource.author[0].name.split(" ")[0]}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-2.5 h-2.5 mr-1" />
                      {formatDate(resource.date)}
                    </span>
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setSelectedResource(resource);
                        setShowModal(true);
                      }}
                      className="flex-1 flex items-center justify-center px-2 py-1.5 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium text-xs hover:from-primary-light hover:to-secondary-light transition-all">
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </button>
                    <button className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <Share2 className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {sortedResources.map((resource) => (
              <div
                key={resource._id}
                className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden">
                    <img
                      src={resource.thumbnail}
                      alt={resource.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm mb-0.5 text-primary-dark dark:text-white line-clamp-1">
                          {resource.title}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 line-clamp-1">
                          {stripHtml(resource.description)}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-3">
                          <span className="flex items-center">
                            <User className="w-2.5 h-2.5 mr-1" />
                            {resource.author[0].name}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-2.5 h-2.5 mr-1" />
                            {resource.duration || "N/A"}
                          </span>
                          <span className="flex items-center">
                            <Download className="w-2.5 h-2.5 mr-1 text-accent-green" />
                            {resource.downloads || 0}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleFavorite(resource._id)}
                          className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <Heart
                            className={`w-3.5 h-3.5 ${favorites.has(resource._id) ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                          />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedResource(resource);
                            setShowModal(true);
                          }}
                          className="flex items-center px-3 py-1.5 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium text-xs hover:from-primary-light hover:to-secondary-light transition-all">
                          <Download className="w-3 h-3 mr-1" />
                          Download
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
          <div className="text-center py-12">
            <div className="text-4xl mb-3 text-gray-400">🔍</div>
            <h3 className="text-lg font-semibold mb-2 text-primary-dark dark:text-white">
              No resources found
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
        )}

        {/* Compact Modal */}
        {showModal && selectedResource && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="max-w-sm w-full rounded-lg shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-base font-semibold text-primary-dark dark:text-white">
                    Download Resource
                  </h4>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                <div className="mb-4">
                  <h5 className="font-medium text-sm mb-2 text-primary-dark dark:text-white line-clamp-2">
                    {selectedResource.title}
                  </h5>
                  <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                    <p>
                      Format: {selectedResource.format} | Size:{" "}
                      {selectedResource.size}
                    </p>
                    <p>
                      Author:{" "}
                      {selectedResource.author.map((a) => a.name).join(", ")}
                    </p>
                    <p>Downloads: {selectedResource.downloads || 0}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(selectedResource)}
                    disabled={downloading.has(selectedResource._id)}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium text-sm hover:from-primary-light hover:to-secondary-light transition-all disabled:opacity-50">
                    {downloading.has(selectedResource._id) ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="w-3 h-3 mr-2" />
                        Confirm
                      </>
                    )}
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

        {/* Compact Alert */}
        {showAlert && (
          <div className="fixed top-4 right-4 z-50">
            <div
              className={`flex items-center px-4 py-3 rounded-lg shadow-lg border max-w-sm ${
                alertConfig.variant === "success"
                  ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400"
                  : "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-700 dark:text-red-400"
              }`}>
              {alertConfig.variant === "success" ? (
                <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              )}
              <span className="text-sm font-medium">{alertConfig.message}</span>
              <button
                onClick={() => setShowAlert(false)}
                className="ml-3 p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UmoruResourcesPage;
