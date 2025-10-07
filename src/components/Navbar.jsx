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
// } from "react-icons/fa";
// import {
//   HiOutlineHome,
//   HiOutlineCog,
//   HiOutlineLogout,
//   HiOutlineUser,
// } from "react-icons/hi";

// const Navbar = () => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);
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

//   const handleNavClick = () => {
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
//     { name: "Home", link: "/" },
//     { name: "About", link: "/about-us" },
//     { name: "Services", link: "/services" },
//     { name: "Resources", link: "/ResourcesPage" },
//     { name: "Blog", link: "/blog" },
//     { name: "Events", link: "/Events" },
//   ];

//   const moreDropdownItems = [
//     { name: "Podcast", link: "/podcast" },
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
//       <nav
//         className={`w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 ${
//           mode === "dark"
//             ? "dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
//             : ""
//         } py-1 fixed top-0 z-50 shadow-2xl backdrop-blur-sm`}>
//         <div className="container mx-auto px-4 sm:px-6">
//           <div className="flex justify-between items-center h-14">
//             {/* Logo Section */}
//             <Link
//               to="/"
//               className="flex items-center space-x-3 hover:opacity-90 transition-all duration-200 group"
//               onClick={handleNavClick}>
//               <div className="relative">
//                 <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
//                   <span className="text-blue-600 font-bold text-lg sm:text-xl">
//                     SU
//                   </span>
//                 </div>
//               </div>
//             </Link>

//             {/* Desktop Navigation */}
//             <div className="hidden md:flex items-center space-x-8">
//               {/* Main Navigation Links */}
//               <ul className="flex items-center space-x-6 lg:space-x-8">
//                 {visibleNavItems.map((item) => (
//                   <li key={item.name}>
//                     <Link
//                       to={item.link}
//                       className="relative text-sm lg:text-base text-white font-medium hover:text-red-300 transition-all duration-200 group py-2 px-1"
//                       onClick={handleNavClick}>
//                       {item.name}
//                       <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-red-300 transition-all duration-300 group-hover:w-full rounded-full" />
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
//                       className="flex items-center space-x-1 text-sm lg:text-base font-medium text-white hover:text-red-300 transition-all duration-200 py-2 px-1">
//                       <span>More</span>
//                       <FaChevronDown
//                         className={`text-xs transition-transform duration-200 ${
//                           isMoreDropdownOpen ? "rotate-180" : ""
//                         }`}
//                       />
//                     </button>

//                     {isMoreDropdownOpen && (
//                       <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
//                         <div className="py-2">
//                           {[...hiddenNavItems, ...moreDropdownItems].map(
//                             (item) =>
//                               item.action ? (
//                                 <button
//                                   key={item.name}
//                                   onClick={() => {
//                                     item.action();
//                                     setIsMoreDropdownOpen(false);
//                                   }}
//                                   className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-yellow-300 transition-colors duration-150 flex items-center gap-3">
//                                   {item.icon}
//                                   <span>{item.name}</span>
//                                 </button>
//                               ) : (
//                                 <Link
//                                   key={item.name}
//                                   to={item.link}
//                                   className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-yellow-300 transition-colors duration-150"
//                                   onClick={() => setIsMoreDropdownOpen(false)}>
//                                   {item.name}
//                                 </Link>
//                               )
//                           )}
//                         </div>
//                       </div>
//                     )}
//                   </li>
//                 )}
//               </ul>

//               {/* Auth Section */}
//               <div className="flex items-center">
//                 {!userInfo ? (
//                   <div className="flex items-center gap-3 ml-6 border-l border-white/20 pl-6">
//                     <Link to="/login" onClick={handleNavClick}>
//                       <button className="relative inline-flex items-center justify-center border border-pink-400 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden group">
//                         <span className="relative z-10">Login</span>

//                         {/* Gradient hover background */}
//                         <span className="absolute inset-0 bg-gradient-to-r from-pink-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></span>
//                       </button>
//                     </Link>

