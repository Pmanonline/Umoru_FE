// import React, { useState, useEffect } from "react";
// import { Calendar, Eye, ArrowRight, Clock, User } from "lucide-react";
// import { Link } from "react-router-dom";

// const BlogSection = () => {
//   const [inView, setInView] = useState(false);

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

//   const [blogData, setBlogData] = useState({
//     fashionItems: [],
//     businessItems: [],
//     entertainmentItems: [],
//     lifestyleItems: [],
//   });

//   // Dummy data - replace with API calls when ready
//   const dummyData = {
//     fashionItems: [
//       {
//         id: 1,
//         title: "From Runway to Real Life: How to Wear Bold Prints This Season",
//         slug: "runway-bold-prints-season",
//         image1:
//           "https://thecontentpanel.com/wp-content/uploads/2021/11/blog-post-ideas-7.jpg",
//         postType: "Fashion",
//         date: "2025-07-20",
//         views: 1250,
//         author: "Sarah Johnson",
//         readTime: "5 min read",
//         excerpt:
//           "Discover the art of incorporating runway trends into your everyday wardrobe with confidence and style.",
//       },
//       {
//         id: 2,
//         title: "Sustainable Fashion: Building an Eco-Friendly Wardrobe",
//         slug: "sustainable-fashion-eco-wardrobe",
//         image1:
//           "https://raelyntan.com/wp-content/uploads/2016/09/what-to-blog-about-hori-2.png",
//         postType: "Fashion",
//         date: "2025-07-18",
//         views: 980,
//         author: "Emma Chen",
//         readTime: "7 min read",
//         excerpt:
//           "Learn how to make conscious fashion choices that benefit both your style and the planet.",
//       },
//     ],
//     businessItems: [
//       {
//         id: 3,
//         title:
//           "The Rise of Remote Work: How to Build a Successful Virtual Team",
//         slug: "remote-work-virtual-team-success",
//         image1:
//           "https://raelyntan.com/wp-content/uploads/2016/09/what-to-blog-about-hori-2.png",
//         postType: "Business",
//         date: "2025-07-22",
//         views: 2100,
//         author: "Michael Torres",
//         readTime: "8 min read",
//         excerpt:
//           "Essential strategies for managing and motivating remote teams in the modern workplace.",
//       },
//       {
//         id: 4,
//         title: "AI in Business: Transforming Industries Through Innovation",
//         slug: "ai-business-industry-transformation",
//         image1:
//           "https://raelyntan.com/wp-content/uploads/2016/09/what-to-blog-about-hori-2.png",
//         postType: "Business",
//         date: "2025-07-19",
//         views: 1800,
//         author: "Dr. Alex Kumar",
//         readTime: "6 min read",
//         excerpt:
//           "Exploring how artificial intelligence is revolutionizing business operations across various sectors.",
//       },
//     ],
//     entertainmentItems: [
//       {
//         id: 5,
//         title: "Top 10 Must-Watch Movies of the Year",
//         slug: "top-movies-2025",
//         image1:
//           "https://raelyntan.com/wp-content/uploads/2016/09/what-to-blog-about-hori-2.png",
//         postType: "Entertainment",
//         date: "2025-07-25",
//         views: 3200,
//         author: "James Wilson",
//         readTime: "4 min read",
//         excerpt:
//           "Our curated list of the most compelling films that defined cinema this year.",
//       },
//     ],
//     lifestyleItems: [
//       {
//         id: 6,
//         title: "Relationships and Social Life: Building Meaningful Connections",
//         slug: "relationships-social-life-connections",
//         image1: "/api/placeholder/600/400",
//         postType: "LifeStyle",
//         date: "2025-07-23",
//         views: 1650,
//         author: "Lisa Rodriguez",
//         readTime: "5 min read",
//         excerpt:
//           "Tips for nurturing authentic relationships and creating a fulfilling social life.",
//       },
//     ],
//   };

//   useEffect(() => {
//     // Simulate API fetch
//     const fetchData = async () => {
//       try {
//         // In real implementation, replace with actual API calls
//         setBlogData(dummyData);
//       } catch (error) {
//         console.error("Error fetching blog data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const getPostTypeColor = (postType) => {
//     switch (postType) {
//       case "Fashion":
//         return "bg-red-500";
//       case "Entertainment":
//         return "bg-blue-500";
//       case "Business":
//         return "bg-green-500";
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
//       relative block group overflow-hidden h-[100%] rounded-xl
//       ${size === "large " ? "col-span-2 lg:col-span-2" : ""}
//     `;

