// import React, { useState, useRef, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { logoutUser } from "../features/Auth/authSlice";
// import { toggleTheme } from "../features/Theme/themeSlice";
// import {
//   FaBars,
//   FaTimes,
//   FaChevronDown,
//   FaUserCircle,
//   FaSun,
//   FaMoon,
//   FaPhone,
//   FaPodcast,
//   FaApple,
//   FaSpotify,
//   FaQuestionCircle,
//   FaHeadset,
// } from "react-icons/fa";
// import {
//   HiOutlineHome,
//   HiOutlineCog,
//   HiOutlineLogout,
//   HiOutlineUser,
// } from "react-icons/hi";
// import NavLogo from "../assets/images/segunLogo1.png";

// const Navbar = () => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);
//   const [activeNavItem, setActiveNavItem] = useState("Home");
//   const dropdownTimeoutRef = useRef(null);
//   const dropdownRef = useRef(null);
//   const profileDropdownRef = useRef(null);
//   const mobileMenuRef = useRef(null);
//   const { userInfo } = useSelector((state) => state.auth);
//   const { mode } = useSelector((state) => state.theme);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Window resize handler
//   useEffect(() => {
//     const handleResize = () => {
//       setWindowWidth(window.innerWidth);
//       if (window.innerWidth >= 768) {
//         setIsMobileMenuOpen(false);
//         setIsMoreDropdownOpen(false);
//       }
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Click outside handlers
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         profileDropdownRef.current &&
//         !profileDropdownRef.current.contains(event.target)
//       ) {
//         setIsProfileOpen(false);
//       }
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsMoreDropdownOpen(false);
//       }
//       if (
//         mobileMenuRef.current &&
//         !mobileMenuRef.current.contains(event.target) &&
//         !event.target.closest(".mobile-menu-trigger")
//       ) {
//         setIsMobileMenuOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Navigation handlers
//   const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

//   const handleNavClick = (itemName) => {
//     setActiveNavItem(itemName);
//     setIsMobileMenuOpen(false);
//     setIsMoreDropdownOpen(false);
//     setIsProfileOpen(false);
//   };

//   const handleMoreDropdownToggle = () =>
//     setIsMoreDropdownOpen(!isMoreDropdownOpen);

//   const handleMouseEnter = () => {
//     if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
//     setIsMoreDropdownOpen(true);
//   };

//   const handleMouseLeave = () => {
//     dropdownTimeoutRef.current = setTimeout(
//       () => setIsMoreDropdownOpen(false),
//       200
//     );
//   };

//   const handleDashboardClick = () => {
//     setIsProfileOpen(false);
//     navigate(userInfo?.role === "admin" ? "/Admin/DashBoard" : "/dashboard");
//     if (isMobileMenuOpen) toggleMobileMenu();
//   };

//   const handleLogout = () => {
//     dispatch(logoutUser());
//     setIsProfileOpen(false);
//     navigate("/login");
//     if (isMobileMenuOpen) toggleMobileMenu();
//   };

//   const toggleProfileDropdown = () => setIsProfileOpen(!isProfileOpen);

//   const toggleThemeMode = () => dispatch(toggleTheme());

//   // Navigation configuration
//   const mainNavItems = [
//     { name: "Home", link: "/", icon: "🏠" },
//     { name: "About", link: "/about-us", icon: "👤" },
//     { name: "Services", link: "/services", icon: "⚙️" },
//     { name: "Resources", link: "/ResourcesPage", icon: "📚" },
//     { name: "Blog", link: "/blog", icon: "✍️" },
//     { name: "Events", link: "/Events", icon: "🎉" },
//   ];

//   const moreDropdownItems = [
//     {
//       name: "Podcast",
//       subItems: [
//         {
//           name: "Apple Podcast",
//           link: "https://apple.com/podcast",
//           icon: <FaApple className="w-4 h-4" />,
//         },
//         {
//           name: "Spotify Podcast",
//           link: "https://spotify.com/podcast",
//           icon: <FaSpotify className="w-4 h-4" />,
//         },
//       ],
//     },
//     { name: "Contact Us", link: "/contact" },
//     { name: "FAQ", link: "/faq" },
//     { name: "Support", link: "/support" },
//     {
//       name: `Switch to ${mode === "light" ? "Dark" : "Light"} Mode`,
//       action: toggleThemeMode,
//       icon:
//         mode === "light" ? (
//           <FaMoon className="w-4 h-4" />
//         ) : (
//           <FaSun className="w-4 h-4" />
//         ),
//     },
//   ];