//                     <Link to="/register" onClick={handleNavClick}>
//                       <button className="relative inline-flex items-center justify-center bg-gradient-to-r from-pink-500 to-orange-600 hover:from-orange-500 hover:to-red-500 text-white text-xs font-medium shadow-md hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden group px-3 py-1.5 rounded-lg">
//                         <span className="relative z-10">Get Started</span>

//                         {/* Shine effect */}
//                         <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out rounded-lg"></span>
//                       </button>
//                     </Link>
//                   </div>
//                 ) : (
//                   <div
//                     className="relative ml-6 border-l border-white/20 pl-6"
//                     ref={profileDropdownRef}>
//                     <button
//                       onClick={toggleProfileDropdown}
//                       className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 transition-all duration-200 hover:scale-105">
//                       {userInfo?.picture ? (
//                         <img
//                           src={userInfo.picture}
//                           alt={userInfo.username || userInfo.name || "User"}
//                           className="w-8 h-8 rounded-full object-cover border-2 border-white/30"
//                           onError={(e) => {
//                             e.currentTarget.src = "/default-avatar.png";
//                           }}
//                         />
//                       ) : (
//                         <FaUserCircle className="w-8 h-8 text-white/80" />
//                       )}
//                       <div className="hidden lg:block text-left">
//                         <div className="text-sm font-medium text-white">
//                           {userInfo?.name || userInfo?.username || "User"}
//                         </div>
//                         <div className="text-xs text-white/70 capitalize">
//                           {userInfo?.role || "Member"}
//                         </div>
//                       </div>
//                       <FaChevronDown
//                         className={`text-xs text-white/80 transition-transform duration-200 ${
//                           isProfileOpen ? "rotate-180" : ""
//                         }`}
//                       />
//                     </button>

//                     {isProfileOpen && (
//                       <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
//                         {/* User Info Header */}
//                         <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-gray-700 dark:to-gray-800 px-4 py-4">
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
//                               <div className="text-xs text-yellow-300 capitalize font-medium">
//                                 {userInfo?.role || "Member"}
//                               </div>
//                             </div>
//                           </div>
//                         </div>

//                         {/* Menu Items */}
//                         <div className="py-2">
//                           <Link
//                             // to="/profile"
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

//                           <Link
//                             // to="/settings"
//                             onClick={() => setIsProfileOpen(false)}
//                             className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
//                             <HiOutlineCog className="w-5 h-5" />
//                             <span>Settings</span>
//                           </Link>

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
//               className="md:hidden mobile-menu-trigger p-2 rounded-lg text-white hover:bg-white/10 transition-all duration-200 hover:scale-110"
//               aria-label="Toggle mobile menu">
//               {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Mobile Menu */}
//       <div
//         className={`fixed top-0 right-0 h-full w-80 bg-gradient-to-b from-blue-600 via-blue-700 to-blue-600 ${
//           mode === "dark"
//             ? "dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
//             : ""
//         } transform transition-transform duration-300 ease-in-out z-40 shadow-2xl ${
//           isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
//         } md:hidden`}
//         ref={mobileMenuRef}>
//         <div className="flex flex-col h-full">
//           {/* Mobile Header */}
//           <div className="flex justify-between items-center p-6 border-b border-white/10">
//             <Link
//               to="/"
//               className="flex items-center space-x-3"
//               onClick={handleNavClick}>
//               <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
//                 <span className="text-blue-600 font-bold text-lg">SU</span>
//               </div>
//               <div>
//                 <span className="text-xl font-bold text-white block">
//                   Segun Umoru
//                 </span>
//                 <span className="text-xs text-white/80">
//                   Leadership & Growth
//                 </span>
//               </div>
//             </Link>
//             <button
//               onClick={toggleMobileMenu}
//               className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors duration-200">
//               <FaTimes />
//             </button>
//           </div>

