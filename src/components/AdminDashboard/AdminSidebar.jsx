import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Home,
  Users,
  Award,
  Star,
  Tag,
  ThumbsUp,
  List,
  Vote,
  Trophy,
  LogOut,
  ChevronRight,
  MenuSquare,
  Menu,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/Admin/DashBoard",
    },
    {
      title: "Home",
      icon: Home,
      path: "/",
    },
    {
      title: "Users",
      icon: Users,
      path: "/Admin/AdminALlUsers",
    },
    {
      title: "Regional Awards",
      icon: Award,
      path: "/Admin/AwardList",
    },
    {
      title: "Famous People",
      icon: Star,
      path: "/Admin/FamousPeopleList",
    },
    {
      title: "Pride In Category",
      icon: Tag,
      path: "/Admin/PrideInCategoryList",
    },
    {
      title: "Recommended People",
      icon: ThumbsUp,
      path: "/Admin/RecommendedPersonList",
    },
    {
      title: "All Nominee",
      icon: List,
      path: "/Admin/NomineeList",
    },
    {
      title: "Suggested Nominee",
      icon: List,
      path: "/Admin/AdminSuggestedNomination",
    },

    {
      title: "Admin/Judge Voting",
      icon: Vote,
      path: "/Admin/AdminJudgeVoting",
    },
    {
      title: "Winners",
      icon: Trophy,
      path: "/Admin/AdminWinnersListPage",
    },
  ];

  return (
    <>
      {isMobile && (
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-primary text-white md:hidden"
          aria-label="Toggle menu">
          <Menu className="w-6 h-6" />
        </button>
      )}

      {isMobileOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div
        className={`fixed md:relative flex flex-col min-h-screen bg-primary text-white transition-all duration-300 z-50
          ${isMobile ? (isMobileOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"} 
          ${isDesktopCollapsed ? "md:w-20" : "md:w-64"}
          w-64`}>
        {!isMobile && (
          <button
            onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
            className="absolute -right-3 top-8 bg-sunlit-gold rounded-full p-1.5 hover:bg-secondary focus:outline-none hidden md:block"
            aria-label={
              isDesktopCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }>
            <ChevronRight
              className={`h-4 w-4 transition-transform duration-300 ${
                isDesktopCollapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        )}

        <div className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b border-secondary/30">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
            <MenuSquare className="w-6 h-6" />
          </div>
          {(!isDesktopCollapsed || isMobileOpen) && (
            <div>
              <h1 className="text-lg sm:text-xl font-bold">
                Pride of the World
              </h1>
              <p className="text-xs text-white/50">Administrator</p>
            </div>
          )}
        </div>

        <nav className="flex-1 px-3 sm:px-4 py-4 sm:py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "hover:bg-white/20 text-white/70"
                }`}
                title={isDesktopCollapsed && !isMobile ? item.title : ""}>
                <Icon className="w-5 h-5 flex-shrink-0" />
                {(!isDesktopCollapsed || isMobileOpen) && (
                  <span className="truncate">{item.title}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 sm:p-4 border-t border-secondary/30">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-2 sm:px-3 py-1.5 sm:py-2 text-unity-coral rounded-lg hover:bg-white/20 transition-colors duration-200"
            title={isDesktopCollapsed && !isMobile ? "Sign out" : ""}>
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {(!isDesktopCollapsed || isMobileOpen) && <span>Sign out</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
