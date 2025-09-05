// // UMORUS-POR.../client/src/components/Navbar.jsx
// import React, { useState, useRef, useEffect } from "react";
// import { FaBars, FaTimes, FaChevronDown, FaUserCircle } from "react-icons/fa";
// import { HiOutlineHome, HiOutlineCog, HiOutlineLogout } from "react-icons/hi";
// import { Link, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { logoutUser } from "../features/Auth/authSlice";
// import { toggleTheme } from "../features/Theme/themeSlice";

// const Navbar = () => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);
//   const dropdownTimeoutRef = useRef(null);
//   const dropdownRef = useRef(null);
//   const profileDropdownRef = useRef(null);
//   const { userInfo } = useSelector((state) => state.auth);
//   const { mode } = useSelector((state) => state.theme);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Track window width for responsive behavior
//   useEffect(() => {
//     const handleResize = () => {
//       setWindowWidth(window.innerWidth);
//       if (window.innerWidth >= 768) {
//         setIsMobileMenuOpen(false);
//       }
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         profileDropdownRef.current &&
//         !profileDropdownRef.current.contains(event.target)
//       ) {
//         setIsProfileOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   const toggleMoreDropdown = () => {
//     setIsMoreDropdownOpen(!isMoreDropdownOpen);
//   };

//   const handleMouseEnter = () => {
//     if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
//     setIsMoreDropdownOpen(true);
//   };

//   const handleMouseLeave = () => {
//     dropdownTimeoutRef.current = setTimeout(() => {
//       setIsMoreDropdownOpen(false);
//     }, 300);
//   };

//   const handleDashboardClick = () => {
//     setIsProfileOpen(false);
//     navigate(userInfo.role === "admin" ? "/Admin/DashBoard" : "/dashboard");
//     if (isMobileMenuOpen) toggleMobileMenu();
//   };

//   const handleLogout = () => {
//     dispatch(logoutUser());
//     setIsProfileOpen(false);
//     navigate("/login");
//     if (isMobileMenuOpen) toggleMobileMenu();
//   };

//   const toggleProfileDropdown = () => {
//     setIsProfileOpen(!isProfileOpen);
//   };

//   const toggleThemeMode = () => {
//     dispatch(toggleTheme());
//   };

//   // Responsive navigation items for Segun's portfolio
//   const navItems = [
//     { name: "Home", link: "/" },
//     { name: "About", link: "/about-us" },
//     { name: "Services", link: "/services" },
//     { name: "Podcast", link: "/podcast" },
//     { name: "Resources", link: "/resources" },
//     { name: "Blog", link: "/blog" },
//     { name: "Contact", link: "/contact" },
//   ];

//   // Only show 5 items in navbar if screen is medium size (768-1024px) to accommodate "More"
//   const visibleNavItems =
//     windowWidth <= 1024 && windowWidth > 768 ? navItems.slice(0, 5) : navItems;

//   const moreDropdownItems = [
//     { name: "Testimonials", link: "/testimonials" },
//     { name: "Events", link: "/events" },
//     { name: "Spiritual Resources", link: "/spiritual-resources" },
//     { name: "Telegram", link: "/telegram" },
//     { name: "Shop", link: "/shop" },
//     {
//       name: "Theme",
//       action: toggleThemeMode,
//       icon:
//         mode === "light" ? (
//           <svg
//             className="w-5 h-5 text-secondary dark:text-secondary-darkMode"
//             fill="currentColor"
//             viewBox="0 0 24 24">
//             <path d="M12 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm0 15a5 5 0 100-10 5 5 0 000 10zm9-5a1 1 0 011 1h-1a1 1 0 11-2 0h-1a1 1 0 011-1zm-17 0a1 1 0 011 1h-1a1 1 0 11-2 0h-1a1 1 0 011-1zm15.071-7.071a1 1 0 011.414 0 1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707zM5.636 17.364a1 1 0 011.414 0 1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707zM4.929 4.929a1 1 0 011.414 0 1 1 0 010 1.414L5.636 7.05A1 1 0 014.22 5.636l.707-.707zm12.728 12.728a1 1 0 011.414 0 1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707zM12 20a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z" />
//           </svg>
//         ) : (
//           <svg
//             className="w-5 h-5 text-secondary dark:text-secondary-darkMode"
//             fill="currentColor"
//             viewBox="0 0 24 24">
//             <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
//           </svg>
//         ),
//     },
//   ];

//   return (
//     <nav className="w-full bg-gradient-to-b from-primary to-primary-dark dark:bg-primary-darkMode py-3 fixed top-0 z-50 shadow-lg">
//       <div className="container mx-auto px-4 flex justify-between items-center">
//         {/* Logo with improved spacing */}
//         <Link
//           to="/"
//           className="flex items-center space-x-2 hover:opacity-90 transition-opacity min-w-[150px] md:min-w-[200px] lg:min-w-[250px]">
//           <img
//             src="/segun-logo.svg" // Replace with Segun's logo
//             alt="Segun Umoru Logo"
//             className="h-8 w-auto sm:h-10"
//           />
//           <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-secondary to-secondary-light bg-clip-text text-transparent whitespace-nowrap">
//             Segun Umoru
//           </span>
//         </Link>