//           {/* User Info Section (if logged in) */}
//           {userInfo && (
//             <div className="px-6 py-4 bg-white/5 border-b border-white/10">
//               <div className="flex items-center gap-3">
//                 {userInfo?.picture ? (
//                   <img
//                     src={userInfo.picture}
//                     alt={userInfo.username || userInfo.name || "User"}
//                     className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
//                     onError={(e) => {
//                       e.currentTarget.src = "/default-avatar.png";
//                     }}
//                   />
//                 ) : (
//                   <FaUserCircle className="w-12 h-12 text-white/80" />
//                 )}
//                 <div className="flex-1">
//                   <div className="text-sm font-semibold text-white truncate">
//                     Welcome back,{" "}
//                     {userInfo?.name || userInfo?.username || "User"}
//                   </div>
//                   <div className="text-xs text-white/70 truncate">
//                     {userInfo?.email}
//                   </div>
//                   <div className="text-xs text-yellow-300 capitalize font-medium">
//                     {userInfo?.role || "Member"}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Navigation Menu */}
//           <div className="flex-1 overflow-y-auto px-6 py-4">
//             <ul className="space-y-2">
//               {mainNavItems.map((item) => (
//                 <li key={item.name}>
//                   <Link
//                     to={item.link}
//                     className="flex items-center py-3 px-4 text-base font-medium text-white hover:text-red-300 hover:bg-white/5 rounded-lg transition-all duration-200 group"
//                     onClick={handleNavClick}>
//                     <span className="group-hover:translate-x-1 transition-transform duration-200">
//                       {item.name}
//                     </span>
//                   </Link>
//                 </li>
//               ))}

//               {/* More Items */}
//               <li className="pt-4">
//                 <div className="text-xs font-semibold text-white/60 uppercase tracking-wider px-4 mb-2">
//                   More Options
//                 </div>
//                 {moreDropdownItems.map((item) =>
//                   item.action ? (
//                     <button
//                       key={item.name}
//                       onClick={() => {
//                         item.action();
//                         handleNavClick();
//                       }}
//                       className="flex items-center py-2 px-4 text-sm text-white/90 hover:text-red-300 hover:bg-white/5 rounded-lg transition-all duration-200 group w-full text-left">
//                       {item.icon}
//                       <span className="group-hover:translate-x-1 transition-transform duration-200">
//                         {item.name}
//                       </span>
//                     </button>
//                   ) : (
//                     <Link
//                       key={item.name}
//                       to={item.link}
//                       className="flex items-center py-2 px-4 text-sm text-white/90 hover:text-red-300 hover:bg-white/5 rounded-lg transition-all duration-200 group"
//                       onClick={handleNavClick}>
//                       <span className="group-hover:translate-x-1 transition-transform duration-200">
//                         {item.name}
//                       </span>
//                     </Link>
//                   )
//                 )}
//               </li>
//             </ul>
//           </div>

//           {/* Mobile Auth/Account Section */}
//           {/* Mobile Auth/Account Section */}
//           <div className="p-6 border-t border-white/10 bg-white/5">
//             {!userInfo ? (
//               <div className="space-y-3">
//                 {/* Login button (reverse style) */}
//                 <Link to="/login" className="block" onClick={handleNavClick}>
//                   <button className="w-full relative inline-flex items-center justify-center border border-pink-400 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden group">
//                     <span className="relative z-10 flex items-center gap-2">
//                       <HiOutlineUser className="w-4 h-4" />
//                       Login to Account
//                     </span>

//                     {/* Gradient hover background */}
//                     <span className="absolute inset-0 bg-gradient-to-r from-pink-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></span>
//                   </button>
//                 </Link>

//                 {/* Register button (gradient style) */}
//                 <Link to="/register" className="block" onClick={handleNavClick}>
//                   <button className="w-full relative inline-flex items-center justify-center bg-gradient-to-r from-pink-500 to-orange-600 hover:from-orange-500 hover:to-red-500 text-white text-sm font-medium shadow-md hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden group px-3 py-2 rounded-lg">
//                     <span className="relative z-10">Create Account</span>

//                     {/* Shine effect */}
//                     <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out rounded-lg"></span>
//                   </button>
//                 </Link>

