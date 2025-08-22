import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Search,
  Filter,
  Calendar,
  Eye,
  Clock,
  User,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  X,
  TrendingUp,
  BookOpen,
  Star,
} from "lucide-react";
import LoadingSpinner from "../components/tools/LoaddingSpinner";

const backendURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:3001";

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  const postsPerPage = 9;

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "popular", label: "Most Popular" },
    { value: "title", label: "Alphabetical" },
  ];

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${backendURL}/api/getPosts`);
        const mappedPosts = response.data.posts.map((post) => ({
          id: post._id,
          title: post.title,
          slug: post.slug,
          image1: post.image,
          postType: post.category,
          date: post.createdAt,
          views: post.views,
          author: post.authorId?.name || "Unknown Author",
          readTime: post.readTime,
          excerpt: post.content
            .replace(/<[^>]+>/g, "")
            .split(" ")
            .slice(0, 20)
            .join(" ")
            .concat("..."),
          featured: post.featured,
          tags: post.tags,
        }));
        setPosts(mappedPosts);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Dynamically generate categories from posts
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(posts.map((post) => post.postType))];
    return ["All", ...uniqueCategories];
  }, [posts]);

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || post.postType === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.date) - new Date(a.date);
        case "oldest":
          return new Date(a.date) - new Date(b.date);
        case "popular":
          return b.views - a.views;
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, sortBy, posts]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredAndSortedPosts.slice(
    startIndex,
    startIndex + postsPerPage
  );

  // Recent posts for sidebar
  const recentPosts = useMemo(
    () => posts.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3),
    [posts]
  );

  // Popular posts for sidebar
  const popularPosts = useMemo(
    () => posts.sort((a, b) => b.views - a.views).slice(0, 3),
    [posts]
  );

  // Featured posts for sidebar
  const featuredPosts = useMemo(
    () => posts.filter((post) => post.featured).slice(0, 3),
    [posts]
  );

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { All: posts.length };
    categories.slice(1).forEach((category) => {
      counts[category] = posts.filter(
        (post) => post.postType === category
      ).length;
    });
    return counts;
  }, [posts, categories]);

  const getPostTypeColor = (postType) => {
    switch (postType) {
      case "Web3-&-Blockchain-Education":
        return "bg-red-500";
      case "Entertainment":
        return "bg-blue-500";
      case "Business":
        return "bg-green-500";
      case "LifeStyle":
        return "bg-pink-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 mx-1 rounded-lg text-sm font-medium transition-all duration-200 ${
            currentPage === i
              ? "bg-green-500 text-white shadow-lg"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-700"
          }`}>
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-6 sm:mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-50 dark:hover:bg-gray-700 transition-all duration-200">
          <ChevronLeft size={20} />
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-3 py-2 mx-1 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-700 transition-all duration-200">
              1
            </button>
            {startPage > 2 && <span className="text-gray-500">...</span>}
          </>
        )}

        {pages}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="text-gray-500">...</span>
            )}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="px-3 py-2 mx-1 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-700 transition-all duration-200">
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-50 dark:hover:bg-gray-700 transition-all duration-200">
          <ChevronRight size={20} />
        </button>
      </div>
    );
  };

  const renderPostCard = (post) => {
    const isGridView = viewMode === "grid";

    return (
      <article
        key={post.id}
        className={`group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 ${
          isGridView ? "h-auto" : "flex flex-row"
        }`}>
        <div
          className={`relative overflow-hidden ${isGridView ? "h-48 sm:h-56" : "w-1/3 h-auto"}`}>
          <img
            loading="lazyLoading"
            src={post.image1}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Category Badge */}
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
            <span
              className={`${getPostTypeColor(post.postType)} text-white text-xs sm:text-sm px-2 py-1 rounded-full uppercase font-semibold tracking-wide`}>
              {post.postType}
            </span>
          </div>

          {post.featured && (
            <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
              <Star size={16} className="text-yellow-400 fill-current" />
            </div>
          )}
        </div>

        <div className={`mid:p-3 sm:p-2 ${isGridView ? "" : "flex-1"}`}>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200">
            {post.title}
          </h2>

          <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 sm:mb-4 line-clamp-3">
            {post.excerpt}
          </p>

          {/* Meta Information */}
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs sm:text-sm mb-2 sm:mb-4">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-1">
                <Calendar size={12} sm:size={14} />
                <span>{formatDate(post.date)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye size={12} sm:size={14} />
                <span>{post.views.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Author and Read More */}
          <div className="flex items-center justify-between">
            <a
              href={`/Posts/${post.slug}`}
              className="bg-green-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-sm font-medium flex items-center gap-1 sm:gap-2 hover:bg-green-600 transition-all duration-200 hover:scale-105">
              Read More
              <ArrowRight size={12} sm:size={14} />
            </a>
          </div>
        </div>
      </article>
    );
  };

  const renderSidebarSection = (title, posts, icon) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-2 sm:mb-4">
        {icon}
        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>
      <div className="space-y-3 sm:space-y-4">
        {posts.map((post, index) => (
          <div
            key={post.id}
            className="flex gap-2 sm:gap-3 group cursor-pointer">
            <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={post.image1}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="flex-1 min-w-0">
              <a
                href={`/Posts/${post.slug}`}
                className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                {post.title}
              </a>
              <div className="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span>{formatDate(post.date)}</span>
                <span className="flex items-center gap-0.5 sm:gap-1">
                  <Eye size={8} sm:size={10} />
                  {post.views.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  //  Render loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className=" mid:px-4 mid:mt-12 min-h-screen bg-gray-50 dark:bg-gray-900  sm:mt-16">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-start lg:items-center justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-blue-600 dark:from-gray-200 dark:to-blue-400 leading-tight">
                Blog Posts
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1 sm:mt-2 text-sm sm:text-base">
                Showing {filteredAndSortedPosts.length} posts
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent w-full"
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-gray-600 text-green-600 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}>
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-white dark:bg-gray-600 text-green-600 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}>
                  <List size={16} />
                </button>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200">
                <Filter size={16} />
                Filters
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div className="flex flex-wrap gap-4 sm:gap-6 items-center">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category:
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-1 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm sm:text-base">
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category} ({categoryCounts[category]})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sort by:
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm sm:text-base">
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                    setSortBy("newest");
                    setCurrentPage(1);
                  }}
                  className="flex items-center gap-1 px-3 py-1 sm:py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
                  <X size={14} />
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          {/* Main Content Area */}
          <main className="flex-1">
            {currentPosts.length > 0 ? (
              <div>
                <div
                  className={`grid gap-4 sm:gap-6 ${
                    viewMode === "grid"
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-1"
                  }`}>
                  {currentPosts.map(renderPostCard)}
                </div>
                {totalPages > 1 && renderPagination()}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <BookOpen
                  size={48}
                  sm:size={64}
                  className="mx-auto text-gray-400 mb-4"
                />
                <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-2">
                  No posts found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="lg:w-80 space-y-4 sm:space-y-6">
            {/* Categories */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">
                Categories
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-1 sm:py-2 rounded-lg transition-all duration-200 ${
                      selectedCategory === category
                        ? "bg-green-500 text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}>
                    <span className="font-medium">{category}</span>
                    <span className="float-right text-xs sm:text-sm opacity-75">
                      ({categoryCounts[category]})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Posts */}
            {renderSidebarSection(
              "Recent Posts",
              recentPosts,
              <Clock size={16} className="text-blue-500" />
            )}

            {/* Popular Posts */}
            {renderSidebarSection(
              "Popular Posts",
              popularPosts,
              <TrendingUp size={16} className="text-red-500" />
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
