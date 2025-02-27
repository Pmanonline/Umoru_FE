import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  MapPin,
  Mail,
  Phone,
  Share2,
  MessageCircle,
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isContactVisible, setIsContactVisible] = useState(false);

  // Fetch profile data
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendURL}/api/profile/${slug}`);
      if (response.data.status === "success" && response.data.contact) {
        setProfile(response.data.contact);
      } else {
        setError("Profile not found");
      }
    } catch (err) {
      setError("Error fetching profile data");
      console.error("API fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchProfile();
    AOS.init({ duration: 800, once: true }); // Initialize AOS (optional)
  }, [fetchProfile]);

  // Handle share functionality
  const handleShare = async () => {
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
  };

  // Utility function to format date as "September 2nd, 1990"
  const formatDateOfBirth = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid date";

    const options = { month: "long", day: "numeric", year: "numeric" };
    const formatted = date.toLocaleDateString("en-US", options);

    // Add ordinal suffix (e.g., "2nd" instead of "2")
    const day = date.getDate();
    let suffix = "th";
    if (day === 1 || day === 21 || day === 31) suffix = "st";
    else if (day === 2 || day === 22) suffix = "nd";
    else if (day === 3 || day === 23) suffix = "rd";

    const [month, , year] = formatted.split(" ");
    return `${month} ${day}${suffix}, ${year}`;
  };

  // Masking utilities
  const maskPhoneNumber = (phone) => {
    if (!phone || phone.length < 10) return phone || "Not available";
    return `${phone.slice(0, 8)}****${phone.slice(-2)}`;
  };

  const maskEmail = (email) => {
    if (!email || !email.includes("@")) return "Not available";
    const [localPart, domain] = email.split("@");
    if (localPart.length <= 3) return email;
    const visibleStart = localPart.slice(0, 3);
    const masked = "*".repeat(localPart.length - 3);
    return `${visibleStart}${masked}@${domain}`;
  };

  const toggleContactVisibility = () => {
    setIsContactVisible(!isContactVisible);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center transform transition-all hover:shadow-2xl"
          data-aos="fade-up">
          <div className="text-red-600 mb-4">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto animate-pulse">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12" y2="16"></line>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {error || "Profile Not Found"}
          </h2>
          <p className="text-gray-600 mb-6">
            The profile you're looking for doesn't exist or might have been
            removed.
          </p>
          <Link to="/searchPage/people">
            <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
              <ChevronLeft size={20} />
              Back to Search
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const fullName =
    `${profile.first_name} ${profile.middle_name || ""} ${profile.last_name}`.trim();

  return (
    <div className="max-w-7xl mx-auto p-4 pb-16 bg-gray-50 min-h-screen">
      {/* Profile Header */}
      <div
        className="relative bg-gradient-to-r from-red-600 via-pink-600 to-blue-700 rounded-3xl shadow-2xl overflow-hidden mb-8 transform transition-all hover:shadow-3xl"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)" }}
        data-aos="fade-down">
        <div className="absolute inset-0 bg-black/20"></div>{" "}
        {/* Subtle overlay */}
        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          {/* Profile Image */}
          <div className="relative group">
            <img
              src={profile.image || defaultProfileImage}
              alt={fullName}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-lg transition-transform duration-300 group-hover:scale-110"
              onError={(e) => (e.target.src = defaultProfileImage)}
            />
            <div className="absolute inset-0 bg-black/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-200">
              {fullName}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-white/90">
              {profile.current_place_of_work && (
                <div className="flex items-center gap-2">
                  <Briefcase size={20} className="text-blue-200" />
                  <span>{profile.current_place_of_work}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <MapPin size={20} className="text-red-200" />
                <span>{`${profile.city || "N/A"}, ${profile.state || "N/A"}`}</span>
              </div>
              {profile.date_of_birth && (
                <div className="flex items-center gap-2">
                  <Calendar size={20} className="text-green-200" />
                  <span>{formatDateOfBirth(profile.date_of_birth)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column - Actions */}
        <div className="lg:col-span-1">
          <div
            className="bg-white rounded-2xl shadow-md p-6 sticky top-4 transition-all duration-300 hover:shadow-xl"
            data-aos="fade-right">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <MessageCircle size={20} className="text-green-600" />
              Actions
            </h2>
            <div className="space-y-4">
              <button
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
                <Share2 size={18} />
                Share Profile
              </button>
              <button className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105">
                <MessageCircle size={18} />
                Send Message
              </button>
              <button className="w-full flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105">
                <Flag size={18} />
                Report Profile
              </button>
              <Link
                to="/searchPage/people"
                className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105">
                <ChevronLeft size={18} />
                Back to Search
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column - Profile Details */}
        <div className="lg:col-span-3 space-y-8">
          {/* Contact Card */}
          <div
            className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl"
            data-aos="fade-up">
            <div className="p-6 bg-blue-50">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Mail size={24} className="text-blue-600" />
                Contact Details
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
                    Phone Number
                  </span>
                  <button
                    onClick={toggleContactVisibility}
                    className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors">
                    {isContactVisible ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                  <Phone size={20} className="text-green-600" />
                  <span className="font-medium text-gray-800">
                    {isContactVisible
                      ? profile.phone
                      : maskPhoneNumber(profile.phone)}
                  </span>
                </div>
              </div>
              <div className="group">
                <div className="mb-2 text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
                  Email Address
                </div>
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                  <Mail size={20} className="text-blue-600" />
                  <span className="font-medium text-gray-800 break-all">
                    {maskEmail(profile.email)}
                  </span>
                </div>
              </div>
              <div className="group">
                <div className="mb-2 text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
                  Address
                </div>
                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                  <MapPin size={20} className="text-red-600" />
                  <span className="font-medium text-gray-800">
                    {profile.address || "Not specified"}
                  </span>
                </div>
              </div>
              {profile.social_media_links &&
                profile.social_media_links.length > 0 && (
                  <div className="group">
                    <div className="mb-2 text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
                      Social Media
                    </div>
                    <div className="space-y-3">
                      {profile.social_media_links.map((link, index) => (
                        <a
                          key={index}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors text-blue-600 font-medium">
                          <Globe size={20} />
                          <span className="truncate">{link}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* Personal and Professional Details */}
          <div
            className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl"
            data-aos="fade-up"
            data-aos-delay="200">
            <div className="p-6 bg-purple-50">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <User size={24} className="text-purple-600" />
                Profile Overview
              </h2>
            </div>
            <div className="p-6 space-y-8">
              {/* Personal Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileDetail
                  icon={<Calendar className="text-orange-500" />}
                  label="Date of Birth"
                  value={formatDateOfBirth(profile.date_of_birth)}
                />
                <ProfileDetail
                  icon={<Users className="text-green-500" />}
                  label="Gender"
                  value={
                    profile.gender
                      ? profile.gender.charAt(0).toUpperCase() +
                        profile.gender.slice(1)
                      : "Not specified"
                  }
                />
                <ProfileDetail
                  icon={<Users className="text-blue-500" />}
                  label="Marital Status"
                  value={
                    profile.marital_status
                      ? profile.marital_status.charAt(0).toUpperCase() +
                        profile.marital_status.slice(1)
                      : "Not specified"
                  }
                />
                <ProfileDetail
                  icon={<User className="text-red-500" />}
                  label="Religion"
                  value={
                    profile.religion
                      ? profile.religion.charAt(0).toUpperCase() +
                        profile.religion.slice(1)
                      : "Not specified"
                  }
                />
                <ProfileDetail
                  icon={<Users className="text-purple-500" />}
                  label="Number of Children"
                  value={
                    profile.number_of_children !== undefined
                      ? profile.number_of_children
                      : "Not specified"
                  }
                />
              </div>

              {/* Professional Details */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Briefcase size={20} className="text-blue-600" />
                  Professional Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProfileDetail
                    icon={<Briefcase className="text-blue-500" />}
                    label="Current Workplace"
                    value={profile.current_place_of_work || "Not specified"}
                  />
                  <ProfileDetail
                    icon={<Briefcase className="text-orange-500" />}
                    label="Previous Workplace"
                    value={profile.last_place_of_work || "Not specified"}
                  />
                  <ProfileDetail
                    icon={<User className="text-purple-500" />}
                    label="Qualification"
                    value={
                      profile.qualification
                        ? profile.qualification.charAt(0).toUpperCase() +
                          profile.qualification.slice(1)
                        : "Not specified"
                    }
                  />
                </div>
              </div>

              {/* Metadata */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Clock size={20} className="text-gray-600" />
                  Profile Metadata
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProfileDetail
                    icon={<Clock className="text-gray-500" />}
                    label="Profile Created"
                    value={new Date(profile.created_at).toLocaleString()}
                  />
                  <ProfileDetail
                    icon={<Clock className="text-gray-500" />}
                    label="Last Updated"
                    value={new Date(profile.updated_at).toLocaleString()}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Profile Detail Component with Hover Effects
const ProfileDetail = ({ icon, label, value }) => (
  <div className="group flex items-start gap-4 p-4 bg-gray-50 rounded-xl transition-all duration-300 hover:bg-gray-100 hover:shadow-md">
    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow-lg transition-shadow duration-300">
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <div className="flex-1">
      <p className="text-sm text-gray-600 font-medium group-hover:text-gray-800 transition-colors">
        {label}
      </p>
      <p className="text-gray-800 font-semibold">{value}</p>
    </div>
  </div>
);

export default PeopleProfilePage;