//         {/* Desktop Navigation */}
//         <ul className="hidden md:flex space-x-4 lg:space-x-6 items-center">
//           {visibleNavItems.map((item) => (
//             <li key={item.name}>
//               <Link
//                 to={item.link}
//                 className="relative text-sm text-white dark:text-white font-semibold hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200 group whitespace-nowrap">
//                 {item.name}
//                 <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-secondary dark:bg-secondary-darkMode transition-all duration-300 group-hover:w-full" />
//               </Link>
//             </li>
//           ))}

//           {/* More Dropdown - Show only if we have hidden items */}
//           {windowWidth <= 1024 && windowWidth > 768 && (
//             <li
//               className="relative"
//               onMouseEnter={handleMouseEnter}
//               onMouseLeave={handleMouseLeave}>
//               <button
//                 onClick={toggleMoreDropdown}
//                 className="flex items-center space-x-1 text-sm font-semibold text-white dark:text-white hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200 whitespace-nowrap">
//                 <span>More</span>
//                 <FaChevronDown
//                   className={`transform transition-transform duration-200 ${
//                     isMoreDropdownOpen ? "rotate-180" : ""
//                   } text-xs`}
//                 />
//               </button>
//               {isMoreDropdownOpen && (
//                 <ul
//                   className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-accent-charcoal rounded-lg shadow-lg z-50 border border-gray-200 dark:border-accent-charcoalDark"
//                   onMouseEnter={handleMouseEnter}
//                   onMouseLeave={handleMouseLeave}>
//                   {navItems
//                     .slice(5)
//                     .concat(moreDropdownItems)
//                     .map((item) =>
//                       item.action ? (
//                         <li key={item.name}>
//                           <button
//                             onClick={() => {
//                               item.action();
//                               setIsMoreDropdownOpen(false);
//                             }}
//                             className="w-full text-left block px-4 py-3 text-xs hover:bg-accent-cream dark:hover:bg-accent-charcoalDark/30 hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200 flex items-center gap-2">
//                             {item.icon}
//                             <span>{item.name}</span>
//                           </button>
//                         </li>
//                       ) : (
//                         <li key={item.name}>
//                           <Link
//                             to={item.link}
//                             className="block px-4 py-3 text-xs hover:bg-accent-cream dark:hover:bg-accent-charcoalDark/30 hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200"
//                             onClick={() => setIsMoreDropdownOpen(false)}>
//                             {item.name}
//                           </Link>
//                         </li>
//                       )
//                     )}
//                 </ul>
//               )}
//             </li>
//           )}

//           {/* Show all items on larger screens */}
//           {windowWidth > 1024 && (
//             <li
//               className="relative"
//               onMouseEnter={handleMouseEnter}
//               onMouseLeave={handleMouseLeave}>
//               <button
//                 onClick={toggleMoreDropdown}
//                 className="flex items-center text-white dark:text-white space-x-1 text-sm font-semibold hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200 whitespace-nowrap">
//                 <span>More</span>
//                 <FaChevronDown
//                   className={`transform transition-transform duration-200 ${
//                     isMoreDropdownOpen ? "rotate-180" : ""
//                   } text-xs`}
//                 />
//               </button>
//               {isMoreDropdownOpen && (
//                 <ul
//                   className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-accent-charcoal rounded-lg shadow-lg z-50 border border-gray-200 dark:border-accent-charcoalDark"
//                   onMouseEnter={handleMouseEnter}
//                   onMouseLeave={handleMouseLeave}>
//                   {moreDropdownItems.map((item) =>
//                     item.action ? (
//                       <li key={item.name}>
//                         <button
//                           onClick={() => {
//                             item.action();
//                             setIsMoreDropdownOpen(false);
//                           }}
//                           className="w-full text-left block px-4 py-3 text-xs hover:bg-accent-cream dark:hover:bg-accent-charcoalDark/30 hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200 flex items-center gap-2">
//                           {item.icon}
//                           <span>{item.name}</span>
//                         </button>
//                       </li>
//                     ) : (
//                       <li key={item.name}>
//                         <Link
//                           to={item.link}
//                           className="block px-4 py-3 text-xs hover:bg-accent-cream dark:hover:bg-accent-charcoalDark/30 hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200"
//                           onClick={() => setIsMoreDropdownOpen(false)}>
//                           {item.name}
//                         </Link>
//                       </li>
//                     )
//                   )}
//                 </ul>
//               )}
//             </li>
//           )}