//                 <div className="text-center">
//                   <span className="text-xs text-white/60">
//                     Join our community today
//                   </span>
//                 </div>
//               </div>
//             ) : (
//               <div className="space-y-2">
//                 {userInfo?.role === "admin" && (
//                   <button
//                     onClick={handleDashboardClick}
//                     className="w-full flex items-center gap-3 py-3 px-4 text-sm text-white hover:bg-white/10 rounded-lg transition-all duration-200 text-left">
//                     <HiOutlineHome className="w-5 h-5" />
//                     <span>Admin Dashboard</span>
//                   </button>
//                 )}

//                 <div className="pt-2 border-t border-white/10 mt-4">
//                   <button
//                     onClick={handleLogout}
//                     className="w-full flex items-center gap-3 py-3 px-4 text-sm text-red-300 hover:text-red-200 hover:bg-red-500/20 rounded-lg transition-all duration-200 text-left">
//                     <HiOutlineLogout className="w-5 h-5" />
//                     <span>Logout</span>
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu Overlay */}
//       {isMobileMenuOpen && (
//         <div
//           className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
//           onClick={toggleMobileMenu}
//         />
//       )}
//     </>
//   );
// };

// export default Navbar;

import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [activeNavItem, setActiveNavItem] = useState("Home");
  const dropdownTimeoutRef = useRef(null);
  const dropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const { userInfo } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
        setIsMoreDropdownOpen(false);
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

  const handleNavClick = (itemName) => {
    setActiveNavItem(itemName);
    setIsMobileMenuOpen(false);
    setIsMoreDropdownOpen(false);
    setIsProfileOpen(false);
  };

  const handleMoreDropdownToggle = () =>
    setIsMoreDropdownOpen(!isMoreDropdownOpen);

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setIsMoreDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(
      () => setIsMoreDropdownOpen(false),
      200
    );
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
    { name: "Podcast", link: "/podcast" },
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
      {/* Desktop Navbar - Cellulant Style */}
      <nav className="fixed md:top-0  top-0 md:mx-5 md:rounded-full left-0 right-0 z-50 dark:bg-accent-charcoal bg-primary/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-4">
          <div className="flex justify-between items-center py-1">
            {/* Logo Section */}
            <Link
              to="/"
              className="flex items-center space-x-3 hover:opacity-90 transition-all duration-200 group"
              onClick={() => handleNavClick("Home")}>
              <img src={NavLogo} alt="" className="w-20 h-6" />
            </Link>

            {/* Desktop Navigation - Clean horizontal layout */}
            <div className="hidden md:flex items-center space-x-1">
              <ul className="flex items-center space-x-1 lg:space-x-2">
                {visibleNavItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.link}
                      className={`relative px-3 py-2 text-sm lg:text-base font-medium transition-all duration-200 flex items-center space-x-1 ${
                        activeNavItem === item.name
                          ? "text-secondary"
                          : "text-white hover:text-secondary/80"
                      }`}
                      onClick={() => handleNavClick(item.name)}>
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
                          : "text-white hover:text-secondary/80"
                      }`}>
                      <span>More</span>
                      <FaChevronDown
                        className={`text-xs transition-transform duration-200 ${
                          isMoreDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isMoreDropdownOpen && (
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/10 dark:border-gray-700/50 p-4">
                        <div className="py-2">
                          {hiddenNavItems.map((item) => (
                            <Link
                              key={item.name}
                              to={item.link}
                              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-secondary transition-colors duration-150 rounded-lg"
                              onClick={() => {
                                setIsMoreDropdownOpen(false);
                                handleNavClick(item.name);
                              }}>
                              <span className="text-lg">{item.icon}</span>
                              <span>{item.name}</span>
                            </Link>
                          ))}
                          {moreDropdownItems.map((item) =>
                            item.action ? (
                              <button
                                key={item.name}
                                onClick={() => {
                                  item.action();
                                  setIsMoreDropdownOpen(false);
                                }}
                                className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-secondary transition-colors duration-150 flex items-center gap-3 rounded-lg">
                                {item.icon}
                                <span>{item.name}</span>
                              </button>
                            ) : (
                              <Link
                                key={item.name}
                                to={item.link}
                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-secondary transition-colors duration-150 rounded-lg"
                                onClick={() => setIsMoreDropdownOpen(false)}>
                                <span className="w-4 h-4 opacity-50">
                                  {item.icon}
                                </span>
                                <span>{item.name}</span>
                              </Link>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </li>
                )}
              </ul>

              {/* Auth Section - Clean and minimal */}
              <div className="flex items-center space-x-3 ml-6 border-l border-white/20 pl-6">
                {!userInfo ? (
                  <>
                    <Link
                      to="/login"
                      onClick={() => handleNavClick("Get Started")}>
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

      {/* Mobile Menu Overlay - Cellulant Style */}
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
              <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                <Link
                  to="/"
                  className="flex items-center space-x-3"
                  onClick={() => handleNavClick("Home")}>
                  <div className="relative">
                    <svg
                      className="w-10 h-10 text-primary"
                      viewBox="0 0 100 100"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <rect
                        width="100"
                        height="100"
                        rx="10"
                        fill="currentColor"
                        opacity="0.1"
                      />
                      <path
                        d="M20 20 C10 30, 10 50, 20 60 L30 70 C40 80, 60 80, 70 70"
                        stroke="currentColor"
                        stroke-width="8"
                        fill="none"
                        stroke-linecap="round"
                      />
                      <path
                        d="M80 60 Q80 30, 60 20 Q40 10, 30 20 V50"
                        stroke="currentColor"
                        stroke-width="8"
                        fill="none"
                        stroke-linecap="round"
                      />
                      <path
                        d="M10 80 Q30 60, 50 70 Q70 80, 90 70"
                        stroke="secondary"
                        stroke-width="4"
                        fill="none"
                        stroke-linecap="round"
                      />
                      <circle cx="50" cy="70" r="3" fill="secondary" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white block">
                      Segun Umoru
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      Data | AI | Growth
                    </span>
                  </div>
                </Link>
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-white transition-colors duration-200">
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>

              {/* User Info Section (if logged in) */}
              {userInfo && (
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
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
                        Welcome back,{" "}
                        {userInfo?.name || userInfo?.username || "User"}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300 truncate">
                        {userInfo?.email}
                      </div>
                    </div>
                  </div>
                </div>
              )}

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
                        onClick={() => handleNavClick(item.name)}>
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
                      {[...hiddenNavItems, ...moreDropdownItems].map(
                        (item, index) =>
                          item.action ? (
                            <button
                              key={item.name}
                              onClick={() => {
                                item.action();
                                handleNavClick(item.name);
                              }}
                              className="flex items-center gap-3 w-full py-2 px-4 text-sm text-gray-700 dark:text-gray-300 hover:text-secondary hover:bg-secondary/5 rounded-lg transition-all duration-200 text-left">
                              {item.icon}
                              <span>{item.name}</span>
                            </button>
                          ) : (
                            <Link
                              key={item.name}
                              to={item.link}
                              className="flex items-center gap-3 w-full py-2 px-4 text-sm text-gray-700 dark:text-gray-300 hover:text-secondary hover:bg-secondary/5 rounded-lg transition-all duration-200"
                              onClick={() => handleNavClick(item.name)}>
                              <span className="text-lg">
                                {item.icon || "➤"}
                              </span>
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
                  <div className="space-y-4">
                    <Link
                      to="/login"
                      className="block"
                      onClick={() => handleNavClick("Login")}>
                      <button className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:border-secondary hover:text-secondary transition-colors duration-200">
                        <HiOutlineUser className="w-5 h-5" />
                        <span>Login to Account</span>
                      </button>
                    </Link>
                    <Link
                      to="/register"
                      className="block"
                      onClick={() => handleNavClick("Get Started")}>
                      <button className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-secondary to-secondary-light hover:from-secondary-dark hover:to-secondary text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200">
                        <span>Create Account</span>
                      </button>
                    </Link>
                    <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                      Join our community today
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {userInfo?.role === "admin" && (
                      <button
                        onClick={handleDashboardClick}
                        className="w-full flex items-center gap-3 py-3 px-4 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 text-left">
                        <HiOutlineHome className="w-5 h-5" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mt-4">
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
