import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Mail,
  ExternalLink,
  Share2,
  Star,
  Phone,
  Clock,
  Eye,
} from "lucide-react";

function BusinessCard({ business }) {
  const handleShare = (business) => {
    // Implement share functionality
    console.log("Sharing business:", business.name);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden relative max-w-[600px]">
      <div className="relative">
        <img
          src={business?.image || "https://via.placeholder.com/300x200"}
          alt={business?.name}
          className="w-full h-36 object-cover"
        />
        {/* Top Overlays */}
        <div className="absolute top-0 left-0 right-0 p-2 flex justify-between items-start">
          {business?.sinceDate && (
            <div className="bg-black/70 text-white px-3 py-1.5 rounded-full text-xs flex items-center">
              <Clock size={12} className="mr-1.5" />
              {business.sinceDate}
            </div>
          )}
          <div className="bg-black/70 text-white px-3 py-1.5 rounded-full flex items-center">
            <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400 mr-1.5" />
            <span className="text-sm font-medium">
              {business?.rating?.toFixed(1) || "N/A"}
            </span>
            <span className="text-sm ml-1">({business?.reviews || 0})</span>
          </div>
        </div>
        {/* Bottom Overlay */}
        <div className="absolute bottom-2 left-2 bg-white/90 text-gray-800 px-2 py-1 rounded-md text-xs flex items-center">
          <Eye size={14} className="mr-1 text-gray-600" />
          {business?.views?.toLocaleString() || 0} views
        </div>
      </div>

      {/* Business Details */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {business?.name || "Unnamed Business"}
        </h3>

        {business?.category && (
          <div className="flex flex-wrap gap-2 mb-2">
            {business.category.split(",").map((category, index) => (
              <span
                key={index}
                className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                {category.trim()}
              </span>
            ))}
          </div>
        )}

        <div className="space-y-2 text-sm">
          <div className="flex items-center text-gray-600">
            <MapPin size={16} className="mr-1 text-blue-500" />
            <span>{business?.address || "Address not available"}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Mail size={16} className="mr-1 text-red-500" />
            <span>{business?.owner?.email || "Email not provided"}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Phone size={16} className="mr-1 text-green-500" />
            <span>{business?.owner?.phone || "Phone not available"}</span>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => handleShare(business)}
            className="px-2 py-1 border bg-gray-100 text-sm flex rounded-full transition-colors hover:border-blue-500 hover:border"
            aria-label="Share">
            <Share2 size={12} className="text-blue-500 mr-1 mt-1 " /> Share
          </button>
          <Link
            to={`/business/${business?.id}`}
            className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors hover:rotate-1">
            View Business
            <ExternalLink size={14} className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BusinessCard;