//   // Responsive navigation logic
//   const getVisibleNavItems = () => {
//     if (windowWidth >= 1200) return mainNavItems;
//     if (windowWidth >= 992) return mainNavItems.slice(0, 5);
//     if (windowWidth >= 768) return mainNavItems.slice(0, 4);
//     return [];
//   };

//   const visibleNavItems = getVisibleNavItems();
//   const hiddenNavItems = mainNavItems.slice(visibleNavItems.length);

//   return (
//     <>
//       {/* Desktop Navbar - Cellulant Style */}
//       <nav className="fixed md:top-0  top-0 md:mx-5 md:rounded-full left-0 right-0 z-50 dark:bg-accent-charcoal bg-primary/95 backdrop-blur-md border-b border-white/10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-4">
//           <div className="flex justify-between items-center py-1">
//             {/* Logo Section */}
//             <Link
//               to="/"
//               className="flex items-center space-x-3 hover:opacity-90 transition-all duration-200 group"
//               onClick={() => handleNavClick("Home")}>
//               <img src={NavLogo} alt="" className="w-20 h-6" />
//             </Link>

//             {/* Desktop Navigation - Clean horizontal layout */}
//             <div className="hidden md:flex items-center space-x-1">
//               <ul className="flex items-center space-x-1 lg:space-x-2">
//                 {visibleNavItems.map((item) => (
//                   <li key={item.name}>
//                     <Link
//                       to={item.link}
//                       className={`relative px-3 py-2 text-sm lg:text-base font-medium transition-all duration-200 flex items-center space-x-1 ${
//                         activeNavItem === item.name
//                           ? "text-secondary"
//                           : "text-white hover:text-secondary/80"
//                       }`}
//                       onClick={() => handleNavClick(item.name)}>
//                       <span>{item.icon}</span>
//                       <span className="hidden lg:inline">{item.name}</span>
//                       {activeNavItem === item.name && (
//                         <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary rounded-full" />
//                       )}
//                     </Link>
//                   </li>
//                 ))}

//                 {/* More Dropdown */}
//                 {(hiddenNavItems.length > 0 ||
//                   moreDropdownItems.length > 0) && (
//                   <li
//                     className="relative"
//                     ref={dropdownRef}
//                     onMouseEnter={handleMouseEnter}
//                     onMouseLeave={handleMouseLeave}>
//                     <button
//                       onClick={handleMoreDropdownToggle}
//                       className={`flex items-center space-x-1 px-3 py-2 text-sm lg:text-base font-medium transition-all duration-200 ${
//                         activeNavItem === "More"
//                           ? "text-secondary"
//                           : "text-white hover:text-secondary/80"
//                       }`}>
//                       <span>More</span>
//                       <FaChevronDown
//                         className={`text-xs transition-transform duration-200 ${
//                           isMoreDropdownOpen ? "rotate-180" : ""
//                         }`}
//                       />
//                     </button>

//                     {isMoreDropdownOpen && (
//                       <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-2">
//                         {hiddenNavItems.map((item) => (
//                           <Link
//                             key={item.name}
//                             to={item.link}
//                             className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
//                             onClick={() => {
//                               setIsMoreDropdownOpen(false);
//                               handleNavClick(item.name);
//                             }}>
//                             {item.icon}
//                             <span>{item.name}</span>
//                           </Link>
//                         ))}
//                         {moreDropdownItems.map((item) =>
//                           item.subItems ? (
//                             <div key={item.name}>
//                               <button
//                                 className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
//                                 onClick={() => {}}>
//                                 {item.icon || <FaPodcast className="w-4 h-4" />}
//                                 <span>{item.name}</span>
//                                 <FaChevronDown className="ml-auto w-4 h-4" />
//                               </button>
//                               <div className="ml-4">
//                                 {item.subItems.map((subItem) => (
//                                   <Link
//                                     key={subItem.name}
//                                     to={subItem.link}
//                                     className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
//                                     onClick={() => {
//                                       setIsMoreDropdownOpen(false);
//                                       handleNavClick(subItem.name);
//                                     }}>
//                                     {subItem.icon}
//                                     <span>{subItem.name}</span>
//                                   </Link>
//                                 ))}
//                               </div>
//                             </div>
//                           ) : item.action ? (
//                             <button
//                               key={item.name}
//                               onClick={() => {
//                                 item.action();
//                                 setIsMoreDropdownOpen(false);
//                               }}
//                               className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
//                               {item.icon}
//                               <span>{item.name}</span>
//                             </button>
//                           ) : (
//                             <Link
//                               key={item.name}
//                               to={item.link}
//                               className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
//                               onClick={() => setIsMoreDropdownOpen(false)}>
//                               {item.icon}
//                               <span>{item.name}</span>
//                             </Link>
//                           )
//                         )}
//                       </div>
//                     )}
//                   </li>
//                 )}
//               </ul>