//     return (
//       <Link to={`/Post/${item.slug}`} className="block h-full">
//         <div
//           className={cardClasses}
//           style={{
//             transform: inView ? "translateY(0)" : "translateY(20px)",
//             opacity: inView ? 1 : 0,
//             transition: "all 0.6s ease-out",
//           }}
//           onMouseEnter={(e) => {
//             e.currentTarget.style.transform = inView
//               ? "translateY(-5px)"
//               : "translateY(20px)";
//           }}
//           onMouseLeave={(e) => {
//             e.currentTarget.style.transform = inView
//               ? "translateY(0)"
//               : "translateY(20px)";
//           }}>
//           <div className="relative h-full min-h-[250px] lg:min-h-[300px] bg-gray-200 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300 dark:border-gray-700/50 rounded-xl overflow-hidden">
//             <img
//               src={item.image1}
//               alt={item.title}
//               className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-60"
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-black/90 dark:from-gray-900/90 via-black/50 dark:via-gray-800/50 to-transparent" />

//             {/* Category Badge */}
//             <div className="absolute top-4 left-4">
//               <span
//                 className={`
//                 ${getPostTypeColor(item.postType)}
//                 text-white text-xs px-3 py-1 rounded-full uppercase font-semibold tracking-wide
//               `}>
//                 {item.postType}
//               </span>
//             </div>

//             {/* Content */}
//             <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
//               <h2
//                 className={`text-white dark:text-white font-bold mb-2 line-clamp-2 group-hover:text-green-300 transition-colors
//                 ${
//                   size === "large"
//                     ? "text-xl lg:text-2xl xl:text-3xl"
//                     : "text-lg lg:text-xl"
//                 }
//               `}>
//                 {item.title}
//               </h2>

//               {size === "large" && (
//                 <p className="text-gray-50 hover:text-red-300 dark:text-gray-300 text-sm lg:text-base mb-3 line-clamp-2">
//                   {item.excerpt}
//                 </p>
//               )}

//               {/* Meta Information */}
//               <div className="flex items-center justify-between text-gray-600 dark:text-gray-400 text-xs lg:text-sm">
//                 <div className="flex items-center space-x-4">
//                   <div className="flex items-center space-x-1">
//                     <Calendar
//                       size={14}
//                       className="text-green-500 dark:text-green-400"
//                     />
//                     <span className="text-gray-400 dark:text-teal-400">
//                       {formatDate(item.date)}
//                     </span>
//                   </div>
//                   <div className="flex items-center space-x-1">
//                     <Eye size={14} className="text-white dark:text-teal-400" />
//                     <span className="text-gray-300 dark:text-teal-400">
//                       {item.views.toLocaleString()}
//                     </span>
//                   </div>
//                 </div>

//                 {size === "large" && (
//                   <div className="flex items-center space-x-2">
//                     <User
//                       size={14}
//                       className="text-white dark:text-purple-400"
//                     />
//                     <span className="text-white dark:text-purple-400">
//                       {item.author}
//                     </span>
//                   </div>
//                 )}
//               </div>

//               {size === "large" && (
//                 <div className="flex items-center justify-between mt-3">
//                   <div className="flex items-center space-x-1 text-xs text-gray-400 dark:text-gray-500">
//                     <Clock size={12} />
//                     <span>{item.readTime}</span>
//                   </div>
//                   <button
//                     className="bg-green-500/20 text-white dark:text-green-400 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 hover:bg-green-500/30 transition-all duration-200 hover:scale-105"
//                     onMouseDown={(e) => (e.currentTarget.style.scale = "0.95")}
//                     onMouseUp={(e) => (e.currentTarget.style.scale = "1.05")}
//                     onMouseLeave={(e) => (e.currentTarget.style.scale = "1")}>
//                     Read More
//                     <ArrowRight size={12} />
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </Link>
//     );
//   };

//   // Simple stagger effect with CSS transitions
//   const getStaggerDelay = (index) => `${index * 0.1}s`;

//   return (
//     <section
//       id="blog-section"
//       className="relative w-full overflow-hidden bg-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 py-12 lg:py-16">
//       {/* Background Effects */}
//       <div className="absolute inset-0 bg-gradient-to-t from-gray-200/50 dark:from-black/50 to-transparent" />

//       {/* Particle Effects */}
//       {[...Array(6)].map((_, i) => (
//         <span
//           key={i}
//           className="absolute w-1 h-1 bg-green-400/30 rounded-full animate-pulse"
//           style={{
//             left: `${Math.random() * 100}%`,
//             top: `${Math.random() * 100}%`,
//             animationDelay: `${Math.random() * 2}s`,
//             animationDuration: `${3 + Math.random() * 2}s`,
//           }}
//         />
//       ))}