//           {/* Auth Buttons */}
//           {!userInfo ? (
//             <div className="flex gap-3 ml-4">
//               <Link to="/login">
//                 <button className="bg-primary-dark hover:bg-primary-darkMode text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 whitespace-nowrap">
//                   Login
//                 </button>
//               </Link>
//               <Link to="/register">
//                 <button className="bg-secondary hover:bg-secondary-dark text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 whitespace-nowrap">
//                   Sign up
//                 </button>
//               </Link>
//             </div>
//           ) : (
//             <div className="relative ml-4" ref={profileDropdownRef}>
//               <button
//                 onClick={toggleProfileDropdown}
//                 className="flex items-center gap-2 text-sm font-semibold text-white dark:text-white hover:text-secondary dark:hover:text-secondary-darkMode transition-all duration-200 hover:scale-105 focus:outline-none whitespace-nowrap">
//                 <FaUserCircle className="w-5 h-5" />
//                 <span>My Account</span>
//               </button>
//               {isProfileOpen && (
//                 <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-accent-charcoal rounded-lg shadow-xl py-2 z-50 border border-gray-200 dark:border-accent-charcoalDark">
//                   <div className="flex flex-col">
//                     {userInfo.role === "admin" && (
//                       <>
//                         <button
//                           onClick={handleDashboardClick}
//                           className="w-full px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-accent-cream dark:hover:bg-accent-charcoalDark/30 flex items-center gap-2 transition-colors duration-150 text-left">
//                           <HiOutlineHome className="w-4 h-4" />
//                           <span>Dashboard</span>
//                         </button>
//                         <Link
//                           to="/settings"
//                           onClick={() => setIsProfileOpen(false)}
//                           className="w-full px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-accent-cream dark:hover:bg-accent-charcoalDark/30 flex items-center gap-2 transition-colors duration-150">
//                           <HiOutlineCog className="w-4 h-4" />
//                           <span>Settings</span>
//                         </Link>
//                       </>
//                     )}
//                     <button
//                       onClick={handleLogout}
//                       className="w-full px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-accent-cream dark:hover:bg-accent-charcoalDark/30 flex items-center gap-2 transition-colors duration-150 text-left">
//                       <HiOutlineLogout className="w-4 h-4" />
//                       <span>Logout</span>
//                     </button>
//                   </div>
//                   <hr className="my-2 border-gray-200 dark:border-accent-charcoalDark" />
//                   <div className="px-4 py-1">
//                     <span className="text-sm font-medium text-gray-900 dark:text-white first-letter:uppercase truncate block">
//                       {userInfo.email || userInfo.name || "User"}
//                     </span>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </ul>

//         {/* Mobile Menu Button */}
//         <div className="md:hidden flex items-center">
//           <button
//             onClick={toggleMobileMenu}
//             className="text-xl focus:outline-none hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200 p-2"
//             aria-label="Toggle mobile menu">
//             {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Navigation Menu */}
//       <div
//         className={`fixed top-0 right-0 h-full w-72 bg-primary dark:bg-primary-darkMode text-white dark:text-white transform ${
//           isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
//         } transition-transform duration-300 ease-in-out z-40 shadow-2xl overflow-y-auto`}>
//         <div className="p-6">
//           <div className="flex justify-between items-center mb-6">
//             <Link
//               to="/"
//               className="flex items-center space-x-2"
//               onClick={toggleMobileMenu}>
//               <img
//                 src="/segun-logo.svg" // Replace with Segun's logo
//                 alt="Segun Umoru Logo"
//                 className="h-8 w-auto"
//               />
//               <span className="text-xl font-bold bg-gradient-to-r from-secondary to-secondary-light bg-clip-text text-transparent whitespace-nowrap">
//                 Segun Umoru
//               </span>
//             </Link>
//             <button
//               onClick={toggleMobileMenu}
//               className="text-xl focus:outline-none hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200 p-2"
//               aria-label="Close mobile menu">
//               <FaTimes />
//             </button>
//           </div>

//           <ul className="space-y-4">
//             {navItems.map((item) => (
//               <li key={item.name}>
//                 <Link
//                   to={item.link}
//                   className="block py-2 text-base font-semibold hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200"
//                   onClick={toggleMobileMenu}>
//                   {item.name}
//                 </Link>
//               </li>
//             ))}
//             <li>
//               <button
//                 onClick={toggleMoreDropdown}
//                 className="flex items-center justify-between w-full py-2 text-base font-semibold hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200">
//                 <span>More</span>
//                 <FaChevronDown
//                   className={`transform transition-transform duration-200 ${
//                     isMoreDropdownOpen ? "rotate-180" : ""
//                   } text-xs`}
//                 />
//               </button>
//               {isMoreDropdownOpen && (
//                 <ul className="pl-4 mt-2 space-y-3">
//                   {moreDropdownItems.map((item) =>
//                     item.action ? (
//                       <li key={item.name}>
//                         <button
//                           onClick={() => {
//                             item.action();
//                             toggleMobileMenu();
//                           }}
//                           className="w-full text-left block py-1.5 text-sm hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200 flex items-center gap-2">
//                           {item.icon}
//                           <span>{item.name}</span>
//                         </button>
//                       </li>
//                     ) : (
//                       <li key={item.name}>
//                         <Link
//                           to={item.link}
//                           className="block py-1.5 text-sm hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200"
//                           onClick={toggleMobileMenu}>
//                           {item.name}
//                         </Link>
//                       </li>
//                     )
//                   )}
//                 </ul>
//               )}
//             </li>
//             {!userInfo ? (
//               <div className="pt-4 space-y-3">
//                 <li>
//                   <Link to="/login">
//                     <button
//                       className="w-full bg-primary-dark hover:bg-primary-darkMode text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
//                       onClick={toggleMobileMenu}>
//                       Login
//                     </button>
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="/register">
//                     <button
//                       className="w-full bg-secondary hover:bg-secondary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
//                       onClick={toggleMobileMenu}>
//                       Sign up
//                     </button>
//                   </Link>
//                 </li>
//               </div>
//             ) : (
//               <div className="pt-4 space-y-3">
//                 {userInfo.role === "admin" && (
//                   <>
//                     <li>
//                       <button
//                         onClick={handleDashboardClick}
//                         className="w-full text-left py-2 text-base font-semibold hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200">
//                         Dashboard
//                       </button>
//                     </li>
//                     <li>
//                       <Link
//                         to="/settings"
//                         className="block py-2 text-base font-semibold hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200"
//                         onClick={toggleMobileMenu}>
//                         Settings
//                       </Link>
//                     </li>
//                   </>
//                 )}
//                 <li>
//                   <button
//                     onClick={handleLogout}
//                     className="w-full text-left py-2 text-base font-semibold hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200">
//                     Logout
//                   </button>
//                 </li>
//               </div>
//             )}
//           </ul>
//         </div>
//       </div>