//               {/* Auth Section - Clean and minimal */}
//               <div className="flex items-center space-x-3 ml-6 border-l border-white/20 pl-6">
//                 {!userInfo ? (
//                   <>
//                     <Link
//                       to="/login"
//                       onClick={() => handleNavClick("Get Started")}>
//                       <button className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary-light text-white text-sm font-medium rounded-full transition-all duration-200 hover:scale-105 shadow-md">
//                         Login
//                       </button>
//                     </Link>
//                   </>
//                 ) : (
//                   <div className="relative" ref={profileDropdownRef}>
//                     <button
//                       onClick={toggleProfileDropdown}
//                       className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white hover:text-secondary transition-colors duration-200 rounded-lg hover:bg-white/10">
//                       {userInfo?.picture ? (
//                         <img
//                           src={userInfo.picture}
//                           alt={userInfo.username || userInfo.name || "User"}
//                           className="w-8 h-8 rounded-full object-cover"
//                           onError={(e) => {
//                             e.currentTarget.src = "/default-avatar.png";
//                           }}
//                         />
//                       ) : (
//                         <FaUserCircle className="w-8 h-8" />
//                       )}
//                       <span className="hidden lg:block">
//                         {userInfo?.name || userInfo?.username || "User"}
//                       </span>
//                     </button>

//                     {isProfileOpen && (
//                       <div className="absolute right-0 mt-2 w-64 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-xl border border-white/10 dark:border-gray-700/50 overflow-hidden">
//                         <div className="bg-gradient-to-r from-primary to-primary-dark px-4 py-4">
//                           <div className="flex items-center gap-3">
//                             {userInfo?.picture ? (
//                               <img
//                                 src={userInfo.picture}
//                                 alt={
//                                   userInfo.username || userInfo.name || "User"
//                                 }
//                                 className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
//                                 onError={(e) => {
//                                   e.currentTarget.src = "/default-avatar.png";
//                                 }}
//                               />
//                             ) : (
//                               <FaUserCircle className="w-12 h-12 text-white/80" />
//                             )}
//                             <div>
//                               <div className="text-sm font-semibold text-white truncate">
//                                 {userInfo?.name || userInfo?.username || "User"}
//                               </div>
//                               <div className="text-xs text-white/80 truncate">
//                                 {userInfo?.email || "user@example.com"}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="py-2">
//                           <Link
//                             onClick={() => setIsProfileOpen(false)}
//                             className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
//                             <HiOutlineUser className="w-5 h-5" />
//                             <span>Profile</span>
//                           </Link>
//                           {userInfo?.role === "admin" && (
//                             <button
//                               onClick={handleDashboardClick}
//                               className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 text-left">
//                               <HiOutlineHome className="w-5 h-5" />
//                               <span>Admin Dashboard</span>
//                             </button>
//                           )}
//                           <div className="border-t border-gray-100 dark:border-gray-700 my-2" />
//                           <button
//                             onClick={handleLogout}
//                             className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150 text-left">
//                             <HiOutlineLogout className="w-5 h-5" />
//                             <span>Logout</span>
//                           </button>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Mobile Menu Button */}
//             <button
//               onClick={toggleMobileMenu}
//               className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-all duration-200 hover:scale-110 mobile-menu-trigger"
//               aria-label="Toggle mobile menu">
//               {isMobileMenuOpen ? (
//                 <FaTimes className="w-6 h-6" />
//               ) : (
//                 <FaBars className="w-6 h-6" />
//               )}
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Mobile Menu Overlay - Cellulant Style */}
//       {isMobileMenuOpen && (
//         <>
//           {/* Backdrop */}
//           <div
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
//             onClick={toggleMobileMenu}
//           />

