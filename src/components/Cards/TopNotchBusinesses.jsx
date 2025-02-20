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

const BusinessCard = ({ business }) => (
  <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
    <div className="flex flex-col lg:flex-row">
      {/* Image Section */}
      <div className="relative lg:w-1/3">
        <img
          src={business.image}
          alt={business.name}
          className="w-full h-64 lg:h-full object-cover"
        />

        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs flex items-center">
          <Clock size={12} className="mr-1.5" />
          {business.since}
        </div>
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-lg text-gray-800 px-3 py-1.5 rounded-md text-xs flex items-center gap-2">
          <Eye size={14} className="text-gray-600" />
          {business?.views?.count || 0} views
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-6">
        <div className="space-y-4">
          {/* Header with Rating */}
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">
                {business.name}
              </h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className="fill-yellow-400 stroke-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({business.rating} reviews)
                </span>
              </div>
            </div>
            <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Share">
              <Share2 size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Services Tags */}
          <div className="flex flex-wrap gap-2">
            {business.services.split(",").map((service, idx) => (
              <span
                key={idx}
                className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full hover:bg-gray-200 transition-colors">
                {service.trim()}
              </span>
            ))}
          </div>

          {/* Contact Info */}
          <div className="space-y-2">
            <div className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
              <MapPin size={18} className="mr-2" />
              <span className="text-sm">{business.location}</span>
            </div>
            <div className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
              <Mail size={18} className="mr-2" />
              <span className="text-sm">{business.email}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div
              className={`flex items-center ${
                business.verifiedPercentage >= 80
                  ? "text-green-600"
                  : "text-amber-600"
              }`}>
              <Check size={18} className="mr-1.5" />
              <span className="text-sm font-medium">
                {business.verifiedPercentage}% Verified
              </span>
            </div>

            <Link
              to={`/business/${business.businessId}`}
              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-red-600 text-white transition-all duration-300 hover:bg-red-700 hover:scale-105">
              View Details
              <ExternalLink size={16} className="ml-1.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const FeaturedBook = ({ book }) => (
  <div className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
    <img
      src={book.image}
      alt={book.title}
      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
      <h3 className="text-white font-medium p-4">{book.title}</h3>
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
        <h2 className="text-3xl font-bold text-gray-900">
          Top Notch Businesses in Nigeria
        </h2>
        <Link
          to="https://edirect.essential.ng/company"
          target="_blank"
          className="text-red-600 hover:text-red-700 font-medium flex items-center">
          View All
          <ExternalLink size={16} className="ml-1.5" />
        </Link>
      </div>

      <div className="grid lg:grid-cols-[1fr,300px] gap-8">
        <div className="space-y-6">
          {businesses.map((business, index) => (
            <BusinessCard key={index} business={business} />
          ))}
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Featured Books
            </h3>
            <div className="space-y-4">
              {books.map((book, index) => (
                <FeaturedBook key={index} book={book} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNotchBusinesses;
