import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Eye, User } from "lucide-react";

const BlogSection = () => {
  const [inView, setInView] = useState(false);
  const [blogData, setBlogData] = useState([]);
  const backendURL =
    import.meta.env.MODE === "production"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:3001";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("blog-section");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${backendURL}/api/getPosts?limit=50`);
        const data = await res.json();
        if (res.ok) {
          const posts = data.posts || [];
          const latestPosts = posts
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 4);
          setBlogData(latestPosts);
        }
      } catch (err) {
        console.error("Failed to fetch posts for BlogSection", err);
      }
    };
    fetchPosts();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderCard = (item, size = "small") => {
    if (!item) return null;

    const cardClasses = `
      relative block group overflow-hidden h-full rounded-lg
      ${size === "large" ? "col-span-full sm:col-span-2" : ""}
    `;

    return (
      <Link to={`/Posts/${item.slug}`} className={cardClasses}>
        <div
          className="relative h-full min-h-[200px] sm:min-h-[250px] bg-gray-200 dark:bg-gray-800/20 border border-gray-300/20 dark:border-accent-charcoalDark/30"
          style={{
            transform: inView ? "translateY(0)" : "translateY(10px)",
            opacity: inView ? 1 : 0,
            transition: "all 0.4s ease-out",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = inView
              ? "translateY(-3px)"
              : "translateY(10px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = inView
              ? "translateY(0)"
              : "translateY(10px)";
          }}>
          <img
            src={`${item.image}`}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 dark:from-accent-charcoal/80 via-black/40 dark:via-accent-charcoalDark/40 to-transparent" />
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
            <span
              className={`
                ${
                  item.category === "Fashion" || item.category === "LifeStyle"
                    ? "bg-secondary-light"
                    : item.category === "Entertainment" ||
                        item.category === "Business"
                      ? "bg-primary-light"
                      : item.category === "Big Data & A.I Trends" ||
                          item.category === "Big Data & A.I Education" ||
                          item.category === "Web3-&-Blockchain-Education"
                        ? "bg-primary-dark"
                        : "bg-accent-warmGrey"
                }
                text-white dark:text-white text-xs px-2 sm:px-3 py-1 rounded-sm uppercase font-medium
              `}>
              {item.category}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4">
            <h2
              className={`text-white dark:text-white font-bold mb-1 sm:mb-2 line-clamp-2 group-hover:text-secondary-light dark:group-hover:text-secondary-darkMode transition-colors
                ${
                  size === "large"
                    ? "text-lg sm:text-xl lg:text-2xl"
                    : "text-base sm:text-lg"
                }
              `}>
              {item.title}
            </h2>
            <div className="flex items-center justify-between text-white dark:text-white text-xs">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Calendar size={12} className="text-white dark:text-white" />
                  <span>{formatDate(item.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye size={12} className="text-white dark:text-white" />
                  <span>{item.views}</span>
                </div>
              </div>
              {size === "large" && (
                <div className="flex items-center space-x-1">
                  <User size={12} className="text-white dark:text-white" />
                  <span>{item.authorId?.name || "Unknown Author"}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <section
      id="blog-section"
      className="relative w-full overflow-hidden bg-gray-50 dark:bg-primary-customDark dark:to-accent-charcoal py-6 lg:py-8">
      <div className="absolute inset-0 bg-gradient-to-t from-gray-100/30 dark:from-transparent dark:to-primary-darkMode/30" />

      {[...Array(4)].map((_, i) => (
        <span
          key={i}
          className="absolute w-0.5 h-0.5 bg-secondary-light/20 dark:bg-secondary-darkMode/20 rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 1}s`,
            animationDuration: `${2 + Math.random() * 1}s`,
          }}
        />
      ))}

      <div className="relative z-10 mx-auto max-w-screen-2xl px-2 sm:px-4 py-2 sm:py-6">
        <div
          className="text-center mb-4"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(15px)",
            transition: "all 0.4s ease-out",
          }}>
          <h2 className="text-3xl mb-4 md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary dark:from-primary-darkMode via-secondary dark:via-secondary-darkMode to-accent-teal dark:to-accent-teal leading-tight">
            Blog Posts
          </h2>
          <p
            className="text-sm text-gray-700 dark:text-accent-charcoalDark max-w-lg mx-auto"
            style={{
              transitionDelay: "0.2s",
            }}>
            Discover insights, trends, and stories across business,
            spirituality, innovation, and technology.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 h-full">
          {blogData.length > 0 && (
            <div
              className="col-span-2 sm:col-span-2 h-full"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(15px)",
                transition: "all 0.4s ease-out",
                transitionDelay: "0s",
              }}>
              {renderCard(blogData[0], "large")}
            </div>
          )}

          <div
            className="h-full"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(15px)",
              transition: "all 0.4s ease-out",
              transitionDelay: "0.05s",
            }}>
            {blogData.length > 1 && (
              <div className="h-full">{renderCard(blogData[1])}</div>
            )}
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-1 gap-2 h-full"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(15px)",
              transition: "all 0.4s ease-out",
              transitionDelay: "0.1s",
            }}>
            {blogData.length > 2 && (
              <div className="h-full">{renderCard(blogData[2])}</div>
            )}
            {blogData.length > 3 && (
              <div className="h-full">{renderCard(blogData[3])}</div>
            )}
          </div>
        </div>

        <div
          className="text-center mt-4"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(15px)",
            transition: "all 0.4s ease-out",
            transitionDelay: "0.15s",
          }}>
          <Link to="/Blog">
            <button
              className="bg-gradient-to-r from-primary to-secondary dark:from-primary-darkMode dark:to-secondary-darkMode text-white px-3 py-1 rounded-full font-semibold text-base flex items-center gap-1 mx-auto hover:from-primary-light hover:to-secondary-light dark:hover:from-primary-light dark:hover:to-secondary-light transition-all duration-200 shadow-md hover:shadow-primary/30 hover:scale-105"
              onMouseDown={(e) => (e.currentTarget.style.scale = "0.95")}
              onMouseUp={(e) => (e.currentTarget.style.scale = "1.05")}
              onMouseLeave={(e) => (e.currentTarget.style.scale = "1")}>
              View All Posts
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