//       {/* Overlay for mobile menu */}
//       {isMobileMenuOpen && (
//         <div
//           className="fixed inset-0 bg-black opacity-50 z-30"
//           onClick={toggleMobileMenu}
//         />
//       )}
//     </nav>
//   );
// };

// export default Navbar;
// UMORUS-POR.../client/src/components/Navbar.jsx

// UMORUS-POR.../client/src/components/Navbar.jsx

// import React, { useState, useRef, useEffect } from "react";
// import { FaBars, FaTimes, FaChevronDown, FaUserCircle } from "react-icons/fa";
// import { HiOutlineHome, HiOutlineCog, HiOutlineLogout } from "react-icons/hi";
// import { Link, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { logoutUser } from "../features/Auth/authSlice";
// import { toggleTheme } from "../features/Theme/themeSlice";

// const Navbar = () => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);
//   const dropdownTimeoutRef = useRef(null);
//   const dropdownRef = useRef(null);
//   const profileDropdownRef = useRef(null);
//   const { userInfo } = useSelector((state) => state.auth);
//   const { mode } = useSelector((state) => state.theme);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleResize = () => {
//       setWindowWidth(window.innerWidth);
//       if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         profileDropdownRef.current &&
//         !profileDropdownRef.current.contains(event.target)
//       )
//         setIsProfileOpen(false);
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
//   const toggleMoreDropdown = () => setIsMoreDropdownOpen(!isMoreDropdownOpen);
//   const handleMouseEnter = () => {
//     if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
//     setIsMoreDropdownOpen(true);
//   };
//   const handleMouseLeave = () => {
//     dropdownTimeoutRef.current = setTimeout(
//       () => setIsMoreDropdownOpen(false),
//       300
//     );
//   };
//   const handleDashboardClick = () => {
//     setIsProfileOpen(false);
//     navigate(userInfo.role === "admin" ? "/Admin/DashBoard" : "/dashboard");
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

//   const navItems = [
//     { name: "Home", link: "/" },
//     { name: "About", link: "/about-us" },
//     { name: "Services", link: "/services" },
//     { name: "Resources", link: "/ResourcesPage" },
//     { name: "Blog", link: "/blog" },
//     { name: "Events", link: "/Events" },
//   ];

//   const visibleNavItems =
//     windowWidth <= 1024 && windowWidth > 768 ? navItems.slice(0, 5) : navItems;

//   const moreDropdownItems = [
//     { name: "Podcast", link: "/podcast" },
//     { name: "Events", link: "/events" },
//     { name: "Telegram", link: "" },
//     { name: "Contact Us", link: "/contact" },
//     {
//       name: "Theme",
//       action: toggleThemeMode,
//       icon:
//         mode === "light" ? (
//           <svg
//             className="w-5 h-5 text-white dark:text-white"
//             fill="currentColor"
//             viewBox="0 0 24 24">
//             <path d="M12 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm0 15a5 5 0 100-10 5 5 0 000 10zm9-5a1 1 0 011 1h-1a1 1 0 11-2 0h-1a1 1 0 011-1zm-17 0a1 1 0 011 1h-1a1 1 0 11-2 0h-1a1 1 0 011-1zm15.071-7.071a1 1 0 011.414 0 1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707zM5.636 17.364a1 1 0 011.414 0 1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707zM4.929 4.929a1 1 0 011.414 0 1 1 0 010 1.414L5.636 7.05A1 1 0 014.22 5.636l.707-.707zm12.728 12.728a1 1 0 011.414 0 1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707zM12 20a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z" />
//           </svg>
//         ) : (
//           <svg
//             className="w-5 h-5 text-white dark:text-white"
//             fill="currentColor"
//             viewBox="0 0 24 24">
//             <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
//           </svg>
//         ),
//     },
//   ];

//   return (
//     <nav className="w-full bg-gradient-to-b from-primary to-primary-dark dark:bg-[#1A1A2E] dark:bg-opacity-100 py-3 fixed top-0 z-50 shadow-lg">
//       <div className="container mx-auto px-4 flex justify-between items-center">
//         <Link
//           to="/"
//           className="flex items-center space-x-2 hover:opacity-90 transition-opacity min-w-[150px] md:min-w-[200px] lg:min-w-[250px]">
//           <img
//             src="/segun-logo.svg"
//             alt="Segun Umoru Logo"
//             className="h-8 w-auto sm:h-10"
//           />
//           <span className="text-xl sm:text-2xl font-bold text-white dark:text-white whitespace-nowrap">
//             Segun Umoru
//           </span>
//         </Link>

//         <ul className="hidden md:flex space-x-4 lg:space-x-6 items-center">
//           {visibleNavItems.map((item) => (
//             <li key={item.name}>
//               <Link
//                 to={item.link}
//                 className="relative text-sm text-white dark:text-white font-semibold hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200 group whitespace-nowrap">
//                 {item.name}
//                 <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-secondary dark:bg-secondary-darkMode transition-all duration-300 group-hover:w-full" />
//               </Link>
//             </li>
//           ))}

