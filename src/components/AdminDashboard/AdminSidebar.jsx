import React, { useState, useEffect, useRef } from "react";
import { HiOutlineLogout, HiMenu, HiX } from "react-icons/hi";
import { VscDashboard } from "react-icons/vsc";
import { IoPerson } from "react-icons/io5";
import {
  FaUserCircle,
  FaHome,
  FaUsers,
  FaMapMarkerAlt,
  FaRegEye,
  FaTasks,
} from "react-icons/fa";
import { BiCommentDetail, BiCalendarEdit } from "react-icons/bi";
import { CheckCircle, ShieldCheck, ChevronDown } from "lucide-react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../../features/Auth/authSlice";

const AdminSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [interestOpen, setInterestOpen] = useState(false);
  const sidebarRef = useRef(null);
  const { userInfo } = useSelector((state) => state.auth);
  const userId = userInfo?._id;
  const profile = 1;

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleVerification = () => setVerificationOpen(!verificationOpen);
  const toggleInterest = () => setInterestOpen(!interestOpen);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarLinks = [
    { path: "/", icon: FaHome, label: "Home" },
    { path: "/Admin/DashBoard", icon: VscDashboard, label: "Dashboard" },
    { path: "/Admin/Profile", icon: IoPerson, label: "Profile" },
    { path: "/Admin/Users", icon: FaUsers, label: "All Users" },
    { path: "/Admin/Businesses", icon: FaUsers, label: "All Businesses" },
    { path: "/Admin/Reviews", icon: BiCommentDetail, label: "Reviews" },
    {
      path: "/Admin/Notifications",
      icon: IoMdNotificationsOutline,
      label: "Notifications",
    },
  ];

  const verificationLinks = [
    { path: "/Admin/BusinessVerification", label: "Business Verification" },
    { path: "/Admin/ProfileVerification", label: "Profile Verification" },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div
        className={`fixed top-0 left-0 right-0 z-40 bg-white shadow-md p-4 flex items-center justify-between ${
          isSmallScreen ? "" : "hidden"
        }`}>
        <div className="flex items-center">
          <span className="mb-2">
            {profile?.image ? (
              <img
                src={`${profile?.image}`}
                alt={`${userInfo.username}`}
                className="w-7 h-7 rounded-full object-cover mr-4"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/fallback-image.png";
                }}
              />
            ) : (
              <FaUserCircle className="w-7 h-7 text-[#005a7e] mr-4 cursor-pointer" />
            )}
          </span>
          <span className="mb-1 mr-2 font-medium text-xs">
            {profile?.username || "Guest"}
          </span>
        </div>
        <button
          onClick={toggleSidebar}
          className="text-[#0A0B2E] hover:text-[#005a7e] p-2 rounded-md focus:outline-none">
          {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-[#0A0B2E] to-[#005a7e] text-white transition-all duration-300 ease-in-out transform
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${isSmallScreen ? "top-16" : "top-0"}`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-5">
            <Link to={"/"}>
              <h1 className="text-2xl font-bold mb-1">E-Direct</h1>
            </Link>
            <p className="text-sm text-blue-200 mb-6">Super Administrator</p>
            {!isSmallScreen && (
              <div className="flex items-center">
                <span className="mb-2">
                  {profile?.image ? (
                    <img
                      src={`${profile?.image}`}
                      alt={`${userInfo.username}`}
                      className="w-7 h-7 rounded-full object-cover mr-4"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/fallback-image.png";
                      }}
                    />
                  ) : (
                    <FaUserCircle className="w-7 h-7 text-gray-300 mr-4 cursor-pointer" />
                  )}
                </span>
                <span className="mb-1 mr-2 font-extralight text-xs">
                  {profile?.username || "Guest"}
                </span>
              </div>
            )}
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-grow overflow-y-auto">
            {sidebarLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => isSmallScreen && setIsOpen(false)}
                className={`flex items-center px-5 py-3 text-sm transition-colors duration-200 ${
                  location.pathname === link.path
                    ? "bg-[#003a5e] text-white"
                    : "hover:bg-[#004a6e]"
                }`}>
                <link.icon className="w-5 h-5 mr-3" />
                <span>{link.label}</span>
              </Link>
            ))}

            {/* Verification Dropdown */}
            <div className="relative">
              <button
                onClick={toggleVerification}
                className="w-full flex items-center justify-between px-5 py-3 text-sm hover:bg-[#004a6e] transition-colors duration-200">
                <div className="flex items-center">
                  <ShieldCheck className="w-5 h-5 mr-3" />
                  <span>Verification</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    verificationOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {verificationOpen && (
                <div className="bg-[#002a4e]">
                  {verificationLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center px-12 py-2 text-sm transition-colors duration-200 ${
                        location.pathname === link.path
                          ? "text-white bg-[#003a5e]"
                          : "hover:bg-[#004a6e]"
                      }`}>
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Logout Button */}
          <div className="p-5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-1 py-1 text-sm bg-[#003a5e] hover:bg-red-500 text-white rounded-md transition-colors duration-200">
              <HiOutlineLogout className="w-5 h-5 mr-3" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Spacer for Desktop */}
      <div
        className={`transition-all duration-300 ${
          isOpen && !isSmallScreen ? "ml-64" : "ml-0"
        }`}></div>
    </>
  );
};

export default AdminSidebar;
