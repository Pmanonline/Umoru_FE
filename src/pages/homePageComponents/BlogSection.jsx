// import React, { useState, useEffect } from "react";
// import { Calendar, Eye, ArrowRight, Clock, User } from "lucide-react";
// import { Link } from "react-router-dom";

// const BlogSection = () => {
//   const [inView, setInView] = useState(false);
//   const backendURL =
//     import.meta.env.MODE === "production"
//       ? import.meta.env.VITE_BACKEND_URL
//       : "http://localhost:3001";

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setInView(true);
//         }
//       },
//       { threshold: 0.1 }
//     );

//     const element = document.getElementById("blog-section");
//     if (element) observer.observe(element);

//     return () => observer.disconnect();
//   }, []);

//   const [blogData, setBlogData] = useState([]);

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const res = await fetch(`${backendURL}/api/getPosts?limit=50`);
//         const data = await res.json();
//         if (res.ok) {
//           const posts = data.posts || [];
//           // Shuffle array and select first 4 random posts
//           const shuffledPosts = posts
//             .sort(() => 0.5 - Math.random())
//             .slice(0, 4);
//           setBlogData(shuffledPosts);
//         }
//       } catch (err) {
//         console.error("Failed to fetch posts for sidebar", err);
//       }
//     };
//     fetchPosts();
//   }, []);

//   const getPostTypeColor = (postType) => {
//     switch (postType) {
//       case "Big Data & A.I Education":
//       case "Web3-&-Blockchain-Education":
//         return "bg-red-500";
//       case "Big Data & A.I Trends":
//         return "bg-green-500";
//       case "Entertainment":
//         return "bg-blue-500";
//       case "LifeStyle":
//         return "bg-pink-500";
//       default:
//         return "bg-gray-500";
//     }
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     });
//   };

//   const renderCard = (item, size = "small") => {
//     if (!item) return null;

//     const cardClasses = `
//       relative block group overflow-hidden h-[100%] rounded-lg
//       ${size === "large" ? "col-span-2 lg:col-span-2" : ""}
//     `;

//     return (
//       <Link to={`/Posts/${item.slug}`} className="block h-full">
//         <div
//           className={cardClasses}
//           style={{
//             transform: inView ? "translateY(0)" : "translateY(10px)",
//             opacity: inView ? 1 : 0,
//             transition: "all 0.4s ease-out",
//           }}
//           onMouseEnter={(e) => {
//             e.currentTarget.style.transform = inView
//               ? "translateY(-3px)"
//               : "translateY(10px)";
//           }}
//           onMouseLeave={(e) => {
//             e.currentTarget.style.transform = inView
//               ? "translateY(0)"
//               : "translateY(10px)";
//           }}>
//           <div className="relative h-full min-h-[150px] lg:min-h-[220px] bg-gray-200 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300 dark:border-gray-700/50 rounded-lg overflow-hidden">
//             <img
//               src={item.image}
//               alt={item.title}
//               className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-60"
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-black/80 dark:from-gray-900/80 via-black/40 dark:via-gray-800/40 to-transparent" />

//             {/* Category Badge */}
//             <div className="absolute top-2 left-2">
//               <span
//                 className={`
//                 ${getPostTypeColor(item.category)}
//                 text-white text-xs px-2 py-0.5 rounded-full uppercase font-semibold tracking-wide
//               `}>
//                 {item.category}
//               </span>
//             </div>

//             {/* Content */}
//             <div className="absolute bottom-0 left-0 right-0 p-2 lg:p-3">
//               <h2
//                 className={`text-white dark:text-white font-bold mb-1 line-clamp-2 group-hover:text-green-300 transition-colors
//                 ${
//                   size === "large"
//                     ? "text-lg lg:text-xl"
//                     : "text-base lg:text-lg"
//                 }
//               `}>
//                 {item.title}
//               </h2>