//       <div className="relative z-10 mx-auto max-w-screen-2xl px-4 lg:px-8">
//         {/* Header */}
//         <div
//           className="text-center mb-12"
//           style={{
//             opacity: inView ? 1 : 0,
//             transform: inView ? "translateY(0)" : "translateY(30px)",
//             transition: "all 0.8s ease-out",
//           }}>
//           <h2
//             className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4"
//             style={{
//               transitionDelay: "0.2s",
//             }}>
//             Blog Posts
//             <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400 mt-1"></span>
//           </h2>
//           <p
//             className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
//             style={{
//               transitionDelay: "0.4s",
//             }}>
//             Discover insights, trends, and stories across business,
//             Spirituality, Innovation, and Technology.
//           </p>
//         </div>

//         {/* Blog Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
//           {/* Featured Fashion Post */}
//           {blogData.fashionItems.length > 0 && (
//             <div
//               className="lg:col-span-2"
//               style={{
//                 opacity: inView ? 1 : 0,
//                 transform: inView ? "translateY(0)" : "translateY(30px)",
//                 transition: "all 0.6s ease-out",
//                 transitionDelay: getStaggerDelay(0),
//               }}>
//               {renderCard(blogData.fashionItems[0], "large")}
//             </div>
//           )}

//           {/* Entertainment Post */}
//           {blogData.entertainmentItems.length > 0 && (
//             <div
//               style={{
//                 opacity: inView ? 1 : 0,
//                 transform: inView ? "translateY(0)" : "translateY(30px)",
//                 transition: "all 0.6s ease-out",
//                 transitionDelay: getStaggerDelay(1),
//               }}>
//               {renderCard(blogData.entertainmentItems[0])}
//             </div>
//           )}

//           {/* Right Column - Business and Lifestyle */}
//           <div
//             className="grid grid-cols-1 gap-4 lg:gap-6"
//             style={{
//               opacity: inView ? 1 : 0,
//               transform: inView ? "translateY(0)" : "translateY(30px)",
//               transition: "all 0.6s ease-out",
//               transitionDelay: getStaggerDelay(2),
//             }}>
//             {blogData.businessItems.length > 0 && (
//               <div>{renderCard(blogData.businessItems[0])}</div>
//             )}
//             {blogData.lifestyleItems.length > 0 && (
//               <div>{renderCard(blogData.lifestyleItems[0])}</div>
//             )}
//           </div>
//         </div>

//         {/* View All Button */}
//         <div
//           className="text-center mt-12"
//           style={{
//             opacity: inView ? 1 : 0,
//             transform: inView ? "translateY(0)" : "translateY(30px)",
//             transition: "all 0.6s ease-out",
//             transitionDelay: getStaggerDelay(3),
//           }}>
//           <Link to={"/Blog"}>
//             <button
//               className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-full font-semibold text-lg flex items-center gap-2 mx-auto hover:from-green-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-green-500/25 hover:scale-105"
//               onMouseDown={(e) => (e.currentTarget.style.scale = "0.95")}
//               onMouseUp={(e) => (e.currentTarget.style.scale = "1.05")}
//               onMouseLeave={(e) => (e.currentTarget.style.scale = "1")}>
//               View All Posts
//               <ArrowRight size={20} />
//             </button>
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default BlogSection;

import React, { useState, useEffect } from "react";
import { Calendar, Eye, ArrowRight, Clock, User } from "lucide-react";
import { Link } from "react-router-dom";

