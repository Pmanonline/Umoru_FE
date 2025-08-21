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
import React, { useState, useRef, useEffect } from "react";
import { FaBars, FaTimes, FaChevronDown, FaUserCircle } from "react-icons/fa";
import { HiOutlineHome, HiOutlineCog, HiOutlineLogout } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../features/Auth/authSlice";
import { toggleTheme } from "../features/Theme/themeSlice";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const dropdownTimeoutRef = useRef(null);
  const dropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const { userInfo } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      )
        setIsProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleMoreDropdown = () => setIsMoreDropdownOpen(!isMoreDropdownOpen);
  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setIsMoreDropdownOpen(true);
  };
  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(
      () => setIsMoreDropdownOpen(false),
      300
    );
  };
  const handleDashboardClick = () => {
    setIsProfileOpen(false);
    navigate(userInfo.role === "admin" ? "/Admin/DashBoard" : "/dashboard");
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

  const navItems = [
    { name: "Home", link: "/" },
    { name: "About", link: "/about-us" },
    { name: "Services", link: "/services" },
    { name: "Resources", link: "/ResourcesPage" },
    { name: "Blog", link: "/blog" },
    { name: "Events", link: "/Events" },
  ];

  const visibleNavItems =
    windowWidth <= 1024 && windowWidth > 768 ? navItems.slice(0, 5) : navItems;

  const moreDropdownItems = [
    { name: "Podcast", link: "/podcast" },
    { name: "Events", link: "/events" },
    { name: "Spiritual Resources", link: "/spiritual-resources" },
    { name: "Telegram", link: "/telegram" },
    { name: "Cotact Us", link: "/contact" },
    {
      name: "Theme",
      action: toggleThemeMode,
      icon:
        mode === "light" ? (
          <svg
            className="w-5 h-5 text-secondary dark:text-secondary-darkMode"
            fill="currentColor"
            viewBox="0 0 24 24">
            <path d="M12 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm0 15a5 5 0 100-10 5 5 0 000 10zm9-5a1 1 0 011 1h-1a1 1 0 11-2 0h-1a1 1 0 011-1zm-17 0a1 1 0 011 1h-1a1 1 0 11-2 0h-1a1 1 0 011-1zm15.071-7.071a1 1 0 011.414 0 1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707zM5.636 17.364a1 1 0 011.414 0 1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707zM4.929 4.929a1 1 0 011.414 0 1 1 0 010 1.414L5.636 7.05A1 1 0 014.22 5.636l.707-.707zm12.728 12.728a1 1 0 011.414 0 1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707zM12 20a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z" />
          </svg>
        ) : (
          <svg
            className="w-5 h-5 text-secondary dark:text-secondary-darkMode"
            fill="currentColor"
            viewBox="0 0 24 24">
            <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        ),
    },
  ];

  return (
    <nav className="w-full bg-gradient-to-b from-primary to-primary-dark dark:bg-[#1A1A2E] dark:bg-opacity-100 py-3 fixed top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center space-x-2 hover:opacity-90 transition-opacity min-w-[150px] md:min-w-[200px] lg:min-w-[250px]">
          <img
            src="/segun-logo.svg"
            alt="Segun Umoru Logo"
            className="h-8 w-auto sm:h-10"
          />
          <span className="text-xl sm:text-2xl font-bold text-white dark:text-white whitespace-nowrap">
            Segun Umoru
          </span>
        </Link>

        <ul className="hidden md:flex space-x-4 lg:space-x-6 items-center">
          {visibleNavItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.link}
                className="relative text-sm text-white dark:text-white font-semibold hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200 group whitespace-nowrap">
                {item.name}
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-secondary dark:bg-secondary-darkMode transition-all duration-300 group-hover:w-full" />
              </Link>
            </li>
          ))}

          {windowWidth <= 1024 && windowWidth > 768 && (
            <li
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}>
              <button
                onClick={toggleMoreDropdown}
                className="flex items-center space-x-1 text-sm font-semibold text-white dark:text-white hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200 whitespace-nowrap">
                <span className="text-white">More</span>
                <FaChevronDown
                  className={`transform transition-transform duration-200 ${isMoreDropdownOpen ? "rotate-180" : ""} text-xs`}
                />
              </button>
              {isMoreDropdownOpen && (
                <ul
                  className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-accent-charcoal rounded-lg shadow-lg z-50 border border-gray-200 dark:border-accent-charcoalDark"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}>
                  {navItems
                    .slice(5)
                    .concat(moreDropdownItems)
                    .map((item) =>
                      item.action ? (
                        <li key={item.name}>
                          <button
                            onClick={() => {
                              item.action();
                              setIsMoreDropdownOpen(false);
                            }}
                            className="w-full text-left block px-4 py-3 text-xs hover:bg-accent-cream dark:hover:bg-accent-charcoalDark/30 hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200 flex items-center gap-2">
                            {item.icon}
                            <span className="text-black dark:text-white">
                              {item.name}
                            </span>
                          </button>
                        </li>
                      ) : (
                        <li key={item.name}>
                          <Link
                            to={item.link}
                            className="block px-4 py-3 text-xs hover:bg-accent-cream dark:hover:bg-accent-charcoalDark/30 hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200"
                            onClick={() => setIsMoreDropdownOpen(false)}>
                            <span className="text-black dark:text-white">
                              {item.name}
                            </span>
                          </Link>
                        </li>
                      )
                    )}
                </ul>
              )}
            </li>
          )}

          {windowWidth > 1024 && (
            <li
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}>
              <button
                onClick={toggleMoreDropdown}
                className="flex items-center text-white dark:text-white space-x-1 text-sm font-semibold hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200 whitespace-nowrap">
                <span>More</span>
                <FaChevronDown
                  className={`transform transition-transform duration-200 ${isMoreDropdownOpen ? "rotate-180" : ""} text-xs`}
                />
              </button>
              {isMoreDropdownOpen && (
                <ul
                  className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-accent-charcoal rounded-lg shadow-lg z-50 border border-gray-200 dark:border-accent-charcoalDark"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}>
                  {moreDropdownItems.map((item) =>
                    item.action ? (
                      <li key={item.name}>
                        <button
                          onClick={() => {
                            item.action();
                            setIsMoreDropdownOpen(false);
                          }}
                          className="w-full text-left block px-4 py-3 text-xs hover:bg-accent-cream dark:hover:bg-accent-charcoalDark/30 hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200 flex items-center gap-2">
                          {item.icon}
                          <span className="text-black dark:text-white">
                            {item.name}
                          </span>
                        </button>
                      </li>
                    ) : (
                      <li key={item.name}>
                        <Link
                          to={item.link}
                          className="block px-4 py-3 text-xs hover:bg-accent-cream dark:hover:bg-accent-charcoalDark/30 hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200"
                          onClick={() => setIsMoreDropdownOpen(false)}>
                          <span className="text-black dark:text-white">
                            {item.name}
                          </span>
                        </Link>
                      </li>
                    )
                  )}
                </ul>
              )}
            </li>
          )}

          {!userInfo ? (
            <div className="flex gap-3 ml-4">
              <Link to="/login">
                <button className="bg-primary-dark hover:bg-primary-darkMode text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 whitespace-nowrap">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="bg-secondary hover:bg-secondary-dark text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 whitespace-nowrap">
                  Sign up
                </button>
              </Link>
            </div>
          ) : (
            <div className="relative ml-4" ref={profileDropdownRef}>
              <button
                onClick={toggleProfileDropdown}
                className="flex items-center gap-2 text-sm font-semibold text-black dark:text-white hover:text-secondary dark:hover:text-secondary-darkMode transition-all duration-200 hover:scale-105 focus:outline-none whitespace-nowrap">
                <FaUserCircle className="w-5 h-5" />
                <span>My Account</span>
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-accent-charcoal rounded-lg shadow-xl py-2 z-50 border border-gray-200 dark:border-accent-charcoalDark">
                  <div className="flex flex-col">
                    {userInfo.role === "admin" && (
                      <>
                        <button
                          onClick={handleDashboardClick}
                          className="w-full px-4 py-2 text-sm text-black dark:text-white hover:bg-accent-cream dark:hover:bg-accent-charcoalDark/30 flex items-center gap-2 transition-colors duration-150 text-left">
                          <HiOutlineHome className="w-4 h-4" />
                          <span>Dashboard</span>
                        </button>
                        <Link
                          to="/settings"
                          onClick={() => setIsProfileOpen(false)}
                          className="w-full px-4 py-2 text-sm text-black dark:text-white hover:bg-accent-cream dark:hover:bg-accent-charcoalDark/30 flex items-center gap-2 transition-colors duration-150">
                          <HiOutlineCog className="w-4 h-4" />
                          <span>Settings</span>
                        </Link>
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-sm text-black dark:text-white hover:bg-accent-cream dark:hover:bg-accent-charcoalDark/30 flex items-center gap-2 transition-colors duration-150 text-left">
                      <HiOutlineLogout className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                  <hr className="my-2 border-gray-200 dark:border-accent-charcoalDark" />
                  <div className="px-4 py-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white first-letter:uppercase truncate block">
                      {userInfo.email || userInfo.name || "User"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </ul>

        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="text-xl focus:outline-none hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200 p-2"
            aria-label="Toggle mobile menu">
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      <div
        className={`fixed top-0 right-0 h-full w-72 bg-primary dark:bg-[#1A1A2E] text-black dark:text-white transform ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out z-40 shadow-2xl overflow-y-auto`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <Link
              to="/"
              className="flex items-center space-x-2"
              onClick={toggleMobileMenu}>
              <img
                src="/segun-logo.svg"
                alt="Segun Umoru Logo"
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold text-black dark:text-white whitespace-nowrap">
                Segun Umoru
              </span>
            </Link>
            <button
              onClick={toggleMobileMenu}
              className="text-xl focus:outline-none hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200 p-2"
              aria-label="Close mobile menu">
              <FaTimes />
            </button>
          </div>

          <ul className="space-y-4">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.link}
                  className="block py-2 text-base font-semibold hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200"
                  onClick={toggleMobileMenu}>
                  <span className="text-black dark:text-white">
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={toggleMoreDropdown}
                className="flex items-center justify-between w-full py-2 text-base font-semibold hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200">
                <span className="text-black dark:text-white">More</span>
                <FaChevronDown
                  className={`transform transition-transform duration-200 ${isMoreDropdownOpen ? "rotate-180" : ""} text-xs`}
                />
              </button>
              {isMoreDropdownOpen && (
                <ul className="pl-4 mt-2 space-y-3">
                  {moreDropdownItems.map((item) =>
                    item.action ? (
                      <li key={item.name}>
                        <button
                          onClick={() => {
                            item.action();
                            toggleMobileMenu();
                          }}
                          className="w-full text-left block py-1.5 text-sm hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200 flex items-center gap-2">
                          {item.icon}
                          <span className="text-black dark:text-white">
                            {item.name}
                          </span>
                        </button>
                      </li>
                    ) : (
                      <li key={item.name}>
                        <Link
                          to={item.link}
                          className="block py-1.5 text-sm hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200"
                          onClick={toggleMobileMenu}>
                          <span className="text-black dark:text-white">
                            {item.name}
                          </span>
                        </Link>
                      </li>
                    )
                  )}
                </ul>
              )}
            </li>
            {!userInfo ? (
              <div className="pt-4 space-y-3">
                <li>
                  <Link to="/login">
                    <button
                      className="w-full bg-primary-dark hover:bg-primary-darkMode text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                      onClick={toggleMobileMenu}>
                      Login
                    </button>
                  </Link>
                </li>
                <li>
                  <Link to="/register">
                    <button
                      className="w-full bg-secondary hover:bg-secondary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                      onClick={toggleMobileMenu}>
                      Sign up
                    </button>
                  </Link>
                </li>
              </div>
            ) : (
              <div className="pt-4 space-y-3">
                {userInfo.role === "admin" && (
                  <>
                    <li>
                      <button
                        onClick={handleDashboardClick}
                        className="w-full text-left py-2 text-base font-semibold hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200">
                        <span className="text-black dark:text-white">
                          Dashboard
                        </span>
                      </button>
                    </li>
                    <li>
                      <Link
                        to="/settings"
                        className="block py-2 text-base font-semibold hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200"
                        onClick={toggleMobileMenu}>
                        <span className="text-black dark:text-white">
                          Settings
                        </span>
                      </Link>
                    </li>
                  </>
                )}
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left py-2 text-base font-semibold hover:text-secondary dark:hover:text-secondary-darkMode transition-colors duration-200">
                    <span className="text-black dark:text-white">Logout</span>
                  </button>
                </li>
              </div>
            )}
          </ul>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30"
          onClick={toggleMobileMenu}
        />
      )}
    </nav>
  );
};

export default Navbar;