//               {size === "large" && (
//                 <p className="text-gray-50 hover:text-red-300 dark:text-gray-300 text-xs lg:text-sm mb-1 line-clamp-1">
//                   {item.content
//                     ? item.content
//                         .replace(/<\/?[^>]+(>|$)/g, "")
//                         .split(".")[0] + "."
//                     : ""}
//                 </p>
//               )}

//               {/* Meta Information */}
//               <div className="flex items-center justify-between text-gray-600 dark:text-gray-400 text-xs">
//                 <div className="flex items-center space-x-2">
//                   <div className="flex items-center space-x-1">
//                     <Calendar
//                       size={12}
//                       className="text-green-500 dark:text-green-400"
//                     />
//                     <span className="text-gray-400 dark:text-teal-400">
//                       {formatDate(item.createdAt)}
//                     </span>
//                   </div>
//                   <div className="flex items-center space-x-1">
//                     <Eye size={12} className="text-white dark:text-teal-400" />
//                     <span className="text-gray-300 dark:text-teal-400">
//                       {item.views}
//                     </span>
//                   </div>
//                 </div>

//                 {size === "large" && (
//                   <div className="flex items-center space-x-1">
//                     <User
//                       size={12}
//                       className="text-white dark:text-purple-400"
//                     />
//                     <span className="text-white dark:text-purple-400">
//                       {item.authorId.name}
//                     </span>
//                   </div>
//                 )}
//               </div>

//               {size === "large" && (
//                 <div className="flex items-center justify-between mt-1">
//                   <div className="flex items-center space-x-1 text-xs text-gray-400 dark:text-gray-500">
//                     <Clock size={10} />
//                     <span>{item.readTime}</span>
//                   </div>
//                   <button
//                     className="bg-green-500/20 text-white dark:text-green-400 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-0.5 hover:bg-green-500/30 transition-all duration-200 hover:scale-105"
//                     onMouseDown={(e) => (e.currentTarget.style.scale = "0.95")}
//                     onMouseUp={(e) => (e.currentTarget.style.scale = "1.05")}
//                     onMouseLeave={(e) => (e.currentTarget.style.scale = "1")}>
//                     Read More
//                     <ArrowRight size={10} />
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </Link>
//     );
//   };

//   const getStaggerDelay = (index) => `${index * 0.05}s`;

//   return (
//     <section
//       id="blog-section"
//       className="mid:px-5 relative w-full overflow-hidden bg-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 py-6 lg:py-8">
//       <div className="absolute inset-0 bg-gradient-to-t from-gray-200/50 dark:from-black/50 to-transparent" />

//       {[...Array(4)].map((_, i) => (
//         <span
//           key={i}
//           className="absolute w-0.5 h-0.5 bg-green-400/20 rounded-full animate-pulse"
//           style={{
//             left: `${Math.random() * 100}%`,
//             top: `${Math.random() * 100}%`,
//             animationDelay: `${Math.random() * 1}s`,
//             animationDuration: `${2 + Math.random() * 1}s`,
//           }}
//         />
//       ))}

//       <div className="relative z-10 mx-auto max-w-screen-xl px-2 lg:px-4">
//         <div
//           className="text-center mb-4"
//           style={{
//             opacity: inView ? 1 : 0,
//             transform: inView ? "translateY(0)" : "translateY(15px)",
//             transition: "all 0.4s ease-out",
//           }}>
//           <h2 className="text-3xl mb-4 md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-blue-600 dark:from-gray-200 dark:to-blue-400 leading-tight">
//             Blog Posts
//           </h2>
//           <p
//             className="text-sm text-gray-600 dark:text-gray-300 max-w-lg mx-auto"
//             style={{
//               transitionDelay: "0.2s",
//             }}>
//             Discover insights, trends, and stories across business,
//             Spirituality, Innovation, and Technology.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-3">
//           {blogData.length > 0 && (
//             <div
//               className="md:col-span-2"
//               style={{
//                 opacity: inView ? 1 : 0,
//                 transform: inView ? "translateY(0)" : "translateY(15px)",
//                 transition: "all 0.4s ease-out",
//                 transitionDelay: getStaggerDelay(0),
//               }}>
//               {renderCard(blogData[0], "large")}
//             </div>
//           )}

