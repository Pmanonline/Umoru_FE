import React, { useState } from "react";
import {
  MapPin,
  Mail,
  Phone,
  Star,
  Share2,
  Flag,
  MessageCircle,
  DollarSign,
  Calendar,
  Users,
  Briefcase,
  Globe,
  User,
  Building2,
  Clock,
  ShieldCheck,
  BadgeInfo,
} from "lucide-react";

const SingleBusinessPage = () => {
  const [selectedRating, setSelectedRating] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [isContactVisible, setIsContactVisible] = useState(false);

  const businessData = {
    name: "A.K Fashion Designer",
    address: "No 2, Bolaji street, Alausa, Ikeja, Lagos",
    businessId: "0140",
    contact: "09162035090",
    email: "akfashion@example.com",
    website: "www.akfashiondesigner.com",
    established: "23 Apr 2012",
    founder: "Mr. Babatunde Abduakim (CEO)",
    rating: 5,
    category: ["Fashion Design", "Artists"],
    businessType: "Private Limited Company",
    businessLine: "Services",
    registrationNumber: "Not Specified",
    tinNumber: "Not Specified",
    taxRegistered: false,
    nearestBusStop: "Alausa Bus/stop",
    landmark: "Testing Ground",
    operatingHours: "8am- 10pm",
    staffCount: "1-10",
    services: "Fashion Design",
    targetAudience: "General Public",
    annualRevenue: "$50,000 - $100,000",
    staffList: [
      { name: "Mr. Tunde", position: "Manager" },
      { name: "Mr. Babatunde", position: "CEO" },
    ],
    reviews: [
      {
        name: "Peter Chidubem Uche",
        rating: 5,
        text: "awesome!",
        date: "10 Feb 2025",
      },
    ],
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: businessData.name,
          text: `Check out ${businessData.name} - ${businessData.services}`,
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert("Business link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleSubmitReview = () => {
    if (!selectedRating || !reviewText.trim()) {
      alert("Please provide both rating and review text");
      return;
    }
    console.log("Submitting review", {
      rating: selectedRating,
      review: reviewText,
    });
    setSelectedRating(null);
    setReviewText("");
  };

  const toggleContactVisibility = () => {
    setIsContactVisible(!isContactVisible);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      {/* Business Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl shadow-2xl text-white overflow-hidden">
        <div className="p-8 flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-white/10 flex items-center justify-center">
                <Building2 size={40} className="text-white/80" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">{businessData.name}</h1>
                <div className="flex items-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${i < businessData.rating ? "text-yellow-400 fill-current" : "text-white/30"}`}
                    />
                  ))}
                  <span className="ml-3 text-white/80">
                    ({businessData.reviews.length} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-pink-200" />
                <span>{businessData.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-green-200" />
                <span>{businessData.operatingHours}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 w-full md:w-auto">
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl transition-all">
              <Share2 size={20} />
              Share Business
            </button>
            <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl transition-all">
              <MessageCircle size={20} />
              Send Message
            </button>
            <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl transition-all">
              <Flag size={20} />
              Report
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Contact Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Mail className="text-blue-600" />
              Contact Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                <Phone className="w-6 h-6 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium">
                    {isContactVisible ? businessData.contact : "••••••••••"}
                  </p>
                </div>
                <button
                  onClick={toggleContactVisibility}
                  className="text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg transition-colors">
                  {isContactVisible ? "Hide" : "Show"}
                </button>
              </div>

              {/* Similar blocks for Email and Website */}
            </div>
          </div>

          {/* Business Details Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <BadgeInfo className="text-purple-600" />
              Business Overview
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <DetailItem
                  icon={<Calendar className="w-6 h-6 text-orange-500" />}
                  label="Established Date"
                  value={businessData.established}
                />
                <DetailItem
                  icon={<Users className="w-6 h-6 text-green-500" />}
                  label="Staff Count"
                  value={businessData.staffCount}
                />
              </div>
              <div className="space-y-4">
                <DetailItem
                  icon={<DollarSign className="w-6 h-6 text-blue-500" />}
                  label="Annual Revenue"
                  value={businessData.annualRevenue}
                />
                <DetailItem
                  icon={<ShieldCheck className="w-6 h-6 text-red-500" />}
                  label="Business Type"
                  value={businessData.businessType}
                />
              </div>
            </div>
          </div>

          {/* Staff Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Users className="text-purple-600" />
              Team Members
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {businessData.staffList.map((staff, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{staff.name}</h3>
                    <p className="text-sm text-gray-500">{staff.position}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Review Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Star className="text-yellow-500 fill-current" />
              Leave a Review
            </h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <Star
                    key={num}
                    onClick={() => setSelectedRating(num)}
                    className={`w-8 h-8 cursor-pointer transition-transform hover:scale-110 ${
                      selectedRating && selectedRating >= num
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <textarea
                className="w-full border rounded-xl p-4 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                rows="4"
                placeholder="Share your experience..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
              <button
                onClick={handleSubmitReview}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors font-semibold">
                Submit Review
              </button>
            </div>
          </div>

          {/* Existing Reviews */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MessageCircle className="text-green-600" />
              Customer Reviews
            </h2>
            <div className="space-y-6">
              {businessData.reviews.map((review, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <User className="text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{review.name}</h4>
                      <div className="flex items-center gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">{review.text}</p>
                  <span className="text-sm text-gray-500 mt-2 block">
                    {review.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-4">
    <div className="w-10 h-10 rounded-lg bg-opacity-20 bg-current flex items-center justify-center">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

export default SingleBusinessPage;
