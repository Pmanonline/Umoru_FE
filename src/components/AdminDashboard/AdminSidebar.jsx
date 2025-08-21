import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  LayoutDashboard,
  Home,
  Users,
  FileText,
  PenTool,
  Settings,
  LogOut,
  Mic,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  Sun,
  Moon,
  User,
} from "lucide-react";
import { logoutUser } from "../../features/Auth/authSlice";
import { MdOutlineEventBusy } from "react-icons/md";
import { FaCashRegister } from "react-icons/fa";
import { MdPermMedia } from "react-icons/md";

// Admin Sidebar Component
const AdminSidebar = ({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
  posts,
}) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/Admin/DashBoard",
      badge: null,
    },
    {
      title: "Home",
      icon: Home,
      path: "/",
      badge: null,
    },
    {
      title: "Users",
      icon: Users,
      path: "/Admin/AdminALlUsers",
      badge: null,
    },
    {
      title: "Blog Posts",
      icon: FileText,
      path: "/Admin/BlogPosts",
      badge: posts?.length > 0 ? posts.length : null,
    },
    {
      title: "Authors",
      icon: PenTool,
      path: "/Admin/Authors",
      badge: null,
    },
    {
      title: "Speakers",
      icon: Mic,
      path: "/Admin/Speakers",
      badge: null,
    },
    {
      title: "Events",
      icon: MdOutlineEventBusy,
      path: "/Admin/Events",
      badge: null,
    },
    {
      title: "Registered for Events",
      icon: FaCashRegister,
      path: "/Admin/RegisteredEvents",
      badge: null,
    },
    {
      title: "Resources",
      icon: MdPermMedia,
      path: "/Admin/ResourceList",
      badge: null,
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/Admin/Settings",
      badge: null,
    },
  ];
  console.log(posts, "posts");

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:relative flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-50 h-full
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${isCollapsed ? "lg:w-20" : "lg:w-64"}
          w-64`}>
        {/* Logo Section */}
        <div className="flex items-center gap-3 p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">U</span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                Umoru Admin
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                Content Management
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative
                  ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-lg shadow-blue-100 dark:shadow-blue-900/20"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  }`}
                title={isCollapsed ? item.title : ""}>
                <Icon
                  className={`w-5 h-5 flex-shrink-0 transition-colors ${
                    isActive ? "text-blue-600 dark:text-blue-400" : ""
                  }`}
                />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 font-medium truncate">
                      {item.title}
                    </span>
                    {item.badge && (
                      <span className="px-2 py-1 text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 dark:bg-blue-400 rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200"
            title={isCollapsed ? "Sign out" : ""}>
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Sign out</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
