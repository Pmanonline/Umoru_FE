import React, { useEffect } from "react";
import { TokenExpirationModal } from "./components/tools/TokenExpirationModal";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/routes/protectedRoutes";
import AdminLayout from "./components/AdminDashboard/AdminLayout";
import Home from "./pages/Home";
import AboutUsPage from "./pages/AboutUsPage";
import AwardTypesPage from "./pages/AwardTypesPage";
import GalleryPage from "./pages/GalleryPage";
// Funding % payment
import FundPage from "./pages/FundPage";
import DonationVerifyPage from "./pages/payment/DonationVerifyPage";
import DonationSuccessPage from "./pages/payment/DonationSuccessPage";
import DonationErrorPage from "./pages/payment/DonationErrorPage";

import VotingPage from "./pages/VotingPage";
import WinnersPage from "./pages/Winners";
import NationalAwards from "./pages/NationalAwards";
import ContinentAwardPage from "./pages/ContinentAwardPage";
import AwardByCountry from "./pages/AwardByCountry";
import SingleCountryAward from "./pages/SingleCountryAward";
import SingleAward from "./pages/SingleAward";
import SingleFamousPerson from "./pages/SingleFamousPerson";
import SinglePrideInCategory from "./pages/SinglePrideInCategory";
import SuggestNominee from "./pages/SuggestNominee";
import SuggestedNomineesPage from "./pages/SuggestedNomineesPage";
import NominationDetailPage from "./pages/NominationDetailPage";
// recommendedPeope by timeFrame
import SingleRecommendedPerson from "./pages/SingleRecommendedPerson";
// Egroup
import EGroup from "./pages/Groups/GroupPage";
import GroupDiscussionPage from "./pages/Groups/Discussion";
// Auth
import RegisterUser from "./pages/Auth/RegisterUser";
import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import PasswordReset from "./pages/Auth/PasswordResset";

// AdminDashBoard
import AdminDashboard from "./pages/AdminPages/AdminDashboard";
import CreateAward from "./pages/AdminPages/CreateAwards";
import CreateFamousPerson from "./pages/AdminPages/CreateFamousPeople";
import AwardLists from "./pages/AdminPages/AwardLists";
import FamousPeopleList from "./pages/AdminPages/FamousPeopleList";
import CreatePride from "./pages/AdminPages/CreatePride";
import PrideInCategoryList from "./pages/AdminPages/PrideInCategoryList";
import CreateRecommendedPerson from "./pages/AdminPages/CreateRecommendedPerson";
import RecommendedPersonList from "./pages/AdminPages/RecommendedPersonList";
import CreateNominee from "./pages/AdminPages/CreateNominee";
import NomineeList from "./pages/AdminPages/NomineeList";
import AdminJudgeVoting from "./pages/AdminPages/Admin/AdminJudgeVoting";
import CreateEditWinnerPage from "./pages/AdminPages/CreateWinners";
import AdminWinnersListPage from "./pages/AdminPages/WinnersList";
import AdminALlUsers from "./pages/AdminPages/AdminALlUsers";
import AdminSuggestedNomination from "./pages/AdminPages/AdminSuggestedNomination";
// import DocumentVerifications from "./pages/AdminPages/DocumentVerifications";

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
    location.pathname.startsWith("/Admin");

  return (
    <>
      <ScrollToTop />
      {!isDashboardRoute && <Navbar />}
      <Routes>
        {/* general */}
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/award-types" element={<AwardTypesPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        {/* donation and funds */}
        <Route path="/fund" element={<FundPage />} />
        <Route path="/donation/verify" element={<DonationVerifyPage />} />
        <Route path="/donation/success" element={<DonationSuccessPage />} />
        <Route path="/donation/error" element={<DonationErrorPage />} />
        {/* donation and funds */}
        <Route path="/nominate" element={<VotingPage />} />
        <Route path="/winner" element={<WinnersPage />} />
        <Route path="/national-awards" element={<NationalAwards />} />
        <Route path="/continent-awards" element={<ContinentAwardPage />} />
        <Route path="/regionalAward/:continent?" element={<AwardByCountry />} />
        <Route path="/suggest-nominee" element={<SuggestNominee />} />
        <Route path="/suggested-nominees" element={<SuggestedNomineesPage />} />
        <Route path="/nomination/:slug?" element={<NominationDetailPage />} />
        <Route
          path="/nationsAward/:country?"
          element={<SingleCountryAward />}
        />

        <Route
          path="/singleAward/Award-details/:slug?"
          element={<SingleAward />}
        />
        <Route
          path="/SingleFamousPerson/:slug?"
          element={<SingleFamousPerson />}
        />
        <Route
          path="/Single-pride/:slug?"
          element={<SinglePrideInCategory />}
        />
        <Route
          path="/recommended/:slug"
          element={<SingleRecommendedPerson />}
        />

        {/* E-Groups */}
        <Route path="/Group/:slug?" element={<EGroup />} />
        <Route path="/discussion/:slug?" element={<GroupDiscussionPage />} />

        {/* Auth */}
        <Route path="/register" element={<RegisterUser />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<PasswordReset />} />

        {/* Admin dashborad  */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route element={<AdminLayout />}>
            <Route path="/Admin/Dashboard" element={<AdminDashboard />} />
            <Route path="/Admin/AdminALlUsers" element={<AdminALlUsers />} />
            <Route path="/Admin/CreateAward/:slug?" element={<CreateAward />} />
            <Route
              path="/Admin/CreateFamousPerson/:slug?"
              element={<CreateFamousPerson />}
            />
            <Route path="/Admin/CreatePride/:slug?" element={<CreatePride />} />
            <Route path="/Admin/AwardList" element={<AwardLists />} />
            <Route
              path="/Admin/PrideInCategoryList"
              element={<PrideInCategoryList />}
            />
            <Route
              path="/Admin/FamousPeopleList"
              element={<FamousPeopleList />}
            />
            <Route
              path="/Admin/CreateRecommendedPerson/:slug?"
              element={<CreateRecommendedPerson />}
            />
            <Route
              path="/Admin/RecommendedPersonList"
              element={<RecommendedPersonList />}
            />
            <Route
              path="/Admin/CreateNominee/:slug?"
              element={<CreateNominee />}
            />
            <Route path="/Admin/NomineeList" element={<NomineeList />} />
            <Route
              path="/Admin/AdminJudgeVoting"
              element={<AdminJudgeVoting />}
            />
            <Route
              path="/Admin/CreateEditWinnerPage/:slug?"
              element={<CreateEditWinnerPage />}
            />
            <Route
              path="/Admin/AdminWinnersListPage"
              element={<AdminWinnersListPage />}
            />
            <Route
              path="/Admin/AdminSuggestedNomination"
              element={<AdminSuggestedNomination />}
            />
            <Route
              path="/Admin/AdminWinnersListPage"
              element={<AdminWinnersListPage />}
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