//           {blogData.length > 1 && (
//             <div
//               style={{
//                 opacity: inView ? 1 : 0,
//                 transform: inView ? "translateY(0)" : "translateY(15px)",
//                 transition: "all 0.4s ease-out",
//                 transitionDelay: getStaggerDelay(1),
//               }}>
//               {renderCard(blogData[1])}
//             </div>
//           )}

//           <div
//             className="grid grid-cols-1 gap-2 lg:gap-3"
//             style={{
//               opacity: inView ? 1 : 0,
//               transform: inView ? "translateY(0)" : "translateY(15px)",
//               transition: "all 0.4s ease-out",
//               transitionDelay: getStaggerDelay(2),
//             }}>
//             {blogData.length > 2 && <div>{renderCard(blogData[2])}</div>}
//             {blogData.length > 3 && <div>{renderCard(blogData[3])}</div>}
//           </div>
//         </div>

//         <div
//           className="text-center mt-4"
//           style={{
//             opacity: inView ? 1 : 0,
//             transform: inView ? "translateY(0)" : "translateY(15px)",
//             transition: "all 0.4s ease-out",
//             transitionDelay: getStaggerDelay(3),
//           }}>
//           <Link to={"/Blog"}>
//             <button
//               className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-3 py-1 rounded-full font-semibold text-base flex items-center gap-1 mx-auto hover:from-green-600 hover:to-teal-600 transition-all duration-200 shadow-md hover:shadow-green-500/20 hover:scale-105"
//               onMouseDown={(e) => (e.currentTarget.style.scale = "0.95")}
//               onMouseUp={(e) => (e.currentTarget.style.scale = "1.05")}
//               onMouseLeave={(e) => (e.currentTarget.style.scale = "1")}>
//               View All Posts
//               <ArrowRight size={16} />
//             </button>
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default BlogSection;

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
          // Sort posts by createdAt descending and take the latest 4
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
          className="relative h-full min-h-[200px] sm:min-h-[250px] bg-gray-200 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-700/50"
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 dark:from-gray-900/80 via-black/40 dark:via-gray-800/40 to-transparent" />
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
            <span
              className={`
                ${
                  item.category === "Fashion" || item.category === "LifeStyle"
                    ? "bg-pink-600"
                    : item.category === "Entertainment" ||
                        item.category === "Business"
                      ? "bg-blue-600"
                      : item.category === "Big Data & A.I Trends" ||
                          item.category === "Big Data & A.I Education" ||
                          item.category === "Web3-&-Blockchain-Education"
                        ? "bg-green-600"
                        : "bg-gray-500"
                }
                text-white dark:text-white text-xs px-2 sm:px-3 py-1 rounded-sm uppercase font-medium
              `}>
              {item.category}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4">
            <h2
              className={`text-white dark:text-white font-bold mb-1 sm:mb-2 line-clamp-2 group-hover:text-green-300 dark:group-hover:text-green-300 transition-colors
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
      className="relative w-full overflow-hidden bg-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 py-6 lg:py-8">
      <div className="absolute inset-0 bg-gradient-to-t from-gray-200/50 dark:from-black/50 to-transparent" />

      {[...Array(4)].map((_, i) => (
        <span
          key={i}
          className="absolute w-0.5 h-0.5 bg-green-400/20 rounded-full animate-pulse"
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
          <h2 className="text-3xl mb-4 md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-blue-600 dark:from-white dark:to-blue-400 leading-tight">
            Blog Posts
          </h2>
          <p
            className="text-sm text-gray-600 dark:text-white max-w-lg mx-auto"
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
              className="bg-gradient-to-r from-green-500 to-teal-500 text-white dark:text-white px-3 py-1 rounded-full font-semibold text-base flex items-center gap-1 mx-auto hover:from-green-600 hover:to-teal-600 dark:hover:from-green-600 dark:hover:to-teal-600 transition-all duration-200 shadow-md hover:shadow-green-500/20 hover:scale-105"
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
