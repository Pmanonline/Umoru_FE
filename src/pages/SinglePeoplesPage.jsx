import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MapPin,
  Mail,
  Phone,
  Share2,
  Flag,
  Calendar,
  Users,
  Briefcase,
  User,
  Clock,
  Globe,
  ChevronLeft,
  Eye,
  EyeOff,
  Heart,
  Award,
  BookOpen,
  Coffee,
  Download,
} from "lucide-react";
import LoadingSpinner from "../components/tools/LoaddingSpinner";
import AOS from "aos";
import "aos/dist/aos.css";
import backendURL from "../config";

// Default profile image
const defaultProfileImage =
  "https://res.cloudinary.com/dvrrp1om6/image/upload/v1738679858/wmremove-transformed_xeagfn.jpg";

const PeopleProfilePage = () => {
  const { slug } = useParams();
  const [profile, setProfile] = useState(null);
  const [businesses, setBusinesses] = useState(null); // Fixed typo: businesess -> businesses
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isContactVisible, setIsContactVisible] = useState(false);
  const [accessModal, setAccessModal] = useState(false);
  const [accessData, setAccessData] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [showBusinesses, setShowBusinesses] = useState(false);
  const { userInfo, token } = useSelector((state) => state.auth);
  const userId = userInfo?.id;
  const navigate = useNavigate();

  // Initialize AOS only once
  useEffect(() => {
    AOS.init({ duration: 800 });
    return () => AOS.refresh(); // Cleanup AOS on unmount
  }, []);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null); // Reset error on new fetch
    try {
      const response = await axios.get(`${backendURL}/api/profile/${slug}`, {
        headers: { Authorization: `Bearer ${token.token}` },
      });
      const data = response.data;
      if (data.status === "success" && data.contact) {
        setProfile(data.contact);
        setPhoto(data.userPhoto || defaultProfileImage);
        setBusinesses(data.businesses || []); // Default to empty array if no businesses
      } else {
        setError(data.message || "Profile not found");
      }
    } catch (err) {
      if (err.response?.data?.status === "pending") {
        setAccessData(err.response.data);
        setAccessModal(true);
      } else {
        setError(err.response?.data?.message || "Error fetching profile data");
      }
    } finally {
      setLoading(false);
    }
  }, [slug, token.token]);

  // Fetch profile on mount or slug change
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Memoize utility functions to prevent recreation
  const formatDateOfBirth = useMemo(() => {
    return (dateString) => {
      if (!dateString) return "Not specified";
      const date = new Date(dateString);
      if (isNaN(date)) return "Invalid date";
      const options = { month: "long", day: "numeric", year: "numeric" };
      const formatted = date.toLocaleDateString("en-US", options);
      const day = date.getDate();
      const suffix =
        day === 1 || day === 21 || day === 31
          ? "st"
          : day === 2 || day === 22
            ? "nd"
            : day === 3 || day === 23
              ? "rd"
              : "th";
      const [month, , year] = formatted.split(" ");
      return `${month} ${day}${suffix}, ${year}`;
    };
  }, []);

  const maskPhoneNumber = useMemo(() => {
    return (phone) => {
      if (!phone || phone.length < 10) return phone || "Not available";
      return `${phone.slice(0, 8)}****${phone.slice(-2)}`;
    };
  }, []);

  const maskEmail = useMemo(() => {
    return (email) => {
      if (!email || !email.includes("@")) return "Not available";
      const [localPart, domain] = email.split("@");
      if (localPart.length <= 3) return email;
      const visibleStart = localPart.slice(0, 3);
      const masked = "*".repeat(localPart.length - 3);
      return `${visibleStart}${masked}@${domain}`;
    };
  }, []);

  // Handlers
  const handleShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${profile?.first_name} ${profile?.last_name}`,
          text: `Check out ${profile?.first_name} ${profile?.last_name}'s profile`,
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert("Profile link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  }, [profile?.first_name, profile?.last_name]);

  const toggleContactVisibility = useCallback(() => {
    setIsContactVisible((prev) => !prev);
  }, []);

  const handleCloseModal = useCallback(() => {
    setAccessModal(false);
    navigate("/people");
  }, [navigate]);

  const initiateCall = useCallback(() => {
    window.location.href = `tel:${profile?.phone}`;
  }, [profile?.phone]);

  const handleReportClick = useCallback(() => {
    setShouldNavigate(true);
  }, []);

  if (shouldNavigate) {
    return <Navigate to={`/reports?id=${userId}`} replace />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (accessModal && accessData) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-md shadow-2xl">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Access Request
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Status: {accessData.status}
            <br />
            Message: {accessData.message}
            <br />
            Action: {accessData.action}
            <br />
            Request ID: {accessData.request_id}
            <br />
            Your request to access the page will be responded to soon.
          </p>
          <button
            onClick={handleCloseModal}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
            Close
          </button>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-md text-center">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto text-red-500">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12" y2="16"></line>
          </svg>
          <h2 className="text-2xl font-bold text-gray-800">
            {error || "Profile Not Found"}
          </h2>
          <Link to="/searchPage/people">
            <button className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              <ChevronLeft size={20} /> Back
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const fullName = `${profile.first_name || ""} ${profile.middle_name || ""} ${
    profile.last_name || ""
  }`.trim();

  return (
    <div className="max-w-6xl mx-auto bg-gray-50 min-h-screen">
      {accessModal && accessData && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Access Request
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Status: {accessData.status}
              <br />
              Message: {accessData.message}
              <br />
              Action: {accessData.action}
              <br />
              Request ID: {accessData.request_id}
              <br />
              Your request to access the page will be responded to soon.
            </p>
            <button
              onClick={() => setAccessModal(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
              Close
            </button>
          </div>
        </div>
      )}
      <div className="relative" data-aos="fade-up">
        <div
          className="h-48 sm:h-64 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)" }}>
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg -mt-16 sm:-mt-24 relative z-10 overflow-hidden">
            <Link
              to="/people"
              className="inline-flex items-center text-sm px-3 py-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition duration-300 mb-2">
              <ChevronLeft size={16} />
              <span className="whitespace-nowrap">Back</span>
            </Link>
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="relative -mt-12 sm:-mt-8 mb-3 sm:mb-0">
                  <div className="rounded-full border-4 border-white shadow-lg overflow-hidden w-[14rem] h-[14rem]">
                    <img
                      src={photo}
                      alt={fullName}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.src = defaultProfileImage)}
                    />
                  </div>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    {fullName}
                  </h1>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-2 mt-2 text-gray-600 text-sm">
                    {profile.profession && (
                      <div className="flex items-center gap-1">
                        <Briefcase size={14} className="text-blue-500" />
                        <span>{profile.profession}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <MapPin size={14} className="text-red-500" />
                      <span>{`${profile.city || "N/A"}, ${profile.state || "N/A"}`}</span>
                    </div>
                    {profile.current_place_of_work && (
                      <div className="flex items-center gap-1">
                        <Award size={14} className="text-purple-500" />
                        <span>{profile.current_place_of_work}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap justify-start sm:justify-start gap-2 mt-4 sm:mt-4 relative">
                <button
                  onClick={handleShare}
                  className="px-3 py-1.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition duration-300 flex items-center gap-1 text-sm">
                  <Share2 size={14} />
                  <span>Share</span>
                </button>
                <button
                  className="px-3 py-1.5 rounded-lg bg-lime-500 text-white hover:bg-green transition duration-300 flex items-center gap-1 text-sm"
                  onClick={initiateCall}
                  aria-label={`Call ${profile.phone}`}>
                  <Phone size={14} />
                  <span>Call</span>
                </button>
                <button
                  onClick={handleReportClick}
                  aria-label="Report user"
                  className="px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition duration-300 flex items-center gap-1 text-sm">
                  <Flag size={14} />
                  <span>Report</span>
                </button>
                {/* Then replace the businesses button with our new implementation */}
                <div className="relative">
                  <button
                    onClick={() => setShowBusinesses(!showBusinesses)}
                    className="px-3 py-1.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition duration-300 flex items-center gap-1 text-sm">
                    <Briefcase size={14} />
                    <span>Businesses</span>
                    <span className="ml-1 bg-white text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                      {businesses?.length || 0}
                    </span>
                    <span className="ml-1">{showBusinesses ? "▲" : "▼"}</span>
                  </button>

                  {showBusinesses && businesses && (
                    <div className="absolute top-[-9rem] left-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-2 z-10 space-y-2">
                      {businesses.length > 0 ? (
                        <>
                          <p className="text-sm text-gray-600">
                            Businesses: {businesses.length}
                          </p>
                          {businesses.map((business) => (
                            <button
                              key={business.id}
                              onClick={() => {
                                navigate(
                                  `/SingleBusinessPage/${business.slug}`
                                );
                                setShowBusinesses(false);
                              }}
                              className="w-full text-left p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm text-blue-600">
                              {business.business_name}
                            </button>
                          ))}
                        </>
                      ) : (
                        <p className="text-sm text-gray-600">
                          No businesses available
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
        {profile.bio && (
          <div className="bg-white p-6 rounded-xl shadow-md" data-aos="fade-up">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <User size={20} className="text-blue-500" />
              Biography
            </h2>
            <p className="text-gray-700">{profile.bio}</p>
          </div>
        )}
        <div className="bg-white p-6 rounded-xl shadow-md" data-aos="fade-up">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <User size={20} className="text-purple-500" />
            Personal Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileDetailRow
              icon={<Calendar size={18} className="text-orange-500" />}
              label="Date of Birth"
              value={formatDateOfBirth(profile.date_of_birth)}
            />
            <ProfileDetailRow
              icon={<Users size={18} className="text-green-500" />}
              label="Gender"
              value={
                profile.gender
                  ? profile.gender.charAt(0).toUpperCase() +
                    profile.gender.slice(1)
                  : "Not specified"
              }
            />
            <ProfileDetailRow
              icon={<Users size={18} className="text-blue-500" />}
              label="Marital Status"
              value={
                profile.marital_status
                  ? profile.marital_status.charAt(0).toUpperCase() +
                    profile.marital_status.slice(1)
                  : "Not specified"
              }
            />
            <ProfileDetailRow
              icon={<Heart size={18} className="text-red-500" />}
              label="Religion"
              value={
                profile.religion
                  ? profile.religion.charAt(0).toUpperCase() +
                    profile.religion.slice(1)
                  : "Not specified"
              }
            />
            <ProfileDetailRow
              icon={<Users size={18} className="text-purple-500" />}
              label="Children"
              value={
                profile.number_of_children !== undefined
                  ? profile.number_of_children
                  : "Not specified"
              }
            />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md" data-aos="fade-up">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Briefcase size={20} className="text-blue-500" />
            Professional Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileDetailRow
              icon={<Briefcase size={18} className="text-blue-500" />}
              label="Profession"
              value={profile.profession || "Not specified"}
            />
            <ProfileDetailRow
              icon={<Briefcase size={18} className="text-yellow-500" />}
              label="Current Workplace"
              value={profile.current_place_of_work || "Not specified"}
            />
            <ProfileDetailRow
              icon={<Award size={18} className="text-purple-500" />}
              label="Experience"
              value="Not specified"
            />
            <ProfileDetailRow
              icon={<BookOpen size={18} className="text-green-500" />}
              label="Education"
              value="Not specified"
            />
            <ProfileDetailRow
              icon={<Globe size={18} className="text-blue-500" />}
              label="Languages"
              value="Not specified"
            />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md" data-aos="fade-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Mail size={20} className="text-blue-500" />
              Contact Information
            </h2>
            <button
              onClick={toggleContactVisibility}
              className="text-blue-500 hover:text-blue-700 p-1 rounded transition-colors flex items-center gap-1">
              {isContactVisible ? (
                <>
                  <EyeOff size={16} />
                  <span className="text-sm">Hide</span>
                </>
              ) : (
                <>
                  <Eye size={16} />
                  <span className="text-sm">Show</span>
                </>
              )}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ContactItem
              icon={<Phone size={18} className="text-green-500" />}
              label="Phone Number"
              value={
                isContactVisible
                  ? profile.phone
                  : maskPhoneNumber(profile.phone)
              }
              action="Call"
              actionIcon={<Phone size={16} />}
            />
            <ContactItem
              icon={<Mail size={18} className="text-blue-500" />}
              label="Email Address"
              value={
                isContactVisible ? profile.email : maskEmail(profile.email)
              }
              action="Email"
              actionIcon={<Mail size={16} />}
            />
            <ContactItem
              icon={<MapPin size={18} className="text-red-500" />}
              label="Address"
              value={profile.address || "Not specified"}
              action="Map"
              actionIcon={<MapPin size={16} />}
            />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md" data-aos="fade-up">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Globe size={20} className="text-purple-500" />
            Social Media
          </h2>
          {profile.social_media_links &&
          profile.social_media_links.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.social_media_links.map((link, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Globe size={18} className="text-blue-500" />
                    </div>
                    <div className="flex-1 truncate">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {link.includes("facebook")
                          ? "Facebook"
                          : link.includes("twitter") || link.includes("x.com")
                            ? "Twitter/X"
                            : link.includes("instagram")
                              ? "Instagram"
                              : link.includes("linkedin")
                                ? "LinkedIn"
                                : "Social Media"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{link}</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Globe size={16} />
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-500">
              No social media links available
            </div>
          )}
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md" data-aos="fade-up">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Clock size={20} className="text-gray-500" />
            Profile Metadata
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileDetailRow
              icon={<Clock size={18} className="text-blue-500" />}
              label="Profile Created"
              value={new Date(profile.created_at).toLocaleString()}
            />
            <ProfileDetailRow
              icon={<Clock size={18} className="text-green-500" />}
              label="Last Updated"
              value={new Date(profile.updated_at).toLocaleString()}
            />
            <ProfileDetailRow
              icon={<Eye size={18} className="text-purple-500" />}
              label="Profile Views"
              value="124"
            />
            <ProfileDetailRow
              icon={<Coffee size={18} className="text-orange-500" />}
              label="Profile Status"
              value="Active"
            />
          </div>
          <div className="mt-8">
            <h3 className="text-md font-medium text-gray-700 mb-3">
              Download Profile Information
            </h3>
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                <Download size={16} />
                <span>vCard</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
                <Download size={16} />
                <span>PDF</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors">
                <Download size={16} />
                <span>JSON</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Profile Detail Row Component
const ProfileDetailRow = React.memo(({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium text-gray-800">{value}</p>
    </div>
  </div>
));

// Contact Item Component
const ContactItem = React.memo(({ icon, label, value, action, actionIcon }) => (
  <div className="p-3 bg-gray-50 rounded-lg">
    <div className="flex items-center justify-between mb-2">
      <p className="text-xs text-gray-500 flex items-center gap-2">
        {icon}
        {label}
      </p>
      <button className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded flex items-center gap-1 hover:bg-blue-200 transition-colors">
        {actionIcon}
        {action}
      </button>
    </div>
    <p className="font-medium text-gray-800 break-all">{value}</p>
  </div>
));

export default PeopleProfilePage;