//           {/* Mobile Menu Panel */}
//           <div
//             className="fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-in-out"
//             style={{
//               transform: isMobileMenuOpen
//                 ? "translateX(0)"
//                 : "translateX(100%)",
//             }}
//             ref={mobileMenuRef}>
//             <div className="flex flex-col h-full">
//               {/* Mobile Header */}
//               <div className="flex justify-between items-center py-2 border-b bg-primary/60 border-gray-700 dark:border-gray-700">
//                 <Link
//                   to="/"
//                   className="flex items-center space-x-3"
//                   onClick={() => handleNavClick("Home")}>
//                   <div className="relative">
//                     <Link
//                       to="/"
//                       className="flex items-center space-x-3 hover:opacity-90 transition-all duration-200 group"
//                       onClick={() => handleNavClick("Home")}>
//                       <img src={NavLogo} alt="" className="w-20 h-6" />
//                     </Link>
//                   </div>
//                 </Link>
//                 <button
//                   onClick={toggleMobileMenu}
//                   className="p-2 rounded-lg text-gray-50 hover:text-gray-700 dark:hover:text-white transition-colors duration-200">
//                   <FaTimes className="w-6 h-6" />
//                 </button>
//               </div>

//               {/* Navigation Menu */}
//               <div className="flex-1 overflow-y-auto px-6 py-4">
//                 <ul className="space-y-1">
//                   {mainNavItems.map((item) => (
//                     <li key={item.name}>
//                       <Link
//                         to={item.link}
//                         className={`flex items-center gap-3 py-3 px-4 text-base font-medium rounded-lg transition-all duration-200 group ${
//                           activeNavItem === item.name
//                             ? "bg-secondary/10 text-secondary"
//                             : "text-gray-700 dark:text-gray-300 hover:text-secondary hover:bg-secondary/5"
//                         }`}
//                         onClick={() => handleNavClick(item.name)}>
//                         <span className="text-lg">{item.icon}</span>
//                         <span className="group-hover:translate-x-1 transition-transform duration-200">
//                           {item.name}
//                         </span>
//                       </Link>
//                     </li>
//                   ))}

//                   {/* More Items Section */}
//                   {(hiddenNavItems.length > 0 ||
//                     moreDropdownItems.length > 0) && (
//                     <li className="pt-4">
//                       <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-3">
//                         More Options
//                       </div>
//                       {[...moreDropdownItems].map((item, index) =>
//                         item.subItems ? (
//                           <div key={item.name}>
//                             <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
//                               {item.icon}
//                               <span>{item.name}</span>
//                               <FaChevronDown className="ml-auto w-4 h-4" />
//                             </button>
//                             <div className="ml-6 mt-1 space-y-1">
//                               {item.subItems.map((subItem) => (
//                                 <Link
//                                   key={subItem.name}
//                                   to={subItem.link}
//                                   className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
//                                   onClick={() => {
//                                     setIsMoreDropdownOpen(false);
//                                     handleNavClick(subItem.name);
//                                   }}>
//                                   {subItem.icon}
//                                   <span>{subItem.name}</span>
//                                 </Link>
//                               ))}
//                             </div>
//                           </div>
//                         ) : item.action ? (
//                           <button
//                             key={item.name}
//                             onClick={() => {
//                               item.action();
//                               handleNavClick(item.name);
//                             }}
//                             className="flex items-center gap-3 w-full py-2 px-4 text-sm text-gray-700 dark:text-gray-300 hover:text-secondary hover:bg-secondary/5 rounded-lg transition-all duration-200 text-left">
//                             {item.icon}
//                             <span>{item.name}</span>
//                           </button>
//                         ) : (
//                           <Link
//                             key={item.name}
//                             to={item.link}
//                             className="flex items-center gap-3 w-full py-2 px-4 text-sm text-gray-700 dark:text-gray-300 hover:text-secondary hover:bg-secondary/5 rounded-lg transition-all duration-200"
//                             onClick={() => handleNavClick(item.name)}>
//                             <span className="text-lg">{item.icon || "➤"}</span>
//                             <span>{item.name}</span>
//                           </Link>
//                         )
//                       )}
//                     </li>
//                   )}
//                 </ul>
//               </div>

//               {/* Mobile Auth Section */}
//               <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
//                 {!userInfo ? (
//                   <div className="flex flex-col items-center text-center bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm space-y-3">
//                     {/* Buttons */}
//                     <div className="flex gap-3">
//                       <Link to="/login" onClick={() => handleNavClick("Login")}>
//                         <button className="px-4 py-1.5 text-sm font-medium rounded-md bg-blue-50 text-primary hover:bg-blue-100 transition-all">
//                           Login
//                         </button>
//                       </Link>

