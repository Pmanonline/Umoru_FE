import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Share2,
  Flag,
  Calendar,
  Users,
  Briefcase,
  Clock,
  Globe,
  ChevronLeft,
  Eye,
  EyeOff,
  Star,
  DollarSign,
  User,
  ImageIcon,
} from "lucide-react";
import { motion } from "framer-motion"; // Import Framer Motion
import LoadingSpinner from "../components/tools/LoaddingSpinner";
import backendURL from "../config";

// Default business logo
const defaultBusinessLogo =
  "https://res.cloudinary.com/digzrkdoe/image/upload/v1740847778/edirect_business_photos/business_67c33aa215e8f.png";

// Framer Motion animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const fadeInRight = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

const SingleBusinessPage = () => {
  const { slug } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isContactVisible, setIsContactVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchBusinessProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://backend.edirect.ng/api/business/${slug}`
      );
      console.log("API response:", response.data);
      if (response.data.status === "success" && response.data.business) {
        const businessData = response.data.business;
        // Parse JSON strings for staff, social_media, and product_photos
        const parsedData = {
          ...businessData,
          staff: businessData.staff
            ? typeof businessData.staff === "string"
              ? JSON.parse(businessData.staff)
              : Array.isArray(businessData.staff)
                ? businessData.staff
                : []
            : [],
          social_media: businessData.social_media
            ? typeof businessData.social_media === "string"
              ? JSON.parse(businessData.social_media)
              : businessData.social_media
            : {},
          business_photos: businessData.business_photos || [], // Ensure array, default to empty
          product_photos:
            businessData.product_photos &&
            businessData.product_photos.length > 0
              ? [
                  {
                    photo_paths: JSON.parse(
                      businessData.product_photos[0].photo_paths.replace(
                        /\\\//g,
                        "/"
                      )
                    ),
                  },
                ]
              : [],
        };
        setProfile(parsedData);
      } else {
        setError("Business profile not found");
      }
    } catch (err) {
      setError("Error fetching business profile data");
      console.error("API fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchBusinessProfile();
  }, [fetchBusinessProfile]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: profile?.business_name,
          text: `Check out ${profile?.business_name}'s profile`,
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert("Business profile link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  console.log(profile, "profile");

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date)
      ? "Invalid"
      : date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
  };

  const toggleContactVisibility = () => setIsContactVisible(!isContactVisible);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <LoadingSpinner />
      </div>
    );

  if (error || !profile)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <motion.div
          className="bg-white rounded-lg shadow p-6 max-w-md w-full text-center"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}>
          <div className="text-red-500 mb-4">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="mx-auto animate-pulse">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12" y2="16" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {error || "Business Not Found"}
          </h2>
          <p className="text-gray-600 mb-4">
            The business profile doesn't exist or has been removed.
          </p>
          <Link
            to="/searchPage/businesses"
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            <ChevronLeft size={16} /> Back to Search
          </Link>
        </motion.div>
      </div>
    );

  const socialMedia = profile.social_media || {};
  const staff = profile.staff || [];

  return (
    <div className="max-w-5xl mx-auto bg-gray-100 min-h-screen p-4">
      {/* Header Section */}
      <motion.div
        className="bg-white rounded-lg shadow overflow-hidden bg-gradient-to-r from-[#341f1f] to-[#803d3d] opacity-80"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}>
        <div className="relative h-32">
          <Link
            to="/business"
            className="absolute top-2 left-2 p-1 bg-white/20 rounded-full text-white hover:bg-white/30 transition">
            <ChevronLeft size={20} />
          </Link>
        </div>
        <div className="relative -mt-16 px-4 pb-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <img
              src={
                profile.business_photos.length > 0
                  ? profile.business_photos[0].photo_path
                  : defaultBusinessLogo
              }
              alt={profile.business_name}
              className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
              onError={(e) => (e.target.src = defaultBusinessLogo)} // Fallback if image fails
            />
            <div className="flex-1 text-center sm:text-left text-white">
              <h1 className="text-2xl font-bold">{profile.business_name}</h1>
              <p className="text-sm">{profile.business_line}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-1 text-xs">
                <span className="flex items-center gap-1">
                  <MapPin size={12} /> {profile.business_address}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={12} /> {profile.number_of_staff} staff
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
              <button
                onClick={handleShare}
                className="flex items-center gap-1 px-3 py-2 mid:py-1 mid:px-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
                title="Share">
                <Share2 size={14} />
                <span className="text-sm mid:text-xs">Share</span>
              </button>
              <button
                className="flex items-center gap-1 px-3 py-2 mid:py-1 mid:px-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition"
                title="Profile">
                <User size={14} />
                <span className="text-sm mid:text-xs">Profile</span>
              </button>
              <button
                className="flex items-center gap-1 px-3 py-2 mid:py-1 mid:px-3 bg-lime-600 text-white rounded-xl hover:bg-lime-800 transition"
                title="Website">
                <Globe size={14} />
                <span className="text-sm mid:text-xs">Website</span>
              </button>
              <button
                className="flex items-center gap-1 px-3 py-2 mid:py-1 mid:px-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
                title="Report">
                <Flag size={14} />
                <span className="text-sm mid:text-xs">Report</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Tabs */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tabs */}
          <motion.div
            className="bg-white rounded-lg shadow overflow-hidden"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}>
            <div className="flex border-b">
              {["overview", "gallery", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 px-4 text-sm font-medium capitalize ${
                    activeTab === tab
                      ? "bg-red-500 text-white"
                      : "text-gray-600 hover:bg-gray-200"
                  } transition`}>
                  {tab}
                </button>
              ))}
            </div>
            <div className="p-4">
              {activeTab === "overview" && (
                <div className="space-y-8">
                  {/* About */}
                  {profile.business_description && (
                    <div>
                      <h2 className="text-lg font-semibold flex items-center gap-2 mb-2">
                        <Building2 size={18} className="text-blue-500" /> About
                      </h2>
                      <div
                        className="text-gray-700 text-sm"
                        dangerouslySetInnerHTML={{
                          __html: profile.business_description,
                        }}
                      />
                    </div>
                  )}
                  <hr className="my-4" />
                  {/* Quick Details */}
                  <div className="grid grid-cols-2 mod:grid-cols-1 gap-4">
                    <ProfileDetail
                      icon={<Calendar size={16} className="text-orange-500" />}
                      label="Established"
                      value={formatDate(profile.date_of_establishment)}
                    />
                    <ProfileDetail
                      icon={<Clock size={16} className="text-blue-500" />}
                      label="Working Hours"
                      value={profile.operation_hours}
                    />
                    <ProfileDetail
                      icon={<Users size={16} className="text-green-500" />}
                      label="Total Staff"
                      value={profile.number_of_staff}
                    />
                    <ProfileDetail
                      icon={<Briefcase size={16} className="text-purple-500" />}
                      label="Our Services"
                      value={profile.services_rendered}
                    />
                  </div>
                  <hr className="my-4" />
                  {/* Staff Details */}
                  <div>
                    <h2 className="text-lg font-semibold flex items-center gap-2 mb-2">
                      <Users size={18} className="text-green-500" /> Current
                      Staff
                    </h2>
                    <div className="space-y-2">
                      {Array.isArray(staff) && staff.length > 0 ? (
                        staff.map((member, index) => (
                          <div key={index} className="text-gray-700 text-sm">
                            {member.name} - {member.role} ({member.position})
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm italic">
                          Staff details currently unavailable
                        </p>
                      )}
                    </div>
                  </div>
                  <hr className="my-4" />
                  {/* Gallery Section */}
                  <div>
                    <h2 className="text-lg font-semibold flex items-center gap-2 mb-2">
                      <ImageIcon size={18} className="text-blue-500" /> Gallery
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {profile.product_photos.length > 0 &&
                      profile.product_photos[0]?.photo_paths?.length > 0 ? (
                        profile.product_photos[0].photo_paths.map(
                          (photoUrl, index) => (
                            <img
                              key={index}
                              src={photoUrl}
                              alt={`Product Photo ${index + 1}`}
                              className="w-full h-32 object-cover rounded-md border border-gray-200 hover:shadow-md transition-shadow duration-200"
                              onError={(e) =>
                                (e.target.src = defaultBusinessLogo)
                              } // Fallback if image fails
                            />
                          )
                        )
                      ) : (
                        <p className="text-gray-500 text-sm col-span-full">
                          No photos available yet.
                        </p>
                      )}
                    </div>
                  </div>
                  <hr className="my-4" />
                  {/* Reviews Section */}
                  <div>
                    <h2 className="text-lg font-semibold flex items-center gap-2 mb-2">
                      <Star size={18} className="text-yellow-500" /> Reviews
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-gray-800">
                          4.5
                        </span>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={18}
                              className={
                                i < 4
                                  ? "text-yellow-500 fill-current"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600">
                          (24 reviews)
                        </span>
                      </div>
                      <div className="space-y-3">
                        <Review
                          author="John Doe"
                          rating={4}
                          date="2 days ago"
                          text="Great service and quality products! Highly recommend."
                        />
                        <button className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                          Write a Review
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* GELLERY TAB */}
              {activeTab === "gallery" && (
                <div>
                  <h2 className="text-lg font-semibold flex items-center gap-2 mb-2">
                    <ImageIcon size={18} className="text-blue-500" /> Gallery
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {profile.product_photos.length > 0 ? (
                      profile.product_photos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo.photo_path}
                          alt={`Product Photo ${index + 1}`}
                          className="w-full h-32 object-cover rounded-md border border-gray-200 hover:shadow-md transition-shadow duration-200"
                          onError={(e) => (e.target.src = defaultBusinessLogo)} // Fallback if image fails
                        />
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm col-span-full">
                        No photos available yet.
                      </p>
                    )}
                  </div>
                </div>
              )}
              {/* GELLERY TAB */}
              {activeTab === "reviews" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-800">
                      4.5
                    </span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={
                            i < 4
                              ? "text-yellow-500 fill-current"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">(24 reviews)</span>
                  </div>
                  <div className="space-y-3">
                    <Review
                      author="John Doe"
                      rating={4}
                      date="2 days ago"
                      text="Great service and quality products! Highly recommend."
                    />
                    <button className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                      Write a Review
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-4">
          {/* Contact Info */}
          <motion.div
            className="bg-white rounded-lg shadow p-4"
            initial="hidden"
            animate="visible"
            variants={fadeInRight}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold flex items-center gap-2">
                <Mail size={16} className="text-blue-500" /> Contact
              </h2>
              <button
                onClick={toggleContactVisibility}
                className="text-blue-500 hover:text-blue-700 text-xs flex items-center gap-1">
                {isContactVisible ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <ContactDetail
                icon={<Phone size={14} className="text-green-500" />}
                value={
                  isContactVisible
                    ? profile.contact_person_number
                    : "************"
                }
              />
              <ContactDetail
                icon={<Mail size={14} className="text-blue-500" />}
                value={
                  isContactVisible
                    ? profile.contact_person_email
                    : "****@*****.com"
                }
              />
              <ContactDetail
                icon={<MapPin size={14} className="text-red-500" />}
                value={`${profile.business_address}, ${profile.nearest_bus_stop}`}
              />
              {profile.business_website && (
                <ContactDetail
                  icon={<Globe size={14} className="text-purple-500" />}
                  value={
                    <a
                      href={profile.business_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline">
                      Website
                    </a>
                  }
                />
              )}
            </div>
          </motion.div>

          {/* Financials */}
          <motion.div
            className="bg-white rounded-lg shadow p-4"
            initial="hidden"
            animate="visible"
            variants={fadeInRight}>
            <h2 className="text-base font-semibold flex items-center gap-2 mb-3">
              <DollarSign size={16} className="text-green-500" /> Financials
            </h2>
            <div className="space-y-2 text-sm">
              <ProfileDetail
                icon={<DollarSign size={14} className="text-green-500" />}
                label="Daily"
                value={`₦${Number(profile.expected_daily_income).toLocaleString()}`}
              />
              <ProfileDetail
                icon={<DollarSign size={14} className="text-blue-500" />}
                label="Monthly"
                value={`₦${Number(profile.monthly_income).toLocaleString()}`}
              />
              <ProfileDetail
                icon={<DollarSign size={14} className="text-purple-500" />}
                label="Yearly"
                value={`₦${Number(profile.yearly_income).toLocaleString()}`}
              />
            </div>
          </motion.div>

          {/* Registration */}
          <motion.div
            className="bg-white rounded-lg shadow p-4"
            initial="hidden"
            animate="visible"
            variants={fadeInRight}>
            <h2 className="text-base font-semibold flex items-center gap-2 mb-3">
              <Briefcase size={16} className="text-gray-500" /> Registration
            </h2>
            <div className="space-y-2 text-sm">
              <ProfileDetail
                icon={<Briefcase size={14} className="text-blue-500" />}
                label="Reg No"
                value={profile.business_reg_number}
              />
              <ProfileDetail
                icon={<Briefcase size={14} className="text-purple-500" />}
                label="TIN"
                value={profile.tin_number}
              />
            </div>
          </motion.div>

          {/* Social Media */}
          <motion.div
            className="bg-white rounded-lg shadow p-4"
            initial="hidden"
            animate="visible"
            variants={fadeInRight}>
            <h2 className="text-base font-semibold flex items-center gap-2 mb-3">
              <Globe size={16} className="text-purple-500" /> Social
            </h2>
            <div className="space-y-2 text-sm">
              {Object.entries(socialMedia).map(
                ([platform, url], index) =>
                  url && (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-500 hover:underline">
                      <Globe size={14} />
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </a>
                  )
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Components
const ProfileDetail = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 text-gray-700">
    {icon} <span className="text-xs text-gray-500">{label}:</span>{" "}
    <span className="font-medium">{value || "N/A"}</span>
  </div>
);

const ContactDetail = ({ icon, value }) => (
  <div className="flex items-center gap-2 text-gray-700">
    {icon} <span className="text-sm truncate">{value || "N/A"}</span>
  </div>
);

const Review = ({ author, rating, date, text }) => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
      <User size={16} className="text-gray-500" />
    </div>
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <p className="font-medium text-gray-800 text-sm">{author}</p>
        <p className="text-xs text-gray-500">{date}</p>
      </div>
      <div className="flex gap-1 my-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={
              i < rating ? "text-yellow-500 fill-current" : "text-gray-300"
            }
          />
        ))}
      </div>
      <p className="text-gray-700 text-sm">{text}</p>
    </div>
  </div>
);

export default SingleBusinessPage;
