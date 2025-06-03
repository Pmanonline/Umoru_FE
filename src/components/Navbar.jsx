import React, { useState, useRef, useEffect } from "react";
import { FaBars, FaTimes, FaChevronDown, FaUserCircle } from "react-icons/fa";
import { HiOutlineHome, HiOutlineCog, HiOutlineLogout } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../features/Auth/authSlice";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const [isMoreSubmenuOpen, setIsMoreSubmenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const dropdownTimeoutRef = useRef(null);
  const dropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Track window width for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Close mobile menu when resizing to desktop
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isMobileMenuOpen) {
      setIsMoreSubmenuOpen(false);
    }
  };

  const toggleMoreSubmenu = () => {
    setIsMoreSubmenuOpen(!isMoreSubmenuOpen);
  };

  const toggleMoreDropdown = () => {
    setIsMoreDropdownOpen(!isMoreDropdownOpen);
  };

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setIsMoreDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsMoreDropdownOpen(false);
    }, 300);
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

  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Responsive navigation items
  const navItems = [
    { name: "Home", link: "/" },
    { name: "About us", link: "/about-us" },
    { name: "Nominate/vote", link: "/nominate" },
    { name: "Winner", link: "/winner" },
    { name: "Fund", link: "/fund" },
    { name: "National Awards", link: "/continent-awards" },
  ];

  // Only show 4 items in navbar if screen is medium size (768-1024px)
  const visibleNavItems =
    windowWidth <= 1024 && windowWidth > 768 ? navItems.slice(0, 4) : navItems;

  const moreDropdownItems = [
    { name: "Gallery", link: "/gallery" },
    { name: "Award Types", link: "/award-types" },
    { name: "Suggest Nominee", link: "/suggest-nominee" },
    { name: "Past Heroes", link: "/past-heroes" },
  ];

  return (
    <nav className="w-full bg-primary py-3 fixed top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo with improved spacing */}
        <Link
          to="/"
          className="flex items-center space-x-2 hover:opacity-90 transition-opacity min-w-[150px] md:min-w-[200px] lg:min-w-[250px]">
          <img
            src="/PrideLogo.svg"
            alt="The Pride of the World Logo"
            className="h-8 w-auto sm:h-10"
          />
          <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-secondary to-secondary bg-clip-text text-transparent whitespace-nowrap">
            ThePrideOfTheWorld
          </span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-4 lg:space-x-6 items-center">
          {visibleNavItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.link}
                className="relative text-sm text-white font-semibold hover:text-secondary transition-colors duration-200 group whitespace-nowrap">
                {item.name}
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full" />
              </Link>
            </li>
          ))}

          {/* More Dropdown - Show only if we have hidden items */}
          {windowWidth <= 1024 && windowWidth > 768 && (
            <li
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}>
              <button
                onClick={toggleMoreDropdown}
                className="flex items-center space-x-1 text-sm font-semibold hover:text-secondary transition-colors duration-200 whitespace-nowrap">
                <span>More</span>
                <FaChevronDown
                  className={`transform transition-transform duration-200 ${
                    isMoreDropdownOpen ? "rotate-180" : ""
                  } text-xs`}
                />
              </button>
              {isMoreDropdownOpen && (
                <ul
                  className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 border border-gray-100"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}>
                  {navItems
                    .slice(4)
                    .concat(moreDropdownItems)
                    .map((item) => (
                      <li key={item.name}>
                        <Link
                          to={item.link}
                          className="block px-4 py-3 text-xs hover:bg-primary/10 hover:text-primary transition-colors duration-200">
                          {item.name}
                        </Link>
                      </li>
                    ))}
                </ul>
              )}
            </li>
          )}

          {/* Show all items on larger screens */}
          {windowWidth > 1024 && (
            <li
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}>
              <button
                onClick={toggleMoreDropdown}
                className="flex items-center text-white space-x-1 text-sm font-semibold hover:text-secondary transition-colors duration-200 whitespace-nowrap">
                <span>More</span>
                <FaChevronDown
                  className={`transform transition-transform duration-200 ${
                    isMoreDropdownOpen ? "rotate-180" : ""
                  } text-xs`}
                />
              </button>
              {isMoreDropdownOpen && (
                <ul
                  className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 border border-gray-100"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}>
                  {moreDropdownItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.link}
                        className="block px-4 py-3 text-xs hover:bg-primary/10 hover:text-primary transition-colors duration-200">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )}

          {/* Auth Buttons */}
          {!userInfo ? (
            <div className="flex gap-3 ml-4">
              <Link to="/login">
                <button className="bg-primary hover:bg-primary-light text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 whitespace-nowrap">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="bg-secondary hover:bg-secondary-light text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 whitespace-nowrap">
                  Sign up
                </button>
              </Link>
            </div>
          ) : (
            <div className="relative ml-4" ref={profileDropdownRef}>
              <button
                onClick={toggleProfileDropdown}
                className="flex items-center gap-2 text-sm font-semibold text-white hover:text-secondary transition-all duration-200 hover:scale-105 focus:outline-none whitespace-nowrap">
                <FaUserCircle className="w-5 h-5" />
                <span>My Account</span>
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100">
                  <div className="flex flex-col">
                    {userInfo.role === "admin" && (
                      <>
                        <button
                          onClick={handleDashboardClick}
                          className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors duration-150 text-left">
                          <HiOutlineHome className="w-4 h-4" />
                          <span>Dashboard</span>
                        </button>
                        <Link
                          to="/settings"
                          onClick={() => setIsProfileOpen(false)}
                          className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors duration-150">
                          <HiOutlineCog className="w-4 h-4" />
                          <span>Settings</span>
                        </Link>
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors duration-150 text-left">
                      <HiOutlineLogout className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                  <hr className="my-2 border-gray-200" />
                  <div className="px-4 py-1">
                    <span className="text-sm font-medium text-black first-letter:uppercase truncate block">
                      {userInfo.email || userInfo.name || "User"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="text-xl focus:outline-none hover:text-secondary transition-colors duration-200 p-2"
            aria-label="Toggle mobile menu">
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-primary text-white transform ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-40 shadow-2xl overflow-y-auto`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <Link
              to="/"
              className="flex items-center space-x-2"
              onClick={toggleMobileMenu}>
              <img
                src="/PrideLogo.svg"
                alt="The Pride of the World Logo"
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-secondary to-secondary bg-clip-text text-transparent whitespace-nowrap">
                ThePrideOfTheWorld
              </span>
            </Link>
            <button
              onClick={toggleMobileMenu}
              className="text-xl focus:outline-none hover:text-secondary transition-colors duration-200 p-2"
              aria-label="Close mobile menu">
              <FaTimes />
            </button>
          </div>

          <ul className="space-y-4">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.link}
                  className="block py-2 text-base font-semibold hover:text-secondary transition-colors duration-200"
                  onClick={toggleMobileMenu}>
                  {item.name}
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={toggleMoreSubmenu}
                className="flex items-center justify-between w-full py-2 text-base font-semibold hover:text-secondary transition-colors duration-200">
                <span>More</span>
                <FaChevronDown
                  className={`transform transition-transform duration-200 ${
                    isMoreSubmenuOpen ? "rotate-180" : ""
                  } text-xs`}
                />
              </button>
              {isMoreSubmenuOpen && (
                <ul className="pl-4 mt-2 space-y-3">
                  {moreDropdownItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.link}
                        className="block py-1.5 text-sm hover:text-secondary transition-colors duration-200"
                        onClick={toggleMobileMenu}>
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            {!userInfo ? (
              <div className="pt-4 space-y-3">
                <li>
                  <Link to="/login">
                    <button
                      className="w-full bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                      onClick={toggleMobileMenu}>
                      Login
                    </button>
                  </Link>
                </li>
                <li>
                  <Link to="/register">
                    <button
                      className="w-full bg-secondary hover:bg-secondary-light text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
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
                        className="w-full text-left py-2 text-base font-semibold hover:text-secondary transition-colors duration-200">
                        Dashboard
                      </button>
                    </li>
                    <li>
                      <Link
                        to="/settings"
                        className="block py-2 text-base font-semibold hover:text-secondary transition-colors duration-200"
                        onClick={toggleMobileMenu}>
                        Settings
                      </Link>
                    </li>
                  </>
                )}
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left py-2 text-base font-semibold hover:text-secondary transition-colors duration-200">
                    Logout
                  </button>
                </li>
              </div>
            )}
          </ul>
        </div>
      </div>

      {/* Overlay for mobile menu */}
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