//                       <Link
//                         to="/register"
//                         onClick={() => handleNavClick("Register")}>
//                         <button className="px-4 py-1.5 text-sm font-medium rounded-md bg-green-50 text-secondary-dark hover:bg-green-100 transition-all">
//                           Register
//                         </button>
//                       </Link>
//                     </div>
//                     <div className="text-center text-xs text-gray-50 bg-secondary p-1 px-3 rounded-md dark:text-gray-400">
//                       Join our community today
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="space-y-2">
//                     {userInfo?.role === "admin" && (
//                       <button
//                         onClick={handleDashboardClick}
//                         className="w-full flex items-center gap-3 py-3 px-4 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 text-left">
//                         <HiOutlineHome className="w-5 h-5" />
//                         <span>Admin Dashboard</span>
//                       </button>
//                     )}
//                     <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mt-4">
//                       <button
//                         onClick={handleLogout}
//                         className="w-full flex items-center gap-3 py-3 px-4 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200 text-left">
//                         <HiOutlineLogout className="w-5 h-5" />
//                         <span>Logout</span>
//                       </button>

//                       {/* ??????????????????????? */}
//                       {/* User Info Section (if logged in) */}
//                       {userInfo && (
//                         <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
//                           <div className="flex items-center gap-3">
//                             {userInfo?.picture ? (
//                               <img
//                                 src={userInfo.picture}
//                                 alt={
//                                   userInfo.username || userInfo.name || "User"
//                                 }
//                                 className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
//                                 onError={(e) => {
//                                   e.currentTarget.src = "/default-avatar.png";
//                                 }}
//                               />
//                             ) : (
//                               <FaUserCircle className="w-12 h-12 text-gray-400 dark:text-gray-500" />
//                             )}
//                             <div className="flex-1">
//                               <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
//                                 Welcome back, <br></br>
//                                 {userInfo?.name || userInfo?.username || "User"}
//                               </div>
//                               <div className="text-xs text-gray-600 dark:text-gray-300 truncate">
//                                 {userInfo?.email}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                       {/* ??????????????????????? */}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </>
//   );
// };

