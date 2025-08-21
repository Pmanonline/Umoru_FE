import React, { useEffect } from "react";
import { TokenExpirationModal } from "./components/tools/TokenExpirationModal";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/routes/protectedRoutes";
import AdminLayout from "./components/AdminDashboard/AdminLayout";
import Home from "./pages/Home";
import ServicesPage from "./pages/homePageComponents/Services";
import SupportPage from "./pages/SupportPage";
import ResourcesPage from "./pages/ResourcesPage";
import SingleEventPage from "./pages/SingleEventPage";
import BlogPage from "./pages/BlogPage";
import SingleBlogPage from "./pages/SingleBlogPage";
import EventsPage from "./pages/EventsPage";

// Auth
import RegisterUser from "./pages/Auth/RegisterUser";
import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import PasswordReset from "./pages/Auth/PasswordResset";

// Admin Dashboard
import AdminDashboard from "./pages/AdminPages/AdminDashboard";
import AdminALlUsers from "./pages/AdminPages/AdminALlUsers";
import CreateBlogPosts from "./pages/AdminPages/CreateBlogPosts";
import AdminBlogPageLists from "./pages/AdminPages/AdminBlogPageLists";
import AuthorList from "./pages/AdminPages/AuthorList";
import CreateAuthor from "./pages/AdminPages/CreateAuthor";
import SpeakerLists from "./pages/AdminPages/SpeakerLists";
import CreateEditSpeaker from "./pages/AdminPages/CreateEditSpeaker";
import EventLists from "./pages/AdminPages/EventLists";
import CreateEditEvents from "./pages/AdminPages/CreateEditEvents";
import RegisteredEvent from "./pages/AdminPages/RegisteredEvent";
import ResourceList from "./pages/AdminPages/ResourceLists";
import CreateEditResource from "./pages/AdminPages/CreateEditResource";

// Components
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
  const isDashboardRoute =
    location.pathname.startsWith("/User") ||
    location.pathname.startsWith("/Admin");

  return (
    <>
      <ScrollToTop />
      {!isDashboardRoute && <Navbar />}
      <Routes>
        {/* General Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/ResourcesPage" element={<ResourcesPage />} />
        <Route path="/SingleEvent/:slug" element={<SingleEventPage />} />
        <Route path="/Posts/:slug" element={<SingleBlogPage />} />
        <Route path="/Blog/" element={<BlogPage />} />
        <Route path="/Events/" element={<EventsPage />} />

        {/* Auth */}
        <Route path="/register" element={<RegisterUser />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<PasswordReset />} />

        {/* Admin Dashboard */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route element={<AdminLayout />}>
            <Route path="/Admin/Dashboard" element={<AdminDashboard />} />
            <Route path="/Admin/AdminALlUsers" element={<AdminALlUsers />} />
            <Route path="/Admin/BlogPosts" element={<AdminBlogPageLists />} />
            <Route
              path="/Admin/CreateBlogPosts/:postId?"
              element={<CreateBlogPosts />}
            />
            {/* Authors */}
            <Route path="/Admin/Authors" element={<AuthorList />} />
            <Route
              path="/Admin/CreateAuthor/:authorId?"
              element={<CreateAuthor />}
            />
            {/* speakers */}
            <Route path="/Admin/Speakers" element={<SpeakerLists />} />
            <Route
              path="/Admin/CreateEditSpeaker/:id?"
              element={<CreateEditSpeaker />}
            />
            {/* events */}
            <Route path="/Admin/Events" element={<EventLists />} />
            <Route
              path="/Admin/CreateEditEvents/:eventId?"
              element={<CreateEditEvents />}
            />
            <Route
              path="/Admin/RegisteredEvents"
              element={<RegisteredEvent />}
            />
            <Route path="/Admin/ResourceList" element={<ResourceList />} />
            <Route
              path="/Admin/CreateEditResources/:resourceId?"
              element={<CreateEditResource />}
            />
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
      <TokenExpirationModal />
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