//           {windowWidth <= 1024 && windowWidth > 448 && (
//             <li
//               className="relative"
//               onMouseEnter={handleMouseEnter}
//               onMouseLeave={handleMouseLeave}>
//               <button
//                 onClick={toggleMoreDropdown}
//                 className="flex items-center space-x-1 text-sm font-semibold text-white dark:text-white hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200 whitespace-nowrap">
//                 <span className="text-white dark:text-white">More</span>
//                 <FaChevronDown className="text-white dark:text-white transform transition-transform duration-200 text-xs" />
//               </button>
//               {isMoreDropdownOpen && (
//                 <ul
//                   className="absolute top-full left-0 mt-2 w-48 bg-primary dark:bg-gray-800 rounded-lg shadow-lg z-50 border border-gray-200 dark:border-accent-charcoalDark"
//                   onMouseEnter={handleMouseEnter}
//                   onMouseLeave={handleMouseLeave}>
//                   {navItems
//                     .slice(5)
//                     .concat(moreDropdownItems)
//                     .map((item) =>
//                       item.action ? (
//                         <li key={item.name}>
//                           <button
//                             onClick={() => {
//                               item.action();
//                               setIsMoreDropdownOpen(false);
//                             }}
//                             className="w-full text-left block px-4 py-3 text-xs hover:bg-primary hover:text-primary dark:hover:bg-accent-charcoalDark/30 hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200 flex items-center gap-2">
//                             {item.icon}
//                             <span className="text-primary dark:text-white">
//                               {item.name}
//                             </span>
//                           </button>
//                         </li>
//                       ) : (
//                         <li key={item.name}>
//                           <Link
//                             to={item.link}
//                             className="block px-4 py-3 text-xs hover:bg-primary-dark dark:hover:bg-accent-charcoalDark/30 hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200"
//                             onClick={() => setIsMoreDropdownOpen(false)}>
//                             <span className="text-white dark:text-white">
//                               {item.name}
//                             </span>
//                           </Link>
//                         </li>
//                       )
//                     )}
//                 </ul>
//               )}
//             </li>
//           )}

//           {windowWidth > 1024 && (
//             <li
//               className="relative"
//               onMouseEnter={handleMouseEnter}
//               onMouseLeave={handleMouseLeave}>
//               <button
//                 onClick={toggleMoreDropdown}
//                 className="flex items-center text-white dark:text-white space-x-1 text-sm font-semibold hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200 whitespace-nowrap">
//                 <span className="text-white dark:text-white hover:text-secondary">
//                   More
//                 </span>
//                 <FaChevronDown className="text-white dark:text-white transform transition-transform duration-200 text-xs" />
//               </button>
//               {isMoreDropdownOpen && (
//                 <ul
//                   className="absolute top-full left-0 mt-2 w-48 bg-primary dark:bg-gray-800 rounded-lg shadow-lg z-50 border border-gray-200 dark:border-accent-charcoalDark"
//                   onMouseEnter={handleMouseEnter}
//                   onMouseLeave={handleMouseLeave}>
//                   {moreDropdownItems.map((item) =>
//                     item.action ? (
//                       <li key={item.name}>
//                         <button
//                           onClick={() => {
//                             item.action();
//                             setIsMoreDropdownOpen(false);
//                           }}
//                           className="w-full text-left block px-4 py-3 text-xs hover:bg-accent-cream dark:hover:bg-accent-charcoalDark/30 hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200 flex items-center gap-2">
//                           {item.icon}
//                           <span className="text-white dark:text-white">
//                             {item.name}
//                           </span>
//                         </button>
//                       </li>
//                     ) : (
//                       <li key={item.name}>
//                         <Link
//                           to={item.link}
//                           className="block px-4 py-3 text-xs hover:bg-primary-dark dark:hover:bg-accent-charcoalDark/30 hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200"
//                           onClick={() => setIsMoreDropdownOpen(false)}>
//                           <span className="text-white dark:text-white">
//                             {item.name}
//                           </span>
//                         </Link>
//                       </li>
//                     )
//                   )}
//                 </ul>
//               )}
//             </li>
//           )}

//           {!userInfo ? (
//             <div className="flex gap-3 ml-4">
//               <Link to="/login">
//                 <button className="bg-primary-dark hover:bg-primary-darkMode text-white dark:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 whitespace-nowrap">
//                   Login
//                 </button>
//               </Link>
//               <Link to="/register">
//                 <button className="bg-secondary hover:bg-secondary-dark text-white dark:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 whitespace-nowrap">
//                   Sign up
//                 </button>
//               </Link>
//             </div>
//           ) : (
//             <div className="relative ml-4" ref={profileDropdownRef}>
//               <button
//                 onClick={toggleProfileDropdown}
//                 className="flex items-center gap-2 text-sm font-semibold text-white dark:text-white hover:text-secondary dark:hover:text-secondary-darkMode transition-all duration-200 hover:scale-105 focus:outline-none whitespace-nowrap">
//                 {userInfo?.picture ? (
//                   <img
//                     src={userInfo.picture}
//                     alt={userInfo.username || "User"}
//                     className="w-8 h-8 rounded-full object-cover"
//                     onError={(e) => {
//                       e.currentTarget.src = "/default-avatar.png"; // fallback image if picture fails
//                     }}
//                   />
//                 ) : (
//                   <FaUserCircle className="w-8 h-8 text-gray-600 dark:text-gray-300" />
//                 )}

