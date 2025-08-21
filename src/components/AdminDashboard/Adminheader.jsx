// import React, { useState, useRef, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { logoutUser } from "../../features/Auth/authSlice";
// import { IoClose } from "react-icons/io5";
// import { Link, useNavigate } from "react-router-dom";
// import { MdOutlineDashboard } from "react-icons/md";
// import { TbMoneybag } from "react-icons/tb";
// import { FaUserCircle } from "react-icons/fa";
// import { IoHomeOutline } from "react-icons/io5";

// function Adminheader() {
//   const backendURL =
//     import.meta.env.MODE === "production"
//       ? import.meta.env.VITE_BACKEND_URL
//       : "http://localhost:3001";
//   const [isNavOpen, setIsNavOpen] = useState(false);
//   const fileInputRef = useRef(null);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { userInfo } = useSelector((state) => state.auth);
//   const userId = userInfo?.user._id;
//   const { profile, loading, success, error } = useSelector(
//     (state) => state.profiles
//   );

//   // useEffect(() => {
//   //   if (userId) {
//   //     dispatch(fetchProfileById(userId));
//   //   }
//   // }, [dispatch, userId]);

//   const handleNav = () => {
//     setIsNavOpen(!isNavOpen);
//   };

//   const handleLogout = () => {
//     dispatch(logoutUser());
//     navigate("/");
//   };

//   const handleClickUpload = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Handle the file upload
//       console.log(file);
//     }
//   };

//   return (
//     <>
//       {/* Background Overlay */}
//       <div
//         className={`fixed inset-0 bg-black transition-opacity duration-300 ${
//           isNavOpen ? "opacity-70" : "opacity-0"
//         } ${isNavOpen ? "pointer-events-auto" : "pointer-events-none"}`}
//         style={{ zIndex: 30 }}
//       />

//       {/* Mobile Menu */}
//       <div
//         className={`fixed left-0 top-0 w-[75%] sm:w-[60%] h-screen bg-[#ecf0f3] p-10 transform transition-transform ease-in duration-500 ${
//           isNavOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//         style={{ zIndex: 40 }}>
//         <div className="flex w-full items-center justify-between">
//           <div
//             onClick={handleNav}
//             className="rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer">
//             <IoClose className="text-xl text-red-500" />
//           </div>
//         </div>
//         <div className="border-b border-gray-300 my-4"></div>
//         {/* Mobile menu items */}
//         <Link
//           onClick={() => setIsNavOpen(false)}
//           to="/transactions&earnings"
//           style={{ color: "green" }}
//           className="text-black lg:mb-5 flex lg:focus:text-[#166534] lg:active:text-[#166534] flex-1">
//           <span>
//             <TbMoneybag className="text-[15px] mr-2 mid:mt-1" />
//           </span>
//           <p>Transactions & Earnings</p>
//         </Link>
//       </div>
//       {/* Mobile Menu */}

//       {/* Large Screen Links */}
//       <div className="flex items-center justify-between px-4 border-1 border-gray-100 shadow-lg py-3">
//         {/* Start of the screen */}
//         <div onClick={handleNav}>
//           <MdOutlineDashboard
//             size={24}
//             className="w-8 h-8 text-purple cursor-pointer hover:scale-125 hidden mid:block"
//           />
//         </div>

//         {/* End of the screen */}

//         <div className="flex items-center">
//           <span className="mb-1 mr-2 font-medium first-letter:uppercase">
//             {profile?.username || "Guest"}
//           </span>
//           <span className="mb-2">
//             {profile?.image ? (
//               <img
//                 src={`${backendURL}/uploads/${profile?.image}`}
//                 alt={`${userInfo.username}`}
//                 className="w-7 h-7 rounded-full object-cover mr-4"
//                 onError={(e) => {
//                   e.target.onerror = null;
//                   e.target.src = "/fallback-image.png";
//                 }}
//               />
//             ) : (
//               <FaUserCircle
//                 className="w-7 h-7 text-gray-400 mr-4 cursor-pointer"
//                 onClick={handleClickUpload}
//               />
//             )}
//           </span>
//         </div>
//       </div>
//       {/* Large Screen Links */}

//       {/* Hidden File Input */}
//       <input
//         ref={fileInputRef}
//         type="file"
//         style={{ display: "none" }}
//         onChange={handleFileChange}
//       />
//     </>
//   );
// }

// export default Adminheader;

// Admin Header Component
import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../features/Auth/authSlice";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineDashboard } from "react-icons/md";
import { TbMoneybag } from "react-icons/tb";
import { FaUserCircle } from "react-icons/fa";
import { IoHomeOutline } from "react-icons/io5";
import { Menu, Search, Moon, Bell, User, ChevronDown } from "lucide-react";
import { Settings } from "lucide-react";
const Adminheader = ({ onMenuClick, isCollapsed, onToggleCollapse }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Add your dark mode logic here
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu">
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Desktop Collapse Button */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Search Bar */}
          <div className="hidden md:flex items-center relative">
            <Search className="absolute left-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-80 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle dark mode">
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {userInfo?.user?.username || "Admin User"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Administrator
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {userInfo?.user?.username || "Admin User"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {userInfo?.user?.email || "admin@umoru.com"}
                  </p>
                </div>
                <div className="p-1">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                    onClick={() => setIsProfileOpen(false)}>
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                    onClick={() => setIsProfileOpen(false)}>
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <hr className="my-1 border-gray-200 dark:border-gray-700" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md">
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Adminheader;
