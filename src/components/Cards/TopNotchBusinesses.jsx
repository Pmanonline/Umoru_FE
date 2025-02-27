import React from "react";
import {
  MapPin,
  Mail,
  Share2,
  Check,
  Star,
  ExternalLink,
  Clock,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
import ADS from "../../assets/images/ads.jpg";

const BusinessCard = ({ business }) => (
  <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">
    <div className="flex flex-col sm:flex-row lg:flex-row">
      {/* Image Section */}
      <div className="relative w-full sm:w-1/3 lg:w-1/3 shrink-0">
        <img
          src={business.image}
          alt={business.name}
          className="w-full h-48 sm:h-56 md:h-64 lg:h-full object-cover"
        />
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-black/70 backdrop-blur-sm text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs flex items-center">
          <Clock size={12} className="mr-1 sm:mr-1.5" />
          {business.since}
        </div>
        <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-white/90 backdrop-blur-lg text-gray-800 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs flex items-center gap-1 sm:gap-2">
          <Eye size={12} sm:size={14} className="text-gray-600" />
          {business?.views?.count || 0} views
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-4 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          {/* Header with Rating */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0">
            <div className="space-y-1 sm:space-y-2">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">
                {business.name}
              </h3>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      sm:size={16}
                      className="fill-yellow-400 stroke-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-gray-600">
                  ({business.rating} reviews)
                </span>
              </div>
            </div>
            <button
              className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Share">
              <Share2 size={16} sm:size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Services Tags */}
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {business.services.split(",").map((service, idx) => (
              <span
                key={idx}
                className="inline-block bg-gray-100 text-gray-700 text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-full hover:bg-gray-200 transition-colors truncate max-w-[150px] sm:max-w-[200px]">
                {service.trim()}
              </span>
            ))}
          </div>

          {/* Contact Info */}
          <div className="space-y-1 sm:space-y-2">
            <div className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
              <MapPin size={16} sm:size={18} className="mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm truncate">
                {business.location}
              </span>
            </div>
            <div className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
              <Mail size={16} sm:size={18} className="mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm truncate">
                {business.email}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3 sm:pt-4 border-t border-gray-100 gap-2 sm:gap-0">
            <div
              className={`flex items-center ${
                business.verifiedPercentage >= 80
                  ? "text-green-600"
                  : "text-amber-600"
              }`}>
              <Check size={16} sm:size={18} className="mr-1 sm:mr-1.5" />
              <span className="text-xs sm:text-sm font-medium">
                {business.verifiedPercentage}% Verified
              </span>
            </div>
            <Link
              to={`/business/${business.businessId}`}
              className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-red-600 text-white transition-all duration-300 hover:bg-red-700 hover:scale-105 whitespace-nowrap">
              View Details
              <ExternalLink size={14} sm:size={16} className="ml-1 sm:ml-1.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const TopNotchBusinesses = () => {
  const businesses = [
    {
      businessId: "BU1623871",
      name: "James Restaurant",
      services: "Agricultural Services, Birthcakes | Lawyer, Baby sitter",
      since: "Since 02-October-2023",
      rating: "5,907",
      location: "Ikeja, Lagos",
      email: "000.samrole202@gmail.com",
      verifiedPercentage: 43,
      image: "/src/assets/images/businessCard1.png",
      link: "https://edirect.essential.ng/company",
    },
    {
      businessId: "BU1623872",
      name: "Bekky Laundry",
      services: "A.C Gas Filling, A.C Repair Service, Accessories Repair",
      since: "Since 02-October-2023",
      rating: "5,907",
      location: "Ikeja, Lagos",
      email: "000.samrole202@gmail.com",
      verifiedPercentage: 100,
      image: "/src/assets/images/businessCard1.png",
      link: "https://edirect.essential.ng/company",
    },
    {
      businessId: "BU1623873",
      name: "Charlie Support Cars",
      services: "A.C GAS FILLING, AC Repair Service, Accessories Repair",
      since: "Since 02-October-2023",
      rating: "5,907",
      location: "Ikeja, Lagos",
      email: "000.samrole202@gmail.com",
      verifiedPercentage: 87,
      image: "/src/assets/images/businessCard1.png",
      link: "https://edirect.essential.ng/company",
    },
  ];

  const books = [
    {
      title: "Explore the World",
      image: "/src/assets/images/recommendbooks2.png",
    },
    {
      title: "Business Growth",
      image: "/src/assets/images/recommendbooks.png",
    },
    {
      title: "New World Order",
      image: "/src/assets/images/recommendbooks3.png",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Top Notch Businesses in Nigeria
        </h2>
        <Link
          to="/business"
          className="text-red-600 hover:text-red-700 font-medium flex items-center mid:text-sm">
          View All
          <ExternalLink size={16} className="ml-1.5" />
        </Link>
      </div>

      <div className="grid lg:grid-cols-[1fr,300px] gap-6 sm:gap-8">
        <div className="space-y-6">
          {businesses.map((business, index) => (
            <BusinessCard key={index} business={business} />
          ))}
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6"></h3>
            <img src={ADS} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNotchBusinesses;