const BlogSection = () => {
  const [inView, setInView] = useState(false);
  const backendURL = "http://localhost:3001"; // Replace with your actual backend URL

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

  const [blogData, setBlogData] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${backendURL}/api/getPosts?limit=50`);
        const data = await res.json();
        if (res.ok) {
          const posts = data.posts || [];
          // Shuffle array and select first 4 random posts
          const shuffledPosts = posts
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);
          setBlogData(shuffledPosts);
        }
      } catch (err) {
        console.error("Failed to fetch posts for sidebar", err);
      }
    };
    fetchPosts();
  }, []);

  const getPostTypeColor = (postType) => {
    switch (postType) {
      case "Big Data & A.I Education":
      case "Web3-&-Blockchain-Education":
        return "bg-red-500";
      case "Big Data & A.I Trends":
        return "bg-green-500";
      case "Entertainment":
        return "bg-blue-500";
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

  const renderCard = (item, size = "small") => {
    if (!item) return null;

    const cardClasses = `
      relative block group overflow-hidden h-[100%] rounded-lg
      ${size === "large" ? "col-span-2 lg:col-span-2" : ""}
    `;

    return (
      <Link to={`/Posts/${item.slug}`} className="block h-full">
        <div
          className={cardClasses}
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
          <div className="relative h-full min-h-[150px] lg:min-h-[220px] bg-gray-200 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300 dark:border-gray-700/50 rounded-lg overflow-hidden">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 dark:from-gray-900/80 via-black/40 dark:via-gray-800/40 to-transparent" />

            {/* Category Badge */}
            <div className="absolute top-2 left-2">
              <span
                className={`
                ${getPostTypeColor(item.category)}
                text-white text-xs px-2 py-0.5 rounded-full uppercase font-semibold tracking-wide
              `}>
                {item.category}
              </span>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-2 lg:p-3">
              <h2
                className={`text-white dark:text-white font-bold mb-1 line-clamp-2 group-hover:text-green-300 transition-colors
                ${
                  size === "large"
                    ? "text-lg lg:text-xl"
                    : "text-base lg:text-lg"
                }
              `}>
                {item.title}
              </h2>

              {size === "large" && (
                <p className="text-gray-50 hover:text-red-300 dark:text-gray-300 text-xs lg:text-sm mb-1 line-clamp-1">
                  {item.content
                    ? item.content
                        .replace(/<\/?[^>]+(>|$)/g, "")
                        .split(".")[0] + "."
                    : ""}
                </p>
              )}

              {/* Meta Information */}
              <div className="flex items-center justify-between text-gray-600 dark:text-gray-400 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Calendar
                      size={12}
                      className="text-green-500 dark:text-green-400"
                    />
                    <span className="text-gray-400 dark:text-teal-400">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye size={12} className="text-white dark:text-teal-400" />
                    <span className="text-gray-300 dark:text-teal-400">
                      {item.views}
                    </span>
                  </div>
                </div>

                {size === "large" && (
                  <div className="flex items-center space-x-1">
                    <User
                      size={12}
                      className="text-white dark:text-purple-400"
                    />
                    <span className="text-white dark:text-purple-400">
                      {item.authorId.name}
                    </span>
                  </div>
                )}
              </div>

              {size === "large" && (
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center space-x-1 text-xs text-gray-400 dark:text-gray-500">
                    <Clock size={10} />
                    <span>{item.readTime}</span>
                  </div>
                  <button
                    className="bg-green-500/20 text-white dark:text-green-400 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-0.5 hover:bg-green-500/30 transition-all duration-200 hover:scale-105"
                    onMouseDown={(e) => (e.currentTarget.style.scale = "0.95")}
                    onMouseUp={(e) => (e.currentTarget.style.scale = "1.05")}
                    onMouseLeave={(e) => (e.currentTarget.style.scale = "1")}>
                    Read More
                    <ArrowRight size={10} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  };

  const getStaggerDelay = (index) => `${index * 0.05}s`;

  return (
    <section
      id="blog-section"
      className="mid:px-5 relative w-full overflow-hidden bg-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 py-6 lg:py-8">
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

      <div className="relative z-10 mx-auto max-w-screen-xl px-2 lg:px-4">
        <div
          className="text-center mb-4"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(15px)",
            transition: "all 0.4s ease-out",
          }}>
          <h2 className="text-3xl mb-4 md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-blue-600 dark:from-gray-200 dark:to-blue-400 leading-tight">
            Blog Posts
          </h2>
          <p
            className="text-sm text-gray-600 dark:text-gray-300 max-w-lg mx-auto"
            style={{
              transitionDelay: "0.2s",
            }}>
            Discover insights, trends, and stories across business,
            Spirituality, Innovation, and Technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-3">
          {blogData.length > 0 && (
            <div
              className="md:col-span-2"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(15px)",
                transition: "all 0.4s ease-out",
                transitionDelay: getStaggerDelay(0),
              }}>
              {renderCard(blogData[0], "large")}
            </div>
          )}

          {blogData.length > 1 && (
            <div
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(15px)",
                transition: "all 0.4s ease-out",
                transitionDelay: getStaggerDelay(1),
              }}>
              {renderCard(blogData[1])}
            </div>
          )}

          <div
            className="grid grid-cols-1 gap-2 lg:gap-3"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(15px)",
              transition: "all 0.4s ease-out",
              transitionDelay: getStaggerDelay(2),
            }}>
            {blogData.length > 2 && <div>{renderCard(blogData[2])}</div>}
            {blogData.length > 3 && <div>{renderCard(blogData[3])}</div>}
          </div>
        </div>

        <div
          className="text-center mt-4"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(15px)",
            transition: "all 0.4s ease-out",
            transitionDelay: getStaggerDelay(3),
          }}>
          <Link to={"/Blog"}>
            <button
              className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-3 py-1 rounded-full font-semibold text-base flex items-center gap-1 mx-auto hover:from-green-600 hover:to-teal-600 transition-all duration-200 shadow-md hover:shadow-green-500/20 hover:scale-105"
              onMouseDown={(e) => (e.currentTarget.style.scale = "0.95")}
              onMouseUp={(e) => (e.currentTarget.style.scale = "1.05")}
              onMouseLeave={(e) => (e.currentTarget.style.scale = "1")}>
              View All Posts
              <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