//                 <span>My Account</span>
//               </button>
//               {isProfileOpen && (
//                 <div className="absolute right-0 mt-2 w-56 bg-gradient-to-b from-primary to-primary-dark dark:bg-[#1A1A2E]  dark:bg-opacity-100  rounded-lg shadow-xl py-2 z-50 border border-gray-200 dark:border-accent-charcoalDark">
//                   <div className="flex flex-col">
//                     {userInfo.role === "admin" && (
//                       <>
//                         <button
//                           onClick={handleDashboardClick}
//                           className="w-full px-4 py-2 text-sm text-white dark:text-white hover:bg-primary-dark  dark:hover:bg-accent-charcoalDark/30 flex items-center gap-2 transition-colors duration-150 text-left">
//                           <HiOutlineHome className="w-4 h-4 text-white dark:text-white" />
//                           <span>Dashboard</span>
//                         </button>
//                         <Link
//                           to="/settings"
//                           onClick={() => setIsProfileOpen(false)}
//                           className=" w-full px-4 py-2 text-sm text-white dark:text-white hover:bg-primary-dark  dark:hover:bg-accent-charcoalDark/30 flex items-center gap-2 transition-colors duration-150 text-left">
//                           <HiOutlineCog className="w-4 h-4 text-white dark:text-white" />
//                           <span>Settings</span>
//                         </Link>
//                       </>
//                     )}
//                     <button
//                       onClick={handleLogout}
//                       className=" w-full px-4 py-2 text-sm text-white dark:text-white hover:bg-primary-dark  dark:hover:bg-accent-charcoalDark/30 flex items-center gap-2 transition-colors duration-150 text-left">
//                       <HiOutlineLogout className="w-4 h-4 text-white dark:text-white" />
//                       <span>Logout</span>
//                     </button>
//                   </div>
//                   <hr className="my-2 border-gray-200 dark:border-accent-charcoalDark" />
//                   <div className="px-4 py-1">
//                     <span className="text-sm font-medium text-white dark:text-white first-letter:uppercase truncate block">
//                       {userInfo.email || userInfo.name || "User"}
//                     </span>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </ul>

//         <div className="md:hidden flex items-center">
//           <button
//             onClick={toggleMobileMenu}
//             className="text-xl text-white dark:text-white focus:outline-none hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200 p-2"
//             aria-label="Toggle mobile menu">
//             {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
//           </button>
//         </div>
//       </div>

//       <div
//         className={`fixed top-0 right-0 h-full w-72 bg-primary dark:bg-[#1A1A2E] text-white dark:text-white transform ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out z-40 shadow-2xl overflow-y-auto`}>
//         <div className="p-6">
//           <div className="flex justify-between items-center mb-6">
//             <Link
//               to="/"
//               className="flex items-center space-x-2"
//               onClick={toggleMobileMenu}>
//               <img
//                 src="/segun-logo.svg"
//                 alt="Segun Umoru Logo"
//                 className="h-8 w-auto"
//               />
//               <span className="text-xl font-bold text-white dark:text-white whitespace-nowrap">
//                 Segun Umoru
//               </span>
//             </Link>
//             <button
//               onClick={toggleMobileMenu}
//               className="text-xl text-white dark:text-white focus:outline-none hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200 p-2"
//               aria-label="Close mobile menu">
//               <FaTimes />
//             </button>
//           </div>

//           <ul className="space-y-4 text-white dark:text-white">
//             {navItems.map((item) => (
//               <li key={item.name}>
//                 <Link
//                   to={item.link}
//                   className="block py-2 text-base font-semibold text-white dark:text-white hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200"
//                   onClick={toggleMobileMenu}>
//                   {item.name}
//                 </Link>
//               </li>
//             ))}
//             <li>
//               <button
//                 onClick={toggleMoreDropdown}
//                 className="flex items-center justify-between w-full py-2 text-base font-semibold text-white dark:text-white hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200">
//                 <span>More</span>
//                 <FaChevronDown className="text-white dark:text-white transform transition-transform duration-200 text-xs" />
//               </button>
//               {isMoreDropdownOpen && (
//                 <ul className="pl-4 mt-2 space-y-3">
//                   {moreDropdownItems.map((item) =>
//                     item.action ? (
//                       <li key={item.name}>
//                         <button
//                           onClick={() => {
//                             item.action();
//                             toggleMobileMenu();
//                           }}
//                           className="w-full text-left block py-1.5 text-sm text-white` dark:text-white hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200 flex items-center gap-2">
//                           {item.icon}
//                           <span>{item.name}</span>
//                         </button>
//                       </li>
//                     ) : (
//                       <li key={item.name}>
//                         <Link
//                           to={item.link}
//                           className="block py-1.5 text-sm text-white dark:text-white hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200"
//                           onClick={toggleMobileMenu}>
//                           {item.name}
//                         </Link>
//                       </li>
//                     )
//                   )}
//                 </ul>
//               )}
//             </li>
//             {!userInfo ? (
//               <div className="pt-4 space-y-3">
//                 <li>
//                   <Link to="/login">
//                     <button
//                       className="w-full bg-primary-dark hover:bg-primary-darkMode text-white dark:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
//                       onClick={toggleMobileMenu}>
//                       Login
//                     </button>
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="/register">
//                     <button
//                       className="w-full bg-secondary hover:bg-secondary-dark text-white dark:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
//                       onClick={toggleMobileMenu}>
//                       Sign up
//                     </button>
//                   </Link>
//                 </li>
//               </div>
//             ) : (
//               <div className="pt-4 space-y-3">
//                 {userInfo.role === "admin" && (
//                   <>
//                     <li>
//                       <button
//                         onClick={handleDashboardClick}
//                         className="w-full text-left py-2 text-base font-semibold text-white dark:text-white hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200">
//                         Dashboard
//                       </button>
//                     </li>
//                     <li>
//                       <Link
//                         to="/settings"
//                         className="block py-2 text-base font-semibold text-white dark:text-white hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200"
//                         onClick={toggleMobileMenu}>
//                         Settings
//                       </Link>
//                     </li>
//                   </>
//                 )}
//                 <li>
//                   <button
//                     onClick={handleLogout}
//                     className="w-full text-left py-2 text-base font-semibold text-white dark:text-white hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200">
//                     Logout
//                   </button>
//                 </li>
//               </div>
//             )}
//           </ul>
//         </div>
//       </div>