// export default Navbar;
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../features/Auth/authSlice";
import { toggleTheme } from "../features/Theme/themeSlice";
import {
  FaBars,
  FaTimes,
  FaChevronDown,
  FaUserCircle,
  FaSun,
  FaMoon,
  FaPhone,
  FaPodcast,
  FaApple,
  FaSpotify,
  FaQuestionCircle,
  FaHeadset,
} from "react-icons/fa";
import {
  HiOutlineHome,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineUser,
} from "react-icons/hi";
import NavLogo from "../assets/images/segunLogo1.png";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const [isPodcastOpen, setIsPodcastOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const dropdownTimeoutRef = useRef(null);
  const dropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const { userInfo } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Get active nav item from current location
  const getActiveNavItem = () => {
    const path = location.pathname;
    if (path === "/") return "Home";
    if (path === "/about-us") return "About";
    if (path === "/services") return "Services";
    if (path === "/ResourcesPage") return "Resources";
    if (path === "/blog") return "Blog";
    if (path === "/Events") return "Events";
    if (path === "/contact") return "Contact Us";
    if (path === "/faq") return "FAQ";
    if (path === "/support") return "Support";
    return "";
  };

  const activeNavItem = getActiveNavItem();

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
        setIsMoreDropdownOpen(false);
        setIsPodcastOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMoreDropdownOpen(false);
        setIsPodcastOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest(".mobile-menu-trigger")
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Navigation handlers
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
    setIsMoreDropdownOpen(false);
    setIsProfileOpen(false);
    setIsPodcastOpen(false);
  };

  const handleMoreDropdownToggle = () =>
    setIsMoreDropdownOpen(!isMoreDropdownOpen);

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setIsMoreDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsMoreDropdownOpen(false);
      setIsPodcastOpen(false);
    }, 200);
  };

  const togglePodcastDropdown = (e) => {
    e.stopPropagation();
    setIsPodcastOpen(!isPodcastOpen);
  };

  const handleDashboardClick = () => {
    setIsProfileOpen(false);
    navigate(userInfo?.role === "admin" ? "/Admin/DashBoard" : "/dashboard");
    if (isMobileMenuOpen) toggleMobileMenu();
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    setIsProfileOpen(false);
    navigate("/login");
    if (isMobileMenuOpen) toggleMobileMenu();
  };

  const toggleProfileDropdown = () => setIsProfileOpen(!isProfileOpen);

  const toggleThemeMode = () => dispatch(toggleTheme());

  // Navigation configuration
  const mainNavItems = [
    { name: "Home", link: "/", icon: "🏠" },
    { name: "About", link: "/about-us", icon: "👤" },
    { name: "Services", link: "/services", icon: "⚙️" },
    { name: "Resources", link: "/ResourcesPage", icon: "📚" },
    { name: "Blog", link: "/blog", icon: "✍️" },
    { name: "Events", link: "/Events", icon: "🎉" },
  ];

  const moreDropdownItems = [
    {
      name: "Podcast",
      subItems: [
        {
          name: "Apple Podcast",
          link: "https://apple.com/podcast",
          icon: <FaApple className="w-4 h-4" />,
        },
        {
          name: "Spotify Podcast",
          link: "https://spotify.com/podcast",
          icon: <FaSpotify className="w-4 h-4" />,
        },
      ],
    },
    { name: "Contact Us", link: "/contact" },
    { name: "FAQ", link: "/faq" },
    { name: "Support", link: "/support" },
    {
      name: `Switch to ${mode === "light" ? "Dark" : "Light"} Mode`,
      action: toggleThemeMode,
      icon:
        mode === "light" ? (
          <FaMoon className="w-4 h-4" />
        ) : (
          <FaSun className="w-4 h-4" />
        ),
    },
  ];

  // Responsive navigation logic
  const getVisibleNavItems = () => {
    if (windowWidth >= 1200) return mainNavItems;
    if (windowWidth >= 992) return mainNavItems.slice(0, 5);
    if (windowWidth >= 768) return mainNavItems.slice(0, 4);
    return [];
  };

  const visibleNavItems = getVisibleNavItems();
  const hiddenNavItems = mainNavItems.slice(visibleNavItems.length);

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="fixed md:top-0 top-0 md:mx-5 md:rounded-full left-0 right-0 z-50 dark:bg-accent-charcoal bg-primary/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-4">
          <div className="flex justify-between items-center py-1">
            {/* Logo Section */}
            <Link
              to="/"
              className="flex items-center space-x-3 hover:opacity-90 transition-all duration-200 group"
              onClick={handleNavClick}>
              <img src={NavLogo} alt="" className="w-20 h-6" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <ul className="flex items-center space-x-1 lg:space-x-2">
                {visibleNavItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.link}
                      className={`relative px-3 py-2 text-sm lg:text-base font-medium transition-all duration-200 flex items-center space-x-1 ${
                        activeNavItem === item.name
                          ? "text-secondary"
                          : "text-white hover:text-secondary"
                      }`}
                      onClick={handleNavClick}>
                      <span>{item.icon}</span>
                      <span className="hidden lg:inline">{item.name}</span>
                      {activeNavItem === item.name && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary rounded-full" />
                      )}
                    </Link>
                  </li>
                ))}

                {/* More Dropdown */}
                {(hiddenNavItems.length > 0 ||
                  moreDropdownItems.length > 0) && (
                  <li
                    className="relative"
                    ref={dropdownRef}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}>
                    <button
                      onClick={handleMoreDropdownToggle}
                      className={`flex items-center space-x-1 px-3 py-2 text-sm lg:text-base font-medium transition-all duration-200 ${
                        activeNavItem === "More"
                          ? "text-secondary"
                          : "text-white hover:text-secondary"
                      }`}>
                      <span>More</span>
                      <FaChevronDown
                        className={`text-xs transition-transform duration-200 ${
                          isMoreDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isMoreDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-2">
                        {hiddenNavItems.map((item) => (
                          <Link
                            key={item.name}
                            to={item.link}
                            className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                              activeNavItem === item.name
                                ? "bg-secondary/10 text-secondary"
                                : "text-gray-700 dark:text-gray-300 hover:text-secondary hover:bg-secondary/5"
                            }`}
                            onClick={handleNavClick}>
                            {item.icon}
                            <span>{item.name}</span>
                          </Link>
                        ))}
                        {moreDropdownItems.map((item) =>
                          item.subItems ? (
                            <div key={item.name}>
                              <button
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-secondary hover:bg-secondary/5 transition-colors"
                                onClick={togglePodcastDropdown}>
                                <FaPodcast className="w-4 h-4" />
                                <span>{item.name}</span>
                                <FaChevronDown
                                  className={`ml-auto w-4 h-4 transition-transform duration-200 ${
                                    isPodcastOpen ? "rotate-180" : ""
                                  }`}
                                />
                              </button>
                              {isPodcastOpen && (
                                <div className="ml-4">
                                  {item.subItems.map((subItem) => (
                                    <a
                                      key={subItem.name}
                                      href={subItem.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-secondary hover:bg-secondary/5 transition-colors"
                                      onClick={handleNavClick}>
                                      {subItem.icon}
                                      <span>{subItem.name}</span>
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : item.action ? (
                            <button
                              key={item.name}
                              onClick={() => {
                                item.action();
                                setIsMoreDropdownOpen(false);
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-secondary hover:bg-secondary/5 transition-colors">
                              {item.icon}
                              <span>{item.name}</span>
                            </button>
                          ) : (
                            <Link
                              key={item.name}
                              to={item.link}
                              className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                                activeNavItem === item.name
                                  ? "bg-secondary/10 text-secondary"
                                  : "text-gray-700 dark:text-gray-300 hover:text-secondary hover:bg-secondary/5"
                              }`}
                              onClick={handleNavClick}>
                              {item.icon}
                              <span>{item.name}</span>
                            </Link>
                          )
                        )}
                      </div>
                    )}
                  </li>
                )}
              </ul>

              {/* Auth Section */}
              <div className="flex items-center space-x-3 ml-6 border-l border-white/20 pl-6">
                {!userInfo ? (
                  <>
                    <Link to="/login" onClick={handleNavClick}>
                      <button className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary-light text-white text-sm font-medium rounded-full transition-all duration-200 hover:scale-105 shadow-md">
                        Login
                      </button>
                    </Link>
                  </>
                ) : (
                  <div className="relative" ref={profileDropdownRef}>
                    <button
                      onClick={toggleProfileDropdown}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white hover:text-secondary transition-colors duration-200 rounded-lg hover:bg-white/10">
                      {userInfo?.picture ? (
                        <img
                          src={userInfo.picture}
                          alt={userInfo.username || userInfo.name || "User"}
                          className="w-8 h-8 rounded-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/default-avatar.png";
                          }}
                        />
                      ) : (
                        <FaUserCircle className="w-8 h-8" />
                      )}
                      <span className="hidden lg:block">
                        {userInfo?.name || userInfo?.username || "User"}
                      </span>
                    </button>

                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-xl border border-white/10 dark:border-gray-700/50 overflow-hidden">
                        <div className="bg-gradient-to-r from-primary to-primary-dark px-4 py-4">
                          <div className="flex items-center gap-3">
                            {userInfo?.picture ? (
                              <img
                                src={userInfo.picture}
                                alt={
                                  userInfo.username || userInfo.name || "User"
                                }
                                className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
                                onError={(e) => {
                                  e.currentTarget.src = "/default-avatar.png";
                                }}
                              />
                            ) : (
                              <FaUserCircle className="w-12 h-12 text-white/80" />
                            )}
                            <div>
                              <div className="text-sm font-semibold text-white truncate">
                                {userInfo?.name || userInfo?.username || "User"}
                              </div>
                              <div className="text-xs text-white/80 truncate">
                                {userInfo?.email || "user@example.com"}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="py-2">
                          <Link
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                            <HiOutlineUser className="w-5 h-5" />
                            <span>Profile</span>
                          </Link>
                          {userInfo?.role === "admin" && (
                            <button
                              onClick={handleDashboardClick}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 text-left">
                              <HiOutlineHome className="w-5 h-5" />
                              <span>Admin Dashboard</span>
                            </button>
                          )}
                          <div className="border-t border-gray-100 dark:border-gray-700 my-2" />
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150 text-left">
                            <HiOutlineLogout className="w-5 h-5" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-all duration-200 hover:scale-110 mobile-menu-trigger"
              aria-label="Toggle mobile menu">
              {isMobileMenuOpen ? (
                <FaTimes className="w-6 h-6" />
              ) : (
                <FaBars className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={toggleMobileMenu}
          />

          {/* Mobile Menu Panel */}
          <div
            className="fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-in-out"
            style={{
              transform: isMobileMenuOpen
                ? "translateX(0)"
                : "translateX(100%)",
            }}
            ref={mobileMenuRef}>
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex justify-between items-center py-2 border-b bg-primary/60 border-gray-700 dark:border-gray-700">
                <Link
                  to="/"
                  className="flex items-center space-x-3"
                  onClick={handleNavClick}>
                  <div className="relative">
                    <img src={NavLogo} alt="" className="w-20 h-6" />
                  </div>
                </Link>
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-lg text-gray-50 hover:text-gray-700 dark:hover:text-white transition-colors duration-200">
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Menu */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <ul className="space-y-1">
                  {mainNavItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.link}
                        className={`flex items-center gap-3 py-3 px-4 text-base font-medium rounded-lg transition-all duration-200 group ${
                          activeNavItem === item.name
                            ? "bg-secondary/10 text-secondary"
                            : "text-gray-700 dark:text-gray-300 hover:text-secondary hover:bg-secondary/5"
                        }`}
                        onClick={handleNavClick}>
                        <span className="text-lg">{item.icon}</span>
                        <span className="group-hover:translate-x-1 transition-transform duration-200">
                          {item.name}
                        </span>
                      </Link>
                    </li>
                  ))}

                  {/* More Items Section */}
                  {(hiddenNavItems.length > 0 ||
                    moreDropdownItems.length > 0) && (
                    <li className="pt-4">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-3">
                        More Options
                      </div>
                      {[...moreDropdownItems].map((item) =>
                        item.subItems ? (
                          <div key={item.name}>
                            <button
                              onClick={togglePodcastDropdown}
                              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-secondary hover:bg-secondary/5 rounded-lg transition-all duration-200">
                              <FaPodcast className="w-4 h-4" />
                              <span>{item.name}</span>
                              <FaChevronDown
                                className={`ml-auto w-4 h-4 transition-transform duration-200 ${
                                  isPodcastOpen ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                            {isPodcastOpen && (
                              <div className="ml-6 mt-1 space-y-1">
                                {item.subItems.map((subItem) => (
                                  <a
                                    key={subItem.name}
                                    href={subItem.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-secondary hover:bg-secondary/5 rounded-lg transition-all duration-200"
                                    onClick={handleNavClick}>
                                    {subItem.icon}
                                    <span>{subItem.name}</span>
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : item.action ? (
                          <button
                            key={item.name}
                            onClick={() => {
                              item.action();
                              handleNavClick();
                            }}
                            className="flex items-center gap-3 w-full py-2 px-4 text-sm text-gray-700 dark:text-gray-300 hover:text-secondary hover:bg-secondary/5 rounded-lg transition-all duration-200 text-left">
                            {item.icon}
                            <span>{item.name}</span>
                          </button>
                        ) : (
                          <Link
                            key={item.name}
                            to={item.link}
                            className={`flex items-center gap-3 w-full py-2 px-4 text-sm rounded-lg transition-all duration-200 ${
                              activeNavItem === item.name
                                ? "bg-secondary/10 text-secondary"
                                : "text-gray-700 dark:text-gray-300 hover:text-secondary hover:bg-secondary/5"
                            }`}
                            onClick={handleNavClick}>
                            <span className="text-lg">{item.icon || "➤"}</span>
                            <span>{item.name}</span>
                          </Link>
                        )
                      )}
                    </li>
                  )}
                </ul>
              </div>

              {/* Mobile Auth Section */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                {!userInfo ? (
                  <div className="flex flex-col items-center text-center bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm space-y-3">
                    <div className="flex gap-3">
                      <Link to="/login" onClick={handleNavClick}>
                        <button className="px-4 py-1.5 text-sm font-medium rounded-md bg-blue-50 text-primary hover:bg-blue-100 transition-all">
                          Login
                        </button>
                      </Link>
                      <Link to="/register" onClick={handleNavClick}>
                        <button className="px-4 py-1.5 text-sm font-medium rounded-md bg-green-50 text-secondary-dark hover:bg-green-100 transition-all">
                          Register
                        </button>
                      </Link>
                    </div>
                    <div className="text-center text-xs text-gray-50 bg-secondary p-1 px-3 rounded-md dark:text-gray-400">
                      Join our community today
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {userInfo && (
                      <div className="px-4 py-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 mb-4">
                        <div className="flex items-center gap-3">
                          {userInfo?.picture ? (
                            <img
                              src={userInfo.picture}
                              alt={userInfo.username || userInfo.name || "User"}
                              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                              onError={(e) => {
                                e.currentTarget.src = "/default-avatar.png";
                              }}
                            />
                          ) : (
                            <FaUserCircle className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                          )}
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                              Welcome back,
                            </div>
                            <div className="text-sm font-bold text-secondary truncate">
                              {userInfo?.name || userInfo?.username || "User"}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-300 truncate">
                              {userInfo?.email}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {userInfo?.role === "admin" && (
                      <button
                        onClick={handleDashboardClick}
                        className="w-full flex items-center gap-3 py-3 px-4 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 text-left">
                        <HiOutlineHome className="w-5 h-5" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 py-3 px-4 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200 text-left">
                        <HiOutlineLogout className="w-5 h-5" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
