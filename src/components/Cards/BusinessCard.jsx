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
  console.log(business, "Business");
  const handleShare = () => {
    const shareUrl = `${window.location.origin}/business/${business.slug}`;
    if (navigator.share) {
      navigator
        .share({
          title: `${business.name} Business Profile`,
          text: `Check out ${business.name}`,
          url: shareUrl,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => alert("Business link copied to clipboard!"))
        .catch((err) => console.error("Could not copy text: ", err));
    }
  };

  const getRandomGradient = () => {
    const gradients = [
      "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)",
      "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
    ];
    return gradients[business.id % gradients.length];
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <div className="mid:flex mid:flex-row p-3 gap-3">
        {/* Logo - Rounded and displayed on left side for all screen sizes */}
        <div className="relative flex-shrink-0">
          <div
            style={{
              background: business.image ? "none" : getRandomGradient(),
              width: "70px",
              height: "70px",
            }}
            className="rounded-full flex items-center justify-center overflow-hidden">
            {business.image ? (
              <img
                src={business.image}
                alt={business.name}
                className="w-full h-full object-cover"
                onError={(e) => (e.target.style.display = "none")}
              />
            ) : (
              <Eye size={28} className="text-gray-400" />
            )}
          </div>
        </div>

        {/* Business Details - Always to the right of the logo */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-bold text-gray-900 truncate">
              {business.name || "Unnamed Business"}
            </h3>
          </div>

          {/* Rating and Reviews */}
          <div className="flex items-center mb-2">
            <Star
              className="w-4 h-4 fill-yellow-400 stroke-yellow-400 mr-1"
              size={14}
            />
            <span className="text-sm font-medium">
              {business.rating?.toFixed(1) || "N/A"}
            </span>
            <span className="text-xs text-gray-500 ml-1">
              ({business.reviews || 0} reviews)
            </span>
            <div className="ml-3 flex items-center">
              <Eye size={12} className="mr-1 text-gray-500" />
              <span className="text-xs text-gray-500">
                {business.views?.toLocaleString() || 0}
              </span>
            </div>
          </div>

          {/* Categories */}
          {business.category && (
            <div className="flex flex-wrap gap-1 mb-2">
              {business.category
                .split(",")
                .slice(0, 2)
                .map((category, index) => (
                  <span
                    key={index}
                    className="inline-block bg-red-50 text-red-700 text-xs px-2 py-0.5 rounded-full border border-red-100 truncate max-w-full">
                    {category.trim()}
                  </span>
                ))}
              {business.category.split(",").length > 2 && (
                <span className="inline-block text-xs text-gray-500">
                  +{business.category.split(",").length - 2} more
                </span>
              )}
            </div>
          )}

          {/* Contact Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1 gap-x-4 text-xs text-gray-600">
            <div className="flex items-center truncate">
              <MapPin size={14} className="mr-1.5 text-red-500 flex-shrink-0" />
              <span className="truncate">
                {business.address || "Not specified"}
              </span>
            </div>
            <div className="flex items-center truncate">
              <Mail size={14} className="mr-1.5 text-blue-500 flex-shrink-0" />
              <span className="truncate">
                {business.owner?.email || "Not provided"}
              </span>
            </div>
            <div className="flex items-center truncate md:col-span-2">
              <Phone
                size={14}
                className="mr-1.5 text-green-500 flex-shrink-0"
              />
              <span className="truncate">
                {business.owner?.phone || "Not available"}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-3 flex justify-between items-center">
            <button
              onClick={handleShare}
              className="px-2 py-1 border bg-gray-50 text-xs flex items-center rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Share">
              <Share2 size={12} className="text-blue-500 mr-1" /> Share
            </button>
            <Link
              to={`/SingleBusinessPage/${business.slug}`}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-600 text-white hover:bg-red-700 transition-colors">
              View Business
              <ExternalLink size={12} className="ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusinessCard;