//       {isMobileMenuOpen && (
//         <div
//           className="fixed inset-0 bg-black opacity-50 z-30"
//           onClick={toggleMobileMenu}
//         />
//       )}
//     </nav>
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
} from "react-icons/fa";
import {
  HiOutlineHome,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineUser,
} from "react-icons/hi";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
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

  const handleNavClick = () => {
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
    { name: "Home", link: "/" },
    { name: "About", link: "/about-us" },
    { name: "Services", link: "/services" },
    { name: "Resources", link: "/ResourcesPage" },
    { name: "Blog", link: "/blog" },
    { name: "Events", link: "/Events" },
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
      <nav
        className={`w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 ${
          mode === "dark"
            ? "dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
            : ""
        } py-1 fixed top-0 z-50 shadow-2xl backdrop-blur-sm`}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-14">
            {/* Logo Section */}
            <Link
              to="/"
              className="flex items-center space-x-3 hover:opacity-90 transition-all duration-200 group"
              onClick={handleNavClick}>
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                  <span className="text-blue-600 font-bold text-lg sm:text-xl">
                    SU
                  </span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {/* Main Navigation Links */}
              <ul className="flex items-center space-x-6 lg:space-x-8">
                {visibleNavItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.link}
                      className="relative text-sm lg:text-base text-white font-medium hover:text-red-300 transition-all duration-200 group py-2 px-1"
                      onClick={handleNavClick}>
                      {item.name}
                      <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-red-300 transition-all duration-300 group-hover:w-full rounded-full" />
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
                      className="flex items-center space-x-1 text-sm lg:text-base font-medium text-white hover:text-red-300 transition-all duration-200 py-2 px-1">
                      <span>More</span>
                      <FaChevronDown
                        className={`text-xs transition-transform duration-200 ${
                          isMoreDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isMoreDropdownOpen && (
                      <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="py-2">
                          {[...hiddenNavItems, ...moreDropdownItems].map(
                            (item) =>
                              item.action ? (
                                <button
                                  key={item.name}
                                  onClick={() => {
                                    item.action();
                                    setIsMoreDropdownOpen(false);
                                  }}
                                  className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-yellow-300 transition-colors duration-150 flex items-center gap-3">
                                  {item.icon}
                                  <span>{item.name}</span>
                                </button>
                              ) : (
                                <Link
                                  key={item.name}
                                  to={item.link}
                                  className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-yellow-300 transition-colors duration-150"
                                  onClick={() => setIsMoreDropdownOpen(false)}>
                                  {item.name}
                                </Link>
                              )
                          )}
                        </div>
                      </div>
                    )}
                  </li>
                )}
              </ul>

              {/* Auth Section */}
              <div className="flex items-center">
                {!userInfo ? (
                  <div className="flex items-center gap-3 ml-6 border-l border-white/20 pl-6">
                    <Link to="/login" onClick={handleNavClick}>
                      <button className="relative inline-flex items-center justify-center border border-pink-400 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden group">
                        <span className="relative z-10">Login</span>

                        {/* Gradient hover background */}
                        <span className="absolute inset-0 bg-gradient-to-r from-pink-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></span>
                      </button>
                    </Link>

                    <Link to="/register" onClick={handleNavClick}>
                      <button className="relative inline-flex items-center justify-center bg-gradient-to-r from-pink-500 to-orange-600 hover:from-orange-500 hover:to-red-500 text-white text-xs font-medium shadow-md hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden group px-3 py-1.5 rounded-lg">
                        <span className="relative z-10">Get Started</span>

                        {/* Shine effect */}
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out rounded-lg"></span>
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div
                    className="relative ml-6 border-l border-white/20 pl-6"
                    ref={profileDropdownRef}>
                    <button
                      onClick={toggleProfileDropdown}
                      className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 transition-all duration-200 hover:scale-105">
                      {userInfo?.picture ? (
                        <img
                          src={userInfo.picture}
                          alt={userInfo.username || userInfo.name || "User"}
                          className="w-8 h-8 rounded-full object-cover border-2 border-white/30"
                          onError={(e) => {
                            e.currentTarget.src = "/default-avatar.png";
                          }}
                        />
                      ) : (
                        <FaUserCircle className="w-8 h-8 text-white/80" />
                      )}
                      <div className="hidden lg:block text-left">
                        <div className="text-sm font-medium text-white">
                          {userInfo?.name || userInfo?.username || "User"}
                        </div>
                        <div className="text-xs text-white/70 capitalize">
                          {userInfo?.role || "Member"}
                        </div>
                      </div>
                      <FaChevronDown
                        className={`text-xs text-white/80 transition-transform duration-200 ${
                          isProfileOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isProfileOpen && (
                      <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                        {/* User Info Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-gray-700 dark:to-gray-800 px-4 py-4">
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
                              <div className="text-xs text-yellow-300 capitalize font-medium">
                                {userInfo?.role || "Member"}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <Link
                            // to="/profile"
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

                          <Link
                            // to="/settings"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                            <HiOutlineCog className="w-5 h-5" />
                            <span>Settings</span>
                          </Link>

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
              className="md:hidden mobile-menu-trigger p-2 rounded-lg text-white hover:bg-white/10 transition-all duration-200 hover:scale-110"
              aria-label="Toggle mobile menu">
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-gradient-to-b from-blue-600 via-blue-700 to-blue-600 ${
          mode === "dark"
            ? "dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
            : ""
        } transform transition-transform duration-300 ease-in-out z-40 shadow-2xl ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
        ref={mobileMenuRef}>
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex justify-between items-center p-6 border-b border-white/10">
            <Link
              to="/"
              className="flex items-center space-x-3"
              onClick={handleNavClick}>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">SU</span>
              </div>
              <div>
                <span className="text-xl font-bold text-white block">
                  Segun Umoru
                </span>
                <span className="text-xs text-white/80">
                  Leadership & Growth
                </span>
              </div>
            </Link>
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors duration-200">
              <FaTimes />
            </button>
          </div>

          {/* User Info Section (if logged in) */}
          {userInfo && (
            <div className="px-6 py-4 bg-white/5 border-b border-white/10">
              <div className="flex items-center gap-3">
                {userInfo?.picture ? (
                  <img
                    src={userInfo.picture}
                    alt={userInfo.username || userInfo.name || "User"}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
                    onError={(e) => {
                      e.currentTarget.src = "/default-avatar.png";
                    }}
                  />
                ) : (
                  <FaUserCircle className="w-12 h-12 text-white/80" />
                )}
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white truncate">
                    Welcome back,{" "}
                    {userInfo?.name || userInfo?.username || "User"}
                  </div>
                  <div className="text-xs text-white/70 truncate">
                    {userInfo?.email}
                  </div>
                  <div className="text-xs text-yellow-300 capitalize font-medium">
                    {userInfo?.role || "Member"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Menu */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <ul className="space-y-2">
              {mainNavItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.link}
                    className="flex items-center py-3 px-4 text-base font-medium text-white hover:text-red-300 hover:bg-white/5 rounded-lg transition-all duration-200 group"
                    onClick={handleNavClick}>
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {item.name}
                    </span>
                  </Link>
                </li>
              ))}

              {/* More Items */}
              <li className="pt-4">
                <div className="text-xs font-semibold text-white/60 uppercase tracking-wider px-4 mb-2">
                  More Options
                </div>
                {moreDropdownItems.map((item) =>
                  item.action ? (
                    <button
                      key={item.name}
                      onClick={() => {
                        item.action();
                        handleNavClick();
                      }}
                      className="flex items-center py-2 px-4 text-sm text-white/90 hover:text-red-300 hover:bg-white/5 rounded-lg transition-all duration-200 group w-full text-left">
                      {item.icon}
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {item.name}
                      </span>
                    </button>
                  ) : (
                    <Link
                      key={item.name}
                      to={item.link}
                      className="flex items-center py-2 px-4 text-sm text-white/90 hover:text-red-300 hover:bg-white/5 rounded-lg transition-all duration-200 group"
                      onClick={handleNavClick}>
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {item.name}
                      </span>
                    </Link>
                  )
                )}
              </li>
            </ul>
          </div>

          {/* Mobile Auth/Account Section */}
          {/* Mobile Auth/Account Section */}
          <div className="p-6 border-t border-white/10 bg-white/5">
            {!userInfo ? (
              <div className="space-y-3">
                {/* Login button (reverse style) */}
                <Link to="/login" className="block" onClick={handleNavClick}>
                  <button className="w-full relative inline-flex items-center justify-center border border-pink-400 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden group">
                    <span className="relative z-10 flex items-center gap-2">
                      <HiOutlineUser className="w-4 h-4" />
                      Login to Account
                    </span>

                    {/* Gradient hover background */}
                    <span className="absolute inset-0 bg-gradient-to-r from-pink-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></span>
                  </button>
                </Link>

                {/* Register button (gradient style) */}
                <Link to="/register" className="block" onClick={handleNavClick}>
                  <button className="w-full relative inline-flex items-center justify-center bg-gradient-to-r from-pink-500 to-orange-600 hover:from-orange-500 hover:to-red-500 text-white text-sm font-medium shadow-md hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden group px-3 py-2 rounded-lg">
                    <span className="relative z-10">Create Account</span>

                    {/* Shine effect */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out rounded-lg"></span>
                  </button>
                </Link>

                <div className="text-center">
                  <span className="text-xs text-white/60">
                    Join our community today
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {userInfo?.role === "admin" && (
                  <button
                    onClick={handleDashboardClick}
                    className="w-full flex items-center gap-3 py-3 px-4 text-sm text-white hover:bg-white/10 rounded-lg transition-all duration-200 text-left">
                    <HiOutlineHome className="w-5 h-5" />
                    <span>Admin Dashboard</span>
                  </button>
                )}

                <div className="pt-2 border-t border-white/10 mt-4">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 py-3 px-4 text-sm text-red-300 hover:text-red-200 hover:bg-red-500/20 rounded-lg transition-all duration-200 text-left">
                    <HiOutlineLogout className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={toggleMobileMenu}
        />
      )}
    </>
  );
};

export default Navbar;
