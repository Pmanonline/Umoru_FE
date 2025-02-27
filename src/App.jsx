import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/routes/protectedRoutes";
import AdminLayout from "./components/AdminDashboard/AdminLayout";
import UserLayout from "./components/UserDashboard/UserLayout";
import AgentLayout from "./components/AgentDashboard/AgentLayout";
import { Home } from "./pages/Home";
import SearchPage from "./pages/searchPage";
import PeopleSearchPage from "./pages/PeopleSearchPage";
import BlacklistPage from "./pages/BlacklistPage";
import AllBusinessesPage from "./pages/AllBusinessPage";
import SingleBusinessPage from "./pages/SingleBusinessPage";
import SinglePeoplesPage from "./pages/SinglePeoplesPage";
import PeoplePage from "./pages/PeoplesPage";
import RequestFormPage from "./pages/RequestFormPage";
import ReporBusiness from "./pages/ReporBusiness";
import PackagesPage from "./pages/PackagesPage";
import PaymentPage from "./pages/PaymentPage ";
// Egroup
import GroupPage from "./pages/Groups/GroupPage";
import DiscussionPage from "./pages/Groups/Discussion";
// Auth
import Signup from "./pages/Auth/Register";
import EmailVerification from "./pages/Auth/EmailVerification";
import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
// AdminDashBoard
import AdminDashboard from "./pages/AdminPages/AdminDashboard";

// AgentDashboard
import AgentDashboard from "./pages/AgentPages/AgentDashboard";

// UserDashboard
import UserProfile from "./pages/UserPages/UserProfile";
import UserDashboard from "./pages/UserPages/UserDashboard";

// Others
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppContent = () => {
  const location = useLocation();
  // const isDashboardRoute = location.pathname.startsWith("/User", "/Admin");
  const isDashboardRoute =
    location.pathname.startsWith("/User") ||
    location.pathname.startsWith("/user") ||
    location.pathname.startsWith("/Admin") ||
    location.pathname.startsWith("/Agent");

  return (
    <>
      <ScrollToTop />
      {!isDashboardRoute && <Navbar />}
      <Routes>
        {/* general */}
        <Route path="/" element={<Home />} />
        <Route path="/searchPage" element={<SearchPage />} />
        <Route path="/searchPage/people" element={<PeopleSearchPage />} />
        <Route path="/business" element={<AllBusinessesPage />} />
        <Route path="/SingleBusinessPage" element={<SingleBusinessPage />} />
        <Route path="/profile/:slug?" element={<SinglePeoplesPage />} />
        <Route path="/people" element={<PeoplePage />} />
        <Route path="/blacklist" element={<BlacklistPage />} />
        <Route path="/requests" element={<RequestFormPage />} />
        <Route path="/reports" element={<ReporBusiness />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/payment/:packageId?" element={<PaymentPage />} />
        {/* E-Groups */}
        <Route path="/Group/:slug?" element={<GroupPage />} />
        <Route path="/discussion/:slug?" element={<DiscussionPage />} />

        {/* Auth */}
        <Route path="/signUp" element={<Signup />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Admin dashborad  */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route element={<AdminLayout />}>
            <Route path="/Admin/Dashboard" element={<AdminDashboard />} />
          </Route>
        </Route>

        {/* User dashborad  */}
        <Route element={<ProtectedRoute requiredRole="user" />}>
          <Route element={<UserLayout />}>
            <Route path="/user/profile" element={<UserProfile />} />
            <Route path="/user/MyDashBoad" element={<UserDashboard />} />
          </Route>
        </Route>

        {/* Agent dashborad*/}
        <Route element={<ProtectedRoute requiredRole="agent" />}>
          <Route element={<AgentLayout />}>
            <Route path="/Agent/Dashboard" element={<AgentDashboard />} />
          </Route>
        </Route>
      </Routes>

      {!isDashboardRoute && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
